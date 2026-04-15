/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { GameMap, MapTile } from "../../engine/types";

/** Shorthand factory */
const G: MapTile = { kind: "ground", walkable: true };
const W: MapTile = { kind: "wall", walkable: false };

function bld(id: string, label: string): MapTile {
  return { kind: "building", buildingId: id, label, walkable: false };
}

function entry(id: string, label: string): MapTile {
  return { kind: "entry", buildingId: id, label, walkable: true };
}

function locked(id: string, label: string): MapTile {
  return { kind: "locked", buildingId: id, label, walkable: false };
}

const S: MapTile = { kind: "spawn", walkable: true };

const ARC = bld("arcade", "Arcade");
const ARCe = entry("arcade", "Arcade");
const BNK = bld("bank", "Bank");
const BNKe = entry("bank", "Bank");
const HSP = bld("hospital", "Hospital");
const HSPl = locked("hospital", "Hospital");
const PWR = bld("powerplant", "Power Plant");
const PWRl = locked("powerplant", "Power Plant");
const GOV = bld("government", "Gov Building");
const GOVl = locked("government", "Gov Building");

/**
 * 16 x 12 overworld grid.
 * Row 0 = top (north), Row 11 = bottom (south).
 * Col 0 = left (west), Col 15 = right (east).
 */
// prettier-ignore
const tiles: MapTile[][] = [
  /* row  0 */ [W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W  ],
  /* row  1 */ [W,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   W  ],
  /* row  2 */ [W,   G,   ARC, ARC, ARC, G,   G,   G,   G,   G,   BNK, BNK, BNK, G,   G,   W  ],
  /* row  3 */ [W,   G,   ARC, ARC, ARC, G,   G,   G,   G,   G,   BNK, BNK, BNK, G,   G,   W  ],
  /* row  4 */ [W,   G,   G,   ARCe,G,   G,   G,   G,   G,   G,   G,   BNKe,G,   G,   G,   W  ],
  /* row  5 */ [W,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   G,   W  ],
  /* row  6 */ [W,   G,   HSP, HSP, HSP, G,   G,   G,   G,   G,   PWR, PWR, PWR, G,   G,   W  ],
  /* row  7 */ [W,   G,   HSP, HSP, HSP, G,   G,   G,   G,   G,   PWR, PWR, PWR, G,   G,   W  ],
  /* row  8 */ [W,   G,   G,   HSPl,G,   G,   GOV, GOV, GOV, G,   G,   PWRl,G,   G,   G,   W  ],
  /* row  9 */ [W,   G,   G,   G,   G,   G,   GOV, GOV, GOV, G,   G,   G,   G,   G,   G,   W  ],
  /* row 10 */ [W,   G,   G,   G,   G,   G,   G,   GOVl,G,   G,   G,   G,   G,   G,   G,   W  ],
  /* row 11 */ [W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W,   W  ],
];

export const overworldMap: GameMap = {
  id: "overworld",
  width: 16,
  height: 12,
  tiles,
  spawn: { x: 7, y: 5 },
};
