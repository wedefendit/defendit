/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { BattleEnemy, EnemyDef, EnemyMove, ZoneConfig } from "./types";

/* ------------------------------------------------------------------ */
/*  Enemy definitions (GDD §7.1)                                      */
/* ------------------------------------------------------------------ */

export const enemies: Record<string, EnemyDef> = {
  "script-kiddie": {
    id: "script-kiddie",
    name: "Script Kiddie",
    baseHp: 40,
    speed: 6,
    defense: 2,
    moves: [
      { name: "DDoS Ping", power: 10, accuracy: 90, weight: 40, description: "Floods the connection" },
      { name: "Downloaded Exploit", power: 15, accuracy: 75, weight: 35, description: "Runs a copied exploit kit" },
      { name: "Rage Quit", power: 0, accuracy: 100, weight: 25, description: "Heals self 10 HP" },
    ],
    xpReward: 18,
    bitsReward: 8,
  },
  "ransomware-bot": {
    id: "ransomware-bot",
    name: "Ransomware Bot",
    baseHp: 50,
    speed: 8,
    defense: 3,
    moves: [
      { name: "Encrypt", power: 20, accuracy: 85, weight: 40, description: "Encrypts files on contact" },
      { name: "Ransom Note", power: 10, accuracy: 95, weight: 35, description: "Demands payment" },
      { name: "Spread", power: 15, accuracy: 80, weight: 25, description: "Propagates across the network" },
    ],
    xpReward: 25,
    bitsReward: 12,
  },
};

/* ------------------------------------------------------------------ */
/*  Zone configs (GDD §4.2, §7.4)                                    */
/* ------------------------------------------------------------------ */

export const zones: Record<string, ZoneConfig> = {
  arcade: { encounterRate: 0.30, enemies: ["script-kiddie"] },
  bank: { encounterRate: 0.30, enemies: ["script-kiddie", "ransomware-bot"] },
};

/* ------------------------------------------------------------------ */
/*  Factory & AI                                                      */
/* ------------------------------------------------------------------ */

export function spawnEnemy(enemyId: string, playerLevel: number): BattleEnemy {
  const def = enemies[enemyId];
  if (!def) throw new Error(`Unknown enemy: ${enemyId}`);
  const scaledHp = def.baseHp + playerLevel * 3;
  return { def, hp: scaledHp, maxHp: scaledHp };
}

export function pickRandomEnemy(zone: string): string | null {
  const config = zones[zone];
  if (!config || config.enemies.length === 0) return null;
  return config.enemies[Math.floor(Math.random() * config.enemies.length)];
}

export function shouldEncounter(zone: string): boolean {
  const config = zones[zone];
  if (!config) return false;
  return Math.random() < config.encounterRate;
}

/** Weighted random pick from enemy moveset */
export function pickEnemyMove(enemy: BattleEnemy): EnemyMove {
  const totalWeight = enemy.def.moves.reduce((s, m) => s + m.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const move of enemy.def.moves) {
    roll -= move.weight;
    if (roll <= 0) return move;
  }
  return enemy.def.moves[0];
}
