/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

/* ------------------------------------------------------------------ */
/*  Rarity & Tool types                                               */
/* ------------------------------------------------------------------ */

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ToolType = "recon" | "exploit" | "defense" | "persistence";

export interface ToolInstance {
  id: string;
  baseToolId: string;
  rarity: Rarity;
  power: number;
  accuracy: number;
  energyCost: number;
  prefix: string | null;
  suffix: string | null;
  type: ToolType;
}

/* ------------------------------------------------------------------ */
/*  Player                                                            */
/* ------------------------------------------------------------------ */

export interface PlayerState {
  level: number;
  xp: number;
  xpToNext: number;
  integrity: number;
  maxIntegrity: number;
  compute: number;
  maxCompute: number;
  bandwidth: number;
  firewall: number;
}

export interface Position {
  x: number;
  y: number;
}

/* ------------------------------------------------------------------ */
/*  Map                                                               */
/* ------------------------------------------------------------------ */

export type TileKind =
  | "ground"
  | "wall"
  | "building"
  | "entry"
  | "locked"
  | "spawn";

export interface MapTile {
  kind: TileKind;
  /** Building ID this tile leads to (for entry/locked tiles) */
  buildingId?: string;
  /** Display label for building entrances */
  label?: string;
  walkable: boolean;
}

export interface GameMap {
  id: string;
  width: number;
  height: number;
  tiles: MapTile[][];
  spawn: Position;
}

/* ------------------------------------------------------------------ */
/*  Save                                                              */
/* ------------------------------------------------------------------ */

export interface GridRunnerSave {
  version: number;
  playerName: string;
  player: PlayerState;
  inventory: ToolInstance[];
  equippedTools: (ToolInstance | null)[];
  currentZone: string;
  currentPosition: Position;
  defeatedBosses: string[];
  completedTutorial: boolean;
  bits: number;
  credits: number;
  playTime: number;
  savedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Screen state machine                                              */
/* ------------------------------------------------------------------ */

export type GameScreen = "title" | "overworld" | "building" | "battle" | "intel";

/* ------------------------------------------------------------------ */
/*  Enemy & Battle                                                    */
/* ------------------------------------------------------------------ */

export interface EnemyMove {
  name: string;
  power: number;
  accuracy: number;
  weight: number;
  description: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  baseHp: number;
  speed: number;
  defense: number;
  moves: EnemyMove[];
  xpReward: number;
  bitsReward: number;
}

export interface BattleEnemy {
  def: EnemyDef;
  hp: number;
  maxHp: number;
}

export interface BattleState {
  enemy: BattleEnemy;
  phase: "player_turn" | "enemy_turn" | "resolving" | "won" | "lost";
  log: string[];
  turnCount: number;
  xpEarned: number;
  bitsEarned: number;
}

export interface ZoneConfig {
  encounterRate: number;
  enemies: string[];
}
