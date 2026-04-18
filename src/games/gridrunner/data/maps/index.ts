/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { GameMap } from "../../engine/types";
import { overworldMap } from "./overworld";
import { arcadeMap } from "./arcade";
import { bankMap } from "./bank";
import { exchangeMap } from "./crypto-exchange";

export const maps: Record<string, GameMap> = {
  overworld: overworldMap,
  arcade: arcadeMap,
  bank: bankMap,
  exchange: exchangeMap,
};

export function getMap(id: string): GameMap | undefined {
  return maps[id];
}
