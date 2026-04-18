/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { describe, it, expect } from "vitest";
import { exchangeMap } from "./crypto-exchange";

/**
 * Structural contracts for the Crypto Exchange interior map (M3).
 * Medium Interior per GDD §4.10 -- 14x10, two rooms + corridor, entry at
 * bottom-left, boss top-right.
 */

const W = exchangeMap.width;
const H = exchangeMap.height;
const ALL = exchangeMap.tiles.flat();

describe("Crypto Exchange map — dimensions", () => {
  it("is 14 wide by 10 tall (Medium Interior)", () => {
    expect(W).toBe(14);
    expect(H).toBe(10);
    expect(exchangeMap.tiles).toHaveLength(10);
    for (const row of exchangeMap.tiles) {
      expect(row).toHaveLength(14);
    }
  });

  it("is registered under the expected id", () => {
    expect(exchangeMap.id).toBe("exchange");
  });
});

describe("Crypto Exchange map — perimeter", () => {
  it("has walls around the entire border", () => {
    for (let x = 0; x < W; x++) {
      expect(exchangeMap.tiles[0][x].kind).toBe("wall");
      expect(exchangeMap.tiles[H - 1][x].kind).toBe("wall");
    }
    for (let y = 0; y < H; y++) {
      expect(exchangeMap.tiles[y][0].kind).toBe("wall");
      expect(exchangeMap.tiles[y][W - 1].kind).toBe("wall");
    }
  });
});

describe("Crypto Exchange map — spawn", () => {
  it("spawns on the bottom-left exit tile at (1, 8)", () => {
    expect(exchangeMap.spawn).toEqual({ x: 1, y: 8 });
    const tile = exchangeMap.tiles[8][1];
    expect(tile.kind).toBe("entry");
    expect(tile.buildingId).toBe("overworld");
    expect(tile.walkable).toBe(true);
  });
});

describe("Crypto Exchange map — boss tile", () => {
  it("has exactly one boss tile with bossId trader-traitor", () => {
    const bosses = ALL.filter((t) => t.kind === "boss");
    expect(bosses).toHaveLength(1);
    expect(bosses[0].bossId).toBe("trader-traitor");
  });

  it("places the boss in the top-right room", () => {
    // Scan rows 1-3 (top rooms area), cols 7-12 (right room).
    let found: { x: number; y: number } | null = null;
    for (let y = 0; y <= 4; y++) {
      for (let x = 7; x <= 12; x++) {
        if (exchangeMap.tiles[y][x].kind === "boss") {
          found = { x, y };
        }
      }
    }
    expect(found).not.toBeNull();
  });
});

describe("Crypto Exchange map — encounter and loot tiles", () => {
  it("flags at least 5 encounter-true ground tiles across the interior", () => {
    const encounter = ALL.filter(
      (t) => t.kind === "ground" && t.encounter === true,
    );
    expect(encounter.length).toBeGreaterThanOrEqual(5);
  });

  it("has at least one loot-flagged ground tile", () => {
    const loot = ALL.filter(
      (t) => t.kind === "ground" && t.loot === true,
    );
    expect(loot.length).toBeGreaterThanOrEqual(1);
  });

  it("has safe ground tiles (encounter !== true) so the player can navigate", () => {
    // NOT every floor tile should fire encounters -- that's the whole
    // difference between Crypto and the Arcade/Bank buildings.
    const safe = ALL.filter(
      (t) => t.kind === "ground" && t.encounter !== true,
    );
    expect(safe.length).toBeGreaterThanOrEqual(10);
  });
});
