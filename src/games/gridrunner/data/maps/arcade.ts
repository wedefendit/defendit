/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { GameMap, MapTile } from "../../engine/types";

const G: MapTile = { kind: "ground", walkable: true };
const W: MapTile = { kind: "wall", walkable: false };

/** Entry/exit tile -- walking here exits to overworld */
const EXIT: MapTile = { kind: "entry", buildingId: "overworld", label: "Exit", walkable: true };

/** Shop NPC tile */
const SHOP: MapTile = { kind: "building", buildingId: "shop", label: "Shop", walkable: true };

/** Save terminal tile */
const SAVE: MapTile = { kind: "building", buildingId: "save", label: "Save", walkable: true };

/** Arcade machine decoration (non-walkable) */
const ARC: MapTile = { kind: "building", label: "Arcade", walkable: false };

/**
 * 12 x 10 Arcade interior.
 * Encounters are zone-based RNG -- any ground step can trigger one.
 * No special encounter tiles; the building's encounter rate determines chance.
 */
// prettier-ignore
const tiles: MapTile[][] = [
  /* row 0 */ [W,    W,    W,    W,    W,    W,    W,    W,    W,    W,    W,    W   ],
  /* row 1 */ [W,    ARC,  ARC,  G,    G,    G,    G,    G,    G,    ARC,  ARC,  W   ],
  /* row 2 */ [W,    G,    G,    G,    G,    G,    G,    G,    G,    G,    G,    W   ],
  /* row 3 */ [W,    G,    G,    G,    G,    G,    G,    G,    G,    G,    G,    W   ],
  /* row 4 */ [W,    G,    G,    G,    G,    G,    G,    G,    G,    SHOP, G,    W   ],
  /* row 5 */ [W,    G,    G,    G,    G,    G,    G,    G,    G,    G,    G,    W   ],
  /* row 6 */ [W,    G,    G,    G,    G,    G,    G,    G,    G,    SAVE, G,    W   ],
  /* row 7 */ [W,    G,    G,    G,    G,    G,    G,    G,    G,    G,    G,    W   ],
  /* row 8 */ [W,    G,    G,    G,    G,    EXIT, EXIT, G,    G,    G,    G,    W   ],
  /* row 9 */ [W,    W,    W,    W,    W,    W,    W,    W,    W,    W,    W,    W   ],
];

export const arcadeMap: GameMap = {
  id: "arcade",
  width: 12,
  height: 10,
  tiles,
  spawn: { x: 5, y: 7 },
};
