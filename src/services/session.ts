import type { SessionState } from "../types";

export function createSession(huntId: string, targetIds: string[]): SessionState {
  return { huntId, targetIds, currentIndex: 0, verified: [], startedAt: Date.now() };
}

export function currentTargetId(session: SessionState): string | undefined {
  return session.targetIds[session.currentIndex];
}

export function markVerified(session: SessionState): SessionState {
  const id = currentTargetId(session);
  if (!id) return session;
  return { ...session, verified: [...session.verified, id], currentIndex: session.currentIndex + 1 };
}