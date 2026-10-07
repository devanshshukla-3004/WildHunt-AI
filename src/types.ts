export type HuntCategory = "Nature" | "Urban Explorer" | "Colors" | "Texture" | "Observation" | "Landmark Hunt";

export interface HuntTarget {
  id: string;
  title: string;
  prompt: string;
  category: HuntCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  safety: string[];
}

export interface HuntDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  targets: string[];
}

export interface VerificationResult {
  matched: boolean;
  confidence: number;
  evidence: string[];
  explanation: string;
}

export type AIStatus =
  | { state: "checking"; message: string }
  | { state: "offline"; message: string }
  | { state: "model-missing"; message: string; models: string[] }
  | { state: "ready"; message: string; model: string }
  | { state: "error"; message: string };

export interface SessionState {
  huntId: string;
  targetIds: string[];
  currentIndex: number;
  verified: string[];
  startedAt: number;
}
