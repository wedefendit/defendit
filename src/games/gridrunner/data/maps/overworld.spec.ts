/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { describe, it, expect } from "vitest";
import { overworldMap } from "./overworld";
import type { MapTile } from "../../engine/types";

/**
 * Structural contracts for the Sector 01 overworld map.
 * The ASCII layout lives in docs/gridrunner/sectors/sector-01/overworld.md;
 * these tests verify the parsed data matches that spec.
 */

const W = overworldMap.width;
const H = overworldMap.height;
const ALL_TILES: MapTile[] = overworldMap.tiles.flat();

describe("Sector 01 overworld map — dimensions", () => {
  it("is 60 wide by 40 tall", () => {
    expect(W).toBe(60);
    expect(H).toBe(40);
  });

  it("is a dense rectangular grid with 60x40 tiles", () => {
    expect(overworldMap.tiles).toHaveLength(40);
    for (const row of overworldMap.tiles) {
      expect(row).toHaveLength(60);
    }
  });
});

describe("Sector 01 overworld map — spawn", () => {
  it("spawn is at (14, 10) per the Sector 01 spec", () => {
    expect(overworldMap.spawn).toEqual({ x: 14, y: 10 });
  });

  it("spawn tile is walkable and marked as spawn", () => {
    const tile = overworldMap.tiles[10][14];
    expect(tile.walkable).toBe(true);
    expect(tile.kind).toBe("spawn");
  });
});

describe("Sector 01 overworld map — perimeter", () => {
  it("every top-row tile is an unwalkable wall", () => {
    for (let x = 0; x < W; x++) {
      const tile = overworldMap.tiles[0][x];
      expect(tile.kind).toBe("wall");
      expect(tile.walkable).toBe(false);
    }
  });

  it("every bottom-row tile is an unwalkable wall", () => {
    for (let x = 0; x < W; x++) {
      const tile = overworldMap.tiles[H - 1][x];
      expect(tile.kind).toBe("wall");
      expect(tile.walkable).toBe(false);
    }
  });

  it("every left-column tile is an unwalkable wall", () => {
    for (let y = 0; y < H; y++) {
      const tile = overworldMap.tiles[y][0];
      expect(tile.kind).toBe("wall");
      expect(tile.walkable).toBe(false);
    }
  });

  it("every right-column tile is an unwalkable wall", () => {
    for (let y = 0; y < H; y++) {
      const tile = overworldMap.tiles[y][W - 1];
      expect(tile.kind).toBe("wall");
      expect(tile.walkable).toBe(false);
    }
  });
});

describe("Sector 01 overworld map — enterable buildings", () => {
  it("Arcade door at (8, 6) is an entry tile for the arcade zone", () => {
    // Door sits directly adjacent to building body tile `A` at (7, 6) per
    // the updated Sector 01 spec. Approach from the south at (8, 7).
    const tile = overworldMap.tiles[6][8];
    expect(tile.kind).toBe("entry");
    expect(tile.buildingId).toBe("arcade");
    expect(tile.walkable).toBe(true);
  });

  it("Bank door at (42, 6) is an entry tile for the bank zone", () => {
    const tile = overworldMap.tiles[6][42];
    expect(tile.kind).toBe("entry");
    expect(tile.buildingId).toBe("bank");
    expect(tile.walkable).toBe(true);
  });

  it("Crypto Exchange door at (46, 30) is a LOCKED tile for the exchange zone", () => {
    const tile = overworldMap.tiles[30][46];
    expect(tile.kind).toBe("locked");
    expect(tile.buildingId).toBe("exchange");
    expect(tile.walkable).toBe(false);
  });
});

describe("Sector 01 overworld map — Sector 02 gate", () => {
  it("gate tile at (58, 34) blocks movement", () => {
    const tile = overworldMap.tiles[34][58];
    expect(tile.kind).toBe("gate");
    expect(tile.walkable).toBe(false);
  });

  it("gate tile has no visible label (appears as a dead-end trace)", () => {
    // Per the GDD and Sector 02 Gate contract: "Gate tile has NO visual label.
    // It looks like a dead-end trace." Absence of a label on the tile data is
    // how the renderer knows not to paint "SEALED" or similar text.
    const tile = overworldMap.tiles[34][58];
    expect(tile.label).toBeFalsy();
  });
});

