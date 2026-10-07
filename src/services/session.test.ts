import { describe, expect, it } from "vitest";
import { createSession, currentTargetId, markVerified } from "./session";

describe("session", () => {
  it("starts at the first target", () => {
    const s = createSession("nature", ["a", "b"]);
    expect(currentTargetId(s)).toBe("a");
  });
  it("moves after verification", () => {
    const s = markVerified(createSession("nature", ["a", "b"]));
    expect(s.verified).toEqual(["a"]);
    expect(currentTargetId(s)).toBe("b");
  });
});