import { describe, expect, it } from "vitest";
import { getOllamaConfig } from "./ollama";
import { verificationSchema } from "./schemas";

describe("Ollama integration", () => {
  it("uses the local Ollama defaults", () => {
    const config = getOllamaConfig();
    expect(config.baseUrl).toBe("http://127.0.0.1:11434");
    expect(config.model).toBe("granite3.2-vision");
  });
  it("validates mission verification results", () => {
    const parsed = verificationSchema.parse({ matched: true, confidence: 0.91, evidence: ["yellow flower"], explanation: "Visible yellow flower." });
    expect(parsed.matched).toBe(true);
  });
});