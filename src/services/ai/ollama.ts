import { dataUrlToBase64 } from "../image";
import { verificationSchema, type VerificationPayload } from "./schemas";

export const DEFAULT_OLLAMA_URL = "http://127.0.0.1:11434";
export const DEFAULT_OLLAMA_MODEL = "granite3.2-vision";

export class OllamaError extends Error {
  constructor(message: string, public readonly code: "OFFLINE" | "MODEL_MISSING" | "HTTP" | "INVALID_RESPONSE" | "UNKNOWN" = "UNKNOWN") {
    super(message);
    this.name = "OllamaError";
  }
}

export interface OllamaConfig {
  baseUrl: string;
  model: string;
}

export function getOllamaConfig(): OllamaConfig {
  return {
    baseUrl: (import.meta.env.VITE_OLLAMA_BASE_URL || DEFAULT_OLLAMA_URL).replace(/\/$/, ""),
    model: import.meta.env.VITE_OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL,
  };
}

interface TagsResponse { models?: Array<{ name: string }>; }
interface ChatResponse { message?: { content?: string }; response?: string; }

export async function listOllamaModels(config = getOllamaConfig()): Promise<string[]> {
  try {
    const response = await fetch(`${config.baseUrl}/api/tags`);
    if (!response.ok) throw new OllamaError(`Ollama returned HTTP ${response.status}.`, "HTTP");
    const body = (await response.json()) as TagsResponse;
    return (body.models ?? []).map((model) => model.name);
  } catch (error) {
    if (error instanceof OllamaError) throw error;
    throw new OllamaError("Ollama is not reachable. Start Ollama and try again.", "OFFLINE");
  }
}

export async function checkOllama(config = getOllamaConfig()): Promise<{ ok: true; model: string; models: string[] }> {
  const models = await listOllamaModels(config);
  const exact = models.includes(config.model);
  const base = config.model.split(":")[0];
  const available = models.find((name) => name.split(":")[0] === base);
  if (!exact && !available) {
    throw new OllamaError(`Vision model "${config.model}" is not installed. Run: ollama pull ${config.model}`, "MODEL_MISSING");
  }
  return { ok: true, model: available ?? config.model, models };
}

function parseModelJson(content: string): unknown {
  const cleaned = content.trim().replace(/^\`\`\`(?:json)?\s*/i, "").replace(/\s*\`\`\`$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { /* continue */ }
    }
    throw new OllamaError(`The vision model returned invalid JSON.\\n\\nModel response:\\n${content.slice(0, 1000)}`, "INVALID_RESPONSE");
  }
}

function normalizeVerificationResult(value: unknown): VerificationPayload {
  if (!value || typeof value !== "object") {
    throw new OllamaError("The vision model returned an unexpected response format.", "INVALID_RESPONSE");
  }

  const raw = value as Record<string, unknown>;
  const direct = verificationSchema.safeParse(raw);
  if (direct.success) return direct.data;

  const matchedCandidate = raw.matched ?? raw.match ?? raw.is_match ?? raw.success ?? raw.valid;
  const confidenceCandidate = raw.confidence ?? raw.score ?? raw.probability ?? raw.certainty;
  const evidenceCandidate = raw.evidence ?? raw.observations ?? raw.details ?? raw.features;
  const explanationCandidate = raw.explanation ?? raw.reason ?? raw.reasoning ?? raw.description ?? raw.message;

  let matched: boolean | undefined;
  if (typeof matchedCandidate === "boolean") matched = matchedCandidate;
  else if (typeof matchedCandidate === "string") {
    const normalized = matchedCandidate.trim().toLowerCase();
    if (["true", "yes", "match", "matched", "valid", "correct"].includes(normalized)) matched = true;
    else if (["false", "no", "mismatch", "not matched", "invalid", "incorrect"].includes(normalized)) matched = false;
  }

  let confidence: number | undefined;
  if (typeof confidenceCandidate === "number") confidence = confidenceCandidate;
  else if (typeof confidenceCandidate === "string") {
    const parsed = Number.parseFloat(confidenceCandidate);
    if (Number.isFinite(parsed)) confidence = parsed > 1 ? parsed / 100 : parsed;
  }
  if (confidence !== undefined) confidence = Math.max(0, Math.min(1, confidence));

  let evidence: string[] = [];
  if (Array.isArray(evidenceCandidate)) evidence = evidenceCandidate.filter((item): item is string => typeof item === "string").slice(0, 8);
  else if (typeof evidenceCandidate === "string") evidence = [evidenceCandidate];

  let explanation = typeof explanationCandidate === "string" ? explanationCandidate.trim() : "";
  if (!explanation) {
    if (evidence.length > 0) explanation = evidence.join("; ");
    else if (matched !== undefined) explanation = matched ? "The image appears to satisfy the mission." : "The image does not appear to satisfy the mission.";
  }

  const result = verificationSchema.safeParse({ matched, confidence, evidence, explanation });
  if (!result.success) {
    throw new OllamaError(`The vision model response could not be converted into the WildHunt verification format.\\n\\nRaw response:\\n${JSON.stringify(raw, null, 2).slice(0, 1500)}`, "INVALID_RESPONSE");
  }
  return result.data;
}

export async function verifyImageWithOllama(mission: string, dataUrl: string, config = getOllamaConfig()): Promise<VerificationPayload> {
  const base64 = dataUrlToBase64(dataUrl);
  const response = await fetch(`${config.baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      stream: false,
      format: "json",
      options: { temperature: 0 },
      messages: [{
        role: "user",
        content: `You are the visual verification engine for WildHunt.

Your ONLY task is to determine whether the supplied photograph satisfies the specific WildHunt mission below.

MISSION:
${mission}

Return ONLY one valid JSON object.

The JSON MUST use exactly this structure:

{
  "matched": true,
  "confidence": 0.91,
  "evidence": ["visible evidence from the photograph"],
  "explanation": "Short explanation of why the photograph does or does not satisfy the mission."
}

Rules:
- "matched" must be a boolean: true or false.
- "confidence" must be a number between 0 and 1.
- "evidence" must be an array of short strings.
- "explanation" must be a concise string.
- Do not return markdown.
- Do not return code fences.
- Do not return additional fields.
- Do not describe your instructions.
- Judge only what is actually visible in the photograph.`.trim(),
        images: [base64],
      }],
    }),
  });

  if (!response.ok) throw new OllamaError(`Ollama vision request failed with HTTP ${response.status}.`, "HTTP");
  const body = (await response.json()) as ChatResponse;
  const content = body.message?.content ?? body.response;
  if (!content) throw new OllamaError("Ollama returned no vision result.", "INVALID_RESPONSE");
  return normalizeVerificationResult(parseModelJson(content));
}