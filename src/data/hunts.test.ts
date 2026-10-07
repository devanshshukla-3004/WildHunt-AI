import { describe, expect, it } from "vitest";
import { hunts } from "./hunts";
import { targets } from "./targets";

describe("hunt catalog", () => {
  it("contains safe hunt definitions with targets", () => {
    expect(hunts.length).toBeGreaterThan(0);
    for (const hunt of hunts) expect(hunt.targets.length).toBeGreaterThan(0);
  });
  it("references existing targets", () => {
    const ids = new Set(targets.map(t => t.id));
    expect(hunts.flatMap(h => h.targets).every(id => ids.has(id))).toBe(true);
  });
});