/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { describe, it, test, expect } from "vitest";
import { enemies, zones } from "./enemies";

describe("cryptominer enemy (GDD §7.1)", () => {
  it("is registered with the expected shape", () => {
    const def = enemies["cryptominer"];
    expect(def).toBeDefined();
    expect(def.id).toBe("cryptominer");
    expect(def.name).toBe("Cryptominer");
    expect(def.baseHp).toBeGreaterThan(0);
    expect(def.moves.length).toBeGreaterThanOrEqual(3);
    expect(def.xpReward).toBeGreaterThan(0);
    expect(def.bitsReward).toBeGreaterThan(0);
  });

  it("has a Mine Block move that drains energy", () => {
    const def = enemies["cryptominer"];
    const mine = def.moves.find((m) => m.name === "Mine Block");
    expect(mine).toBeDefined();
    expect(mine!.power).toBeGreaterThan(0);
  });
});

describe("overworld zone config (Digital Sea)", () => {
  it("is registered with the canonical enemy pool", () => {
    const cfg = zones["overworld"];
    expect(cfg).toBeDefined();
    expect(cfg.encounterRate).toBeGreaterThan(0);
    expect(cfg.encounterRate).toBeLessThan(1);
    expect(cfg.enemies).toEqual(
      expect.arrayContaining(["script-kiddie", "ransomware-bot", "cryptominer"]),
    );
  });
});

test.todo(
  "overworld zone config includes mixer-bot, rug-puller, wallet-drainer (ships in M3)",
);
