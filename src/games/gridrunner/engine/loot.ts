/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { Rarity, ToolInstance, ToolType } from "./types";

/* ------------------------------------------------------------------ */
/*  Base tool definitions (GDD §6.3)                                  */
/* ------------------------------------------------------------------ */

interface BaseToolDef {
  id: string;
  name: string;
  type: ToolType;
  basePower: number;
  baseAccuracy: number;
  baseEnergy: number;
  description: string;
}

const BASE_TOOLS: BaseToolDef[] = [
  {
    id: "nmap",
    name: "Nmap",
    type: "recon",
    basePower: 15,
    baseAccuracy: 95,
    baseEnergy: 5,
    description: "Network scanner -- finds open ports and services",
  },
  {
    id: "wireshark",
    name: "Wireshark",
    type: "recon",
    basePower: 10,
    baseAccuracy: 100,
    baseEnergy: 3,
    description: "Packet analyzer -- sees what's on the wire",
  },
  {
    id: "metasploit",
    name: "Metasploit",
    type: "exploit",
    basePower: 35,
    baseAccuracy: 75,
    baseEnergy: 15,
    description: "Exploitation framework -- delivers payloads",
  },
  {
    id: "firewall-rule",
    name: "Firewall Rule",
    type: "defense",
    basePower: 12,
    baseAccuracy: 85,
    baseEnergy: 8,
    description: "Blocks incoming attack, reduces damage",
  },
  {
    id: "burp-suite",
    name: "Burp Suite",
    type: "recon",
    basePower: 25,
    baseAccuracy: 90,
    baseEnergy: 10,
    description: "Web app scanner -- finds web vulnerabilities",
  },
  {
    id: "yara-rules",
    name: "YARA Rules",
    type: "defense",
    basePower: 0,
    baseAccuracy: 90,
    baseEnergy: 6,
    description: "Pattern matcher -- identifies known malware",
  },
  {
    id: "mimikatz",
    name: "Mimikatz",
    type: "persistence",
    basePower: 40,
    baseAccuracy: 80,
    baseEnergy: 18,
    description: "Credential extractor -- dumps passwords from memory",
  },
  {
    id: "hashcat",
    name: "Hashcat",
    type: "exploit",
    basePower: 30,
    baseAccuracy: 85,
    baseEnergy: 12,
    description: "Password cracker -- brute forces hashed credentials",
  },
  {
    id: "ghidra",
    name: "Ghidra",
    type: "recon",
    basePower: 20,
    baseAccuracy: 95,
    baseEnergy: 8,
    description: "Reverse engineering tool -- analyzes compiled code",
  },
  {
    id: "cobalt-strike",
    name: "Cobalt Strike",
    type: "exploit",
    basePower: 45,
    baseAccuracy: 70,
    baseEnergy: 20,
    description: "Adversary simulation -- command and control",
  },
  {
    id: "snort-suricata",
    name: "Snort/Suricata",
    type: "defense",
    basePower: 0,
    baseAccuracy: 88,
    baseEnergy: 12,
    description: "Network IDS -- detects and blocks malicious traffic",
  },
  {
    id: "zero-day",
    name: "Zero-Day",
    type: "exploit",
    basePower: 60,
    baseAccuracy: 50,
    baseEnergy: 30,
    description: "Unknown vulnerability -- no patch exists",
  },
];

/* ------------------------------------------------------------------ */
/*  Rarity system (GDD §6.2)                                         */
/* ------------------------------------------------------------------ */

interface RarityDef {
  multiplierMin: number;
  multiplierMax: number;
  dropWeight: number;
}

