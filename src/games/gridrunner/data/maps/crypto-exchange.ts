/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { GameMap, MapTile } from "../../engine/types";

/**
 * Crypto Exchange interior -- Medium Interior template per GDD §4.10.
 * 14x10, two rooms connected by a corridor, entry bottom-left at (1, 8),
 * boss top-right at (11, 1).
 *
 * Encounter mechanic (different from Arcade/Bank, which trigger on every
 * ground step): `E` tiles have `encounter: true` explicitly and roll
 * encounters per the exchange zone rate; `G` tiles are safe ground with
 * `encounter: false`. The reducer respects the explicit flag and only
 * falls back to legacy kind-based detection when it's not set.
 */

const W: MapTile = { kind: "wall", walkable: false };

/** Safe walkable ground -- no encounter roll. */
const G: MapTile = { kind: "ground", walkable: true, encounter: false };

/** Encounter ground -- rolls the exchange encounter pool on step. */
const E: MapTile = { kind: "ground", walkable: true, encounter: true };

/** Loot tile -- one-shot boss-tier drop on first step this session. */
const L: MapTile = {
  kind: "ground",
  walkable: true,
  encounter: false,
  loot: true,
};

/** Entry/exit tile -- walking onto it returns the player to the overworld. */
const X: MapTile = {
  kind: "entry",
  buildingId: "overworld",
  label: "Exit",
  walkable: true,
};

/** Vault decoration -- visual flavor, blocks movement. */
const V: MapTile = { kind: "building", label: "Vault", walkable: false };

/** TraderTraitor boss tile -- triggers the mini-boss fight on step. */
const B: MapTile = {
  kind: "boss",
  bossId: "trader-traitor",
  label: "BOSS",
  walkable: true,
};

// prettier-ignore
const tiles: MapTile[][] = [
  /* row 0 */ [W, W, W, W, W, W, W, W, W, W, W, W, W, W],
  /* row 1 */ [W, G, G, G, G, W, W, G, G, V, V, B, G, W],
  /* row 2 */ [W, G, G, E, G, W, W, G, G, G, G, G, G, W],
  /* row 3 */ [W, G, E, G, G, G, G, G, G, G, G, G, G, W], // top corridor
  /* row 4 */ [W, G, G, G, G, W, W, G, G, G, L, G, G, W],
  /* row 5 */ [W, G, G, E, G, W, W, G, G, E, G, G, G, W],
  /* row 6 */ [W, G, G, G, G, G, G, G, G, G, G, G, G, W], // bottom corridor
  /* row 7 */ [W, G, E, G, G, W, W, G, G, G, E, G, G, W],
  /* row 8 */ [W, X, X, G, G, W, W, G, G, G, G, G, G, W],
  /* row 9 */ [W, W, W, W, W, W, W, W, W, W, W, W, W, W],
];

export const exchangeMap: GameMap = {
  id: "exchange",
  width: 14,
  height: 10,
  tiles,
  spawn: { x: 1, y: 8 },
};
