/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { GameMap } from "../../engine/types";
import { overworldMap } from "./overworld";
import { arcadeMap } from "./arcade";

export const maps: Record<string, GameMap> = {
  overworld: overworldMap,
  arcade: arcadeMap,
};

export function getMap(id: string): GameMap | undefined {
  return maps[id];
}