describe("Sector 01 overworld map — building footprints", () => {
  it("Arcade (L-shape) has 12 body tiles and 1 entry tile", () => {
    const body = ALL_TILES.filter(
      (t) => t.kind === "building" && t.buildingId === "arcade",
    );
    const entry = ALL_TILES.filter(
      (t) => t.kind === "entry" && t.buildingId === "arcade",
    );
    expect(body).toHaveLength(12);
    expect(entry).toHaveLength(1);
  });

  it("Bank has 12 body tiles and 1 entry tile per the Sector 01 ASCII", () => {
    // Per the Sector 01 ASCII (authoritative): row 4/5 have 5 B tiles each
    // (cols 40-44), row 6 has `BbB` at cols 41-43 (2 body + 1 entry).
    // Total: 12 body + 1 entry = 13-tile footprint.
    const body = ALL_TILES.filter(
      (t) => t.kind === "building" && t.buildingId === "bank",
    );
    const entry = ALL_TILES.filter(
      (t) => t.kind === "entry" && t.buildingId === "bank",
    );
    expect(body).toHaveLength(12);
    expect(entry).toHaveLength(1);
  });

  it("Crypto Exchange (tall rectangle) has 14 body tiles and 1 locked door", () => {
    const body = ALL_TILES.filter(
      (t) => t.kind === "building" && t.buildingId === "exchange",
    );
    const locked = ALL_TILES.filter(
      (t) => t.kind === "locked" && t.buildingId === "exchange",
    );
    expect(body).toHaveLength(14);
    expect(locked).toHaveLength(1);
  });
});

describe("Sector 01 overworld map — sea, entries, locked", () => {
  it("Digital Sea tile count is in the expected range", () => {
    const sea = ALL_TILES.filter((t) => t.kind === "sea");
    // Sector 01 has substantial sea patches on the outskirts per the spec,
    // plus grind patches near main routes. Loose window catches "no sea" or
    // "flooded everywhere" regressions while tolerating spec tuning.
    expect(sea.length).toBeGreaterThanOrEqual(80);
    expect(sea.length).toBeLessThanOrEqual(500);
  });

  it("exactly 2 entry tiles (Arcade + Bank) exist across the map", () => {
    const entries = ALL_TILES.filter((t) => t.kind === "entry");
    expect(entries).toHaveLength(2);
  });

  it("exactly 1 locked tile (Crypto Exchange) exists across the map", () => {
    const locked = ALL_TILES.filter((t) => t.kind === "locked");
    expect(locked).toHaveLength(1);
  });
});

describe("Sector 01 overworld map — void and walkability rules", () => {
  it("void (.) tiles are non-walkable wall-kind", () => {
    // (15, 10) in the JSON spec is a `.` void tile (one cell east of spawn S).
    // Void must block movement so the motherboard traces define the network.
    const tile = overworldMap.tiles[10][15];
    expect(tile.kind).toBe("wall");
    expect(tile.walkable).toBe(false);
  });

  it("map contains exactly 267 ground (grid-path) tiles matching the spec", () => {
    // Count verified against docs/gridrunner/sectors/sector-01/map.json.
    const ground = ALL_TILES.filter((t) => t.kind === "ground");
    expect(ground).toHaveLength(267);
  });

  it("map contains exactly 289 Digital Sea tiles matching the spec", () => {
    // Count verified against docs/gridrunner/sectors/sector-01/map.json.
    // Includes near-spawn grind patches, mid-map sea stretches, bank-approach
    // encroachment, and the perimeter flood along the outskirts.
    const sea = ALL_TILES.filter((t) => t.kind === "sea");
    expect(sea).toHaveLength(289);
  });

  it("only ground | sea | spawn | entry tile kinds are walkable", () => {
    const walkableKinds = new Set<string>();
    for (const t of ALL_TILES) {
      if (t.walkable) walkableKinds.add(t.kind);
    }
    expect([...walkableKinds].sort()).toEqual(["entry", "ground", "sea", "spawn"]);
  });

  it("locked, gate, wall, building, and facade kinds are never walkable", () => {
    const neverWalkable = ["locked", "gate", "wall", "building", "facade"];
    for (const t of ALL_TILES) {
      if (neverWalkable.includes(t.kind)) {
        expect(t.walkable, `${t.kind} tile should not be walkable`).toBe(false);
      }
    }
  });
});

describe("Sector 01 overworld map — decoratives", () => {
  it("has at least 100 total building body tiles (enterable + decorative)", () => {
    const bodies = ALL_TILES.filter((t) => t.kind === "building");
    expect(bodies.length).toBeGreaterThanOrEqual(100);
  });

  it("has facade (decorative door) tiles that block movement", () => {
    const facades = ALL_TILES.filter((t) => t.kind === "facade");
    expect(facades.length).toBeGreaterThan(0);
    for (const f of facades) {
      expect(f.walkable).toBe(false);
    }
  });

  it("has the three enterable buildingIds plus at least 14 decorative components", () => {
    // Enterable buildings carry stable IDs that the reducer uses for zone
    // routing. Decorative buildings are gameplay-inert and their flood-fill
    // count is a floor, not an exact number: decorative-flooded buildings
    // (sea tiles inside the footprint) split into multiple 4-connected
    // components by design, so the total decor count is >= the 14 entries
    // in the manifest.
    const ids = new Set<string>();
    for (const t of ALL_TILES) {
      if (t.buildingId) ids.add(t.buildingId);
    }
    expect(ids.has("arcade")).toBe(true);
    expect(ids.has("bank")).toBe(true);
    expect(ids.has("exchange")).toBe(true);

    const decorIds = [...ids].filter((id) => id.startsWith("decor-"));
    expect(decorIds.length).toBeGreaterThanOrEqual(14);
  });
});
