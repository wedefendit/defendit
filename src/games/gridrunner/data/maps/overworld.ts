/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { GameMap, MapTile } from "../../engine/types";

/** Shorthand factory */
const G: MapTile = { kind: "ground", walkable: true };
const W: MapTile = { kind: "wall", walkable: false };
const S: MapTile = { kind: "sea", walkable: true };

function entry(id: string, label: string): MapTile {
  return { kind: "entry", buildingId: id, label, walkable: true };
}

function locked(id: string, label: string): MapTile {
  return { kind: "locked", buildingId: id, label, walkable: false };
}

const ARC = entry("arcade", "Arcade");
const BNK = entry("bank", "Bank");
const EXC = locked("exchange", "Crypto Exchange");
const GAT: MapTile = {
  kind: "gate",
  buildingId: "sector02",
  label: "Sector 02",
  walkable: false,
};

/**
 * 16 x 12 overworld grid -- Sector 01 (THE GRID).
 * Three buildings: Arcade (top-left), Bank (top-right),
 * Crypto Exchange (mid-right, locked). Digital Sea fills the middle.
 * Sealed Sector 02 gate at the far-right edge of the south corridor.
 *
 * Row 0 = top (north), Row 11 = bottom (south).
 * Col 0 = left (west), Col 15 = right (east).
 */
// prettier-ignore
const tiles: MapTile[][] = [
  /* row  0 */ [W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W  ],
  /* row  1 */ [W,   G,   G,   G,   S,   S,   S,   S,   S,   S,   G,   G,   G,   G,   G,   W  ],
  /* row  2 */ [W,   G,   ARC, G,   S,   S,   S,   S,   S,   S,   G,   G,   BNK, G,   G,   W  ],
  /* row  3 */ [W,   G,   G,   G,   S,   S,   S,   S,   S,   S,   G,   G,   G,   G,   G,   W  ],
  /* row  4 */ [W,   G,   G,   S,   S,   S,   S,   S,   S,   S,   S,   G,   G,   G,   G,   W  ],
  /* row  5 */ [W,   G,   G,   S,   S,   S,   S,   S,   S,   S,   S,   G,   G,   G,   G,   W  ],
  /* row  6 */ [W,   G,   G,   S,   S,   S,   S,   S,   S,   S,   S,   G,   G,   G,   G,   W  ],
  /* row  7 */ [W,   G,   G,   S,   S,   S,   S,   S,   S,   S,   S,   G,   G,   G,   G,   W  ],
  /* row  8 */ [W,   G,   G,   G,   S,   S,   S,   S,   S,   S,   G,   G,   EXC, G,   G,   W  ],
  /* row  9 */ [W,   G,   G,   G,   S,   S,   S,   S,   S,   S,   G,   G,   G,   G,   G,   W  ],
  /* row 10 */ [W,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   GAT, W  ],
  /* row 11 */ [W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W  ],
];

export const overworldMap: GameMap = {
  id: "overworld",
  width: 16,
  height: 12,
  tiles,
  spawn: { x: 7, y: 10 },
};
