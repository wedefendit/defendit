/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
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
      {
        name: "DDoS Ping",
        power: 10,
        accuracy: 90,
        weight: 40,
        description: "Floods the connection",
      },
      {
        name: "Downloaded Exploit",
        power: 15,
        accuracy: 75,
        weight: 35,
        description: "Runs a copied exploit kit",
      },
      {
        name: "Rage Quit",
        power: 0,
        accuracy: 100,
        weight: 25,
        description: "Heals self 10 HP",
      },
    ],
    xpReward: 18,
    bitsReward: 8,
  },
  hacktivist: {
    id: "hacktivist",
    name: "Hacktivist",
    baseHp: 55,
    speed: 7,
    defense: 3,
    moves: [
      {
        name: "Deface",
        power: 15,
        accuracy: 88,
        weight: 35,
        description: "Defaces a public-facing site",
      },
      {
        name: "Doxx Attempt",
        power: 20,
        accuracy: 78,
        weight: 30,
        description: "Leaks personal data",
      },
      {
        name: "Manifesto",
        power: 0,
        accuracy: 100,
        weight: 35,
        description: "Buffs own power 10%",
      },
    ],
    xpReward: 28,
    bitsReward: 12,
  },
  "ransomware-bot": {
    id: "ransomware-bot",
    name: "Ransomware Bot",
    baseHp: 50,
    speed: 8,
    defense: 3,
    moves: [
      {
        name: "Encrypt",
        power: 20,
        accuracy: 85,
        weight: 40,
        description: "Encrypts files on contact",
      },
      {
        name: "Ransom Note",
        power: 10,
        accuracy: 95,
        weight: 35,
        description: "Demands payment",
      },
      {
        name: "Spread",
        power: 15,
        accuracy: 80,
        weight: 25,
        description: "Propagates across the network",
      },
    ],
    xpReward: 25,
    bitsReward: 12,
  },
  cryptominer: {
    id: "cryptominer",
    name: "Cryptominer",
    baseHp: 45,
    speed: 10,
    defense: 2,
    moves: [
      {
        name: "Mine Block",
        power: 12,
        accuracy: 90,
        weight: 40,
        description: "Diverts cycles to mine a block",
      },
      {
        name: "Pool Connect",
        power: 20,
        accuracy: 85,
        weight: 35,
        description: "Joins a mining pool to amplify output",
      },
      {
        name: "Overclock",
        power: 0,
        accuracy: 100,
        weight: 25,
        description: "Buffs own speed 20%",
      },
    ],
    xpReward: 22,
    bitsReward: 10,
  },
};

/* ------------------------------------------------------------------ */
/*  Boss definitions (GDD §7.2)                                       */
/* ------------------------------------------------------------------ */

export const bosses: Record<string, EnemyDef> = {
  lazarus: {
    id: "lazarus",
    name: "Lazarus Group",
    baseHp: 150,
    speed: 10,
    defense: 5,
    weakness: "defense",
    moves: [
      {
        name: "Ransomware Deploy",
        power: 35,
        accuracy: 85,
        weight: 25,
        description: "Deploys ransomware across the network",
      },
      {
        name: "Crypto Miner",
        power: 15,
        accuracy: 90,
        weight: 30,
        description: "Mines crypto, draining energy",
      },
      {
        name: "Bank Heist",
        power: 25,
        accuracy: 88,
        weight: 25,
        description: "Wires funds to offshore accounts",
      },
      {
        name: "Swift Exploit",
        power: 40,
        accuracy: 75,
        weight: 20,
        description: "Exploits the SWIFT banking network",
      },
    ],
    xpReward: 300,
    bitsReward: 100,
  },
};

/* ------------------------------------------------------------------ */
/*  Zone configs (GDD §4.2, §7.4)                                    */
/* ------------------------------------------------------------------ */

export const zones: Record<string, ZoneConfig> = {
  arcade: { encounterRate: 0.1, enemies: ["script-kiddie"] },
  bank: {
    encounterRate: 0.12,
    enemies: ["script-kiddie", "hacktivist", "ransomware-bot"],
  },
  overworld: {
    encounterRate: 0.15,
    enemies: ["script-kiddie", "ransomware-bot", "cryptominer"],
  },
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
