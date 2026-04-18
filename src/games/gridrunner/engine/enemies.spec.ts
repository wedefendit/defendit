/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { describe, it, expect } from "vitest";
import { bosses, enemies, zones } from "./enemies";

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

/* ================================================================== */
/*  M3: Crypto Exchange enemies (GDD §7.1)                            */
/* ================================================================== */

describe("mixer-bot enemy (GDD §7.1)", () => {
  it("is registered with the expected shape and three moves", () => {
    const def = enemies["mixer-bot"];
    expect(def).toBeDefined();
    expect(def.id).toBe("mixer-bot");
    expect(def.name).toBe("Mixer Bot");
    expect(def.baseHp).toBeGreaterThan(0);
    expect(def.moves).toHaveLength(3);
    expect(def.xpReward).toBeGreaterThan(0);
    expect(def.bitsReward).toBeGreaterThan(0);
  });

  it("has Obfuscate / Tumble / Exit Liquidity moves per the GDD", () => {
    const def = enemies["mixer-bot"];
    const names = def.moves.map((m) => m.name);
    expect(names).toEqual(
      expect.arrayContaining(["Obfuscate", "Tumble", "Exit Liquidity"]),
    );
  });
});

describe("rug-puller enemy (GDD §7.1)", () => {
  it("is registered with the expected shape and three moves", () => {
    const def = enemies["rug-puller"];
    expect(def).toBeDefined();
    expect(def.id).toBe("rug-puller");
    expect(def.name).toBe("Rug Puller");
    expect(def.baseHp).toBeGreaterThan(0);
    expect(def.moves).toHaveLength(3);
    expect(def.xpReward).toBeGreaterThan(0);
    expect(def.bitsReward).toBeGreaterThan(0);
  });

  it("has Hype Pump / Pull Liquidity / Fake Audit moves per the GDD", () => {
    const def = enemies["rug-puller"];
    const names = def.moves.map((m) => m.name);
    expect(names).toEqual(
      expect.arrayContaining(["Hype Pump", "Pull Liquidity", "Fake Audit"]),
    );
  });
});

describe("wallet-drainer enemy (GDD §7.1)", () => {
  it("is registered with the expected shape and three moves", () => {
    const def = enemies["wallet-drainer"];
    expect(def).toBeDefined();
    expect(def.id).toBe("wallet-drainer");
    expect(def.name).toBe("Wallet Drainer");
    expect(def.baseHp).toBeGreaterThan(0);
    expect(def.moves).toHaveLength(3);
    expect(def.xpReward).toBeGreaterThan(0);
    expect(def.bitsReward).toBeGreaterThan(0);
  });

  it("has Malicious Approve / Signature Request / Address Poisoning moves", () => {
    const def = enemies["wallet-drainer"];
    const names = def.moves.map((m) => m.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "Malicious Approve",
        "Signature Request",
        "Address Poisoning",
      ]),
    );
  });
});

describe("TraderTraitor mini-boss (GDD §7.2)", () => {
  it("exists in the boss registry with the canonical stats", () => {
    const def = bosses["trader-traitor"];
    expect(def).toBeDefined();
    expect(def.id).toBe("trader-traitor");
    expect(def.name).toBe("TraderTraitor");
    expect(def.baseHp).toBe(280);
    // Recon weakness: tracing money flows is reconnaissance (GDD §7.2).
    expect(def.weakness).toBe("recon");
  });

  it("has exactly four attacks per the GDD roster", () => {
    const def = bosses["trader-traitor"];
    expect(def.moves).toHaveLength(4);
    const names = def.moves.map((m) => m.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "Chain Hop",
        "Mixer Deploy",
        "Bridge Exploit",
        "Cold Wallet Stash",
      ]),
    );
  });
});

describe("exchange zone config (GDD §4.2, §7.1)", () => {
  it("is registered with the Crypto Exchange enemy pool and 0.3 encounter rate", () => {
    const cfg = zones["exchange"];
    expect(cfg).toBeDefined();
    expect(cfg.encounterRate).toBeCloseTo(0.3);
  });

  // Activates the M0 `.todo` stub. Per GDD §7.1, Mixer Bot / Rug Puller /
  // Wallet Drainer live in the Crypto Exchange, NOT the overworld pool --
  // the original M0 comment mislabeled the zone. Corrected here.
  it("enemy pool includes cryptominer, mixer-bot, rug-puller, wallet-drainer", () => {
    const cfg = zones["exchange"];
    expect(cfg.enemies).toEqual(
      expect.arrayContaining([
        "cryptominer",
        "mixer-bot",
        "rug-puller",
        "wallet-drainer",
      ]),
    );
  });
});