const RARITY_TABLE: Record<Rarity, RarityDef> = {
  common: { multiplierMin: 0.8, multiplierMax: 1.0, dropWeight: 55 },
  uncommon: { multiplierMin: 0.9, multiplierMax: 1.15, dropWeight: 25 },
  rare: { multiplierMin: 1.0, multiplierMax: 1.3, dropWeight: 13 },
  epic: { multiplierMin: 1.1, multiplierMax: 1.5, dropWeight: 5 },
  legendary: { multiplierMin: 1.3, multiplierMax: 1.7, dropWeight: 2 },
};

const RARITY_ORDER: Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
];

/** Level-gated rarity access (GDD §5.4) */
function maxRarityForLevel(level: number): Rarity {
  if (level >= 15) return "legendary";
  if (level >= 10) return "epic";
  if (level >= 5) return "rare";
  if (level >= 3) return "uncommon";
  return "common";
}

function rollRarity(playerLevel: number): Rarity {
  const maxIdx = RARITY_ORDER.indexOf(maxRarityForLevel(playerLevel));
  const available = RARITY_ORDER.slice(0, maxIdx + 1);

  let totalWeight = 0;
  for (const r of available) {
    totalWeight += RARITY_TABLE[r].dropWeight;
  }

  let roll = Math.random() * totalWeight;
  for (const r of available) {
    roll -= RARITY_TABLE[r].dropWeight;
    if (roll <= 0) return r;
  }
  return "common";
}

/* ------------------------------------------------------------------ */
/*  Tool generation                                                   */
/* ------------------------------------------------------------------ */

let instanceCounter = 0;

function rollStat(base: number, rarity: Rarity): number {
  const def = RARITY_TABLE[rarity];
  const mult =
    def.multiplierMin + Math.random() * (def.multiplierMax - def.multiplierMin);
  return Math.max(1, Math.round(base * mult));
}

function rollEnergy(base: number, rarity: Rarity): number {
  // Energy: lower is better, so invert the multiplier
  const def = RARITY_TABLE[rarity];
  const mult =
    def.multiplierMax - Math.random() * (def.multiplierMax - def.multiplierMin);
  return Math.max(1, Math.round(base * mult));
}

export function generateTool(playerLevel: number): ToolInstance {
  const baseTool = BASE_TOOLS[Math.floor(Math.random() * BASE_TOOLS.length)];
  const rarity = rollRarity(playerLevel);

  instanceCounter += 1;
  const id = `${baseTool.id}-${Date.now()}-${instanceCounter}`;

  return {
    id,
    baseToolId: baseTool.id,
    rarity,
    power: rollStat(baseTool.basePower, rarity),
    accuracy: Math.min(100, rollStat(baseTool.baseAccuracy, rarity)),
    energyCost: rollEnergy(baseTool.baseEnergy, rarity),
    prefix: null,
    suffix: null,
    type: baseTool.type,
  };
}

/** Roll whether loot drops (60% random, 100% boss) and generate if so */
export function rollLootDrop(
  playerLevel: number,
  isBoss: boolean,
): ToolInstance | null {
  if (!isBoss && Math.random() > 0.6) return null;
  return generateTool(playerLevel);
}

/* ------------------------------------------------------------------ */
/*  Display helpers                                                   */
/* ------------------------------------------------------------------ */

const RARITY_LABEL: Record<Rarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const TOOL_NAMES: Record<string, string> = {};
for (const t of BASE_TOOLS) {
  TOOL_NAMES[t.id] = t.name;
}

export function toolDisplayName(tool: ToolInstance): string {
  const name = TOOL_NAMES[tool.baseToolId] ?? tool.baseToolId;
  return `${RARITY_LABEL[tool.rarity]} ${name}`;
}

export function rarityLabel(rarity: Rarity): string {
  return RARITY_LABEL[rarity];
}

/** Get base tool info (name, description, type) for the Identity Disc */
export function getToolInfo(
  baseToolId: string,
): { name: string; description: string; type: ToolType } | null {
  const def = BASE_TOOLS.find((t) => t.id === baseToolId);
  if (!def) return null;
  return { name: def.name, description: def.description, type: def.type };
}
