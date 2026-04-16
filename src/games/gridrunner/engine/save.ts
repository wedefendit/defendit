/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { GridRunnerSave, PlayerState, ToolInstance } from "./types";

const SAVE_KEY = "dis-gridrunner-save";
const SAVE_VERSION = 1;

/* ------------------------------------------------------------------ */
/*  Default state factories                                           */
/* ------------------------------------------------------------------ */

function defaultPlayer(): PlayerState {
  return {
    level: 1,
    xp: 0,
    xpToNext: 50,
    integrity: 100,
    maxIntegrity: 100,
    compute: 60,
    maxCompute: 60,
    bandwidth: 10,
    firewall: 5,
  };
}

function starterTools(): ToolInstance[] {
  return [
    {
      id: "starter-nmap",
      baseToolId: "nmap",
      rarity: "common",
      power: 15,
      accuracy: 95,
      energyCost: 5,
      prefix: null,
      suffix: null,
      type: "recon",
    },
    {
      id: "starter-wireshark",
      baseToolId: "wireshark",
      rarity: "common",
      power: 10,
      accuracy: 100,
      energyCost: 3,
      prefix: null,
      suffix: null,
      type: "recon",
    },
    {
      id: "starter-metasploit",
      baseToolId: "metasploit",
      rarity: "common",
      power: 35,
      accuracy: 75,
      energyCost: 15,
      prefix: null,
      suffix: null,
      type: "exploit",
    },
    {
      id: "starter-firewall",
      baseToolId: "firewall-rule",
      rarity: "common",
      power: 12,
      accuracy: 85,
      energyCost: 8,
      prefix: null,
      suffix: null,
      type: "defense",
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  CRUD                                                              */
/* ------------------------------------------------------------------ */

export function hasSave(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function loadSave(): GridRunnerSave | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GridRunnerSave;
    if (parsed.version !== SAVE_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeSave(save: GridRunnerSave): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Quota or privacy mode
  }
}

export function deleteSave(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

export function createNewSave(playerName: string): GridRunnerSave {
  const tools = starterTools();
  return {
    version: SAVE_VERSION,
    playerName: playerName || "OPERATOR",
    player: defaultPlayer(),
    inventory: [],
    equippedTools: [tools[0], tools[1], tools[2], tools[3]],
    currentZone: "overworld",
    currentPosition: { x: 8, y: 10 },
    defeatedBosses: [],
    completedTutorial: false,
    bits: 0,
    credits: 0,
    playTime: 0,
    savedAt: new Date().toISOString(),
  };
}
