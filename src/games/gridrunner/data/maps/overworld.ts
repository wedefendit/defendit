/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { GameMap, MapTile } from "../../engine/types";

/** Shorthand factories */
const G: MapTile = { kind: "ground", walkable: true };
const W: MapTile = { kind: "wall", walkable: false };
const S: MapTile = { kind: "sea", walkable: true };

function building(id: string): MapTile {
  return { kind: "building", buildingId: id, walkable: false };
}

function entry(id: string, label: string): MapTile {
  return { kind: "entry", buildingId: id, label, walkable: true };
}

function locked(id: string, label: string): MapTile {
  return { kind: "locked", buildingId: id, label, walkable: false };
}

// Arcade (3x3 at rows 1-3, cols 1-3)
const A = building("arcade");
const A1 = entry("arcade", "Arcade");

// Bank (3x3 at rows 1-3, cols 12-14)
const B = building("bank");
const B1 = entry("bank", "Bank");

// Crypto Exchange (2 tall x 3 wide at rows 9-10, cols 12-14)
const X = building("exchange");
const X1 = locked("exchange", "Crypto Exchange");

// Sector 02 gate (single tile at row 11, col 14)
const T: MapTile = {
  kind: "gate",
  buildingId: "sector02",
  label: "Sector 02",
  walkable: false,
};

/**
 * 16 x 12 overworld grid -- Sector 01 (THE GRID).
 *
 * Buildings are multi-tile wireframe footprints (3x3 for Arcade/Bank,
 * 3x2 for Crypto Exchange) with one door tile (entry or locked). Digital
 * Sea fills the middle. Sealed Sector 02 gate at the bottom-right edge.
 *
 * Row 0 = top (north), Row 11 = bottom (south).
 * Col 0 = left (west), Col 15 = right (east).
 */
// prettier-ignore
const tiles: MapTile[][] = [
  /* row  0 */ [W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W  ],
  /* row  1 */ [W,   A,   A,   A,   G,   G,   G,   G,   G,   G,   G,   G,   B,   B,   B,   W  ],
  /* row  2 */ [W,   A,   A,   A,   G,   S,   S,   S,   S,   S,   S,   G,   B,   B,   B,   W  ],
  /* row  3 */ [W,   A1,  A,   A,   G,   S,   S,   S,   S,   S,   S,   G,   B1,  B,   B,   W  ],
  /* row  4 */ [W,   G,   G,   G,   G,   S,   S,   S,   S,   S,   S,   G,   G,   G,   G,   W  ],
  /* row  5 */ [W,   G,   S,   S,   S,   S,   S,   S,   S,   S,   S,   S,   S,   S,   G,   W  ],
  /* row  6 */ [W,   G,   S,   S,   S,   S,   S,   S,   S,   S,   S,   S,   S,   S,   G,   W  ],
  /* row  7 */ [W,   G,   S,   S,   S,   S,   S,   S,   S,   S,   S,   S,   S,   S,   G,   W  ],
  /* row  8 */ [W,   G,   G,   G,   G,   S,   S,   S,   S,   S,   S,   G,   G,   G,   G,   W  ],
  /* row  9 */ [W,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   X,   X,   X,   W  ],
  /* row 10 */ [W,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   X1,  X,   X,   W  ],
  /* row 11 */ [W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   T,   W  ],
];

export const overworldMap: GameMap = {
  id: "overworld",
  width: 16,
  height: 12,
  tiles,
  spawn: { x: 7, y: 10 },
};
