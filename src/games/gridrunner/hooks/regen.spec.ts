/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { describe, expect, it } from "vitest";
import { applyRegen } from "./useGridRunner";
import type { PlayerState } from "../engine/types";

function basePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    level: 1,
    xp: 0,
    xpToNext: 50,
    integrity: 50,
    maxIntegrity: 100,
    compute: 30,
    maxCompute: 60,
    bandwidth: 10,
    firewall: 5,
    ...overrides,
  };
}

describe("applyRegen", () => {
  it("increments HP by 2 and EN by 1", () => {
    const result = applyRegen(basePlayer());
    expect(result.integrity).toBe(52);
    expect(result.compute).toBe(31);
    // Untouched fields
    expect(result.maxIntegrity).toBe(100);
    expect(result.level).toBe(1);
  });

  it("clamps integrity and compute at their maximums", () => {
    const result = applyRegen(
      basePlayer({ integrity: 99, compute: 60 }),
    );
    expect(result.integrity).toBe(100);
    expect(result.compute).toBe(60);
  });

  it("is a no-op when both stats are already full", () => {
    const full = basePlayer({ integrity: 100, compute: 60 });
    const result = applyRegen(full);
    expect(result.integrity).toBe(100);
    expect(result.compute).toBe(60);
  });
});
