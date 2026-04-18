/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
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
  | "spawn"
  | "boss"
  | "sea"
  | "gate"
  /**
   * Decorative building door -- looks like a door, but is not enterable.
   * Blocks movement like a wall. Visual only. Used on decor-* buildings
   * that have a door position in the Sector 01 map spec.
   */
  | "facade";

export interface MapTile {
  kind: TileKind;
  /** Building ID this tile leads to (for entry/locked tiles) */
  buildingId?: string;
  /** Boss ID for boss tiles */
  bossId?: string;
  /** Display label for building entrances */
  label?: string;
  walkable: boolean;
  /**
   * Explicit encounter override for building interiors.
   *   - `true`  -> always roll encounter on step (Crypto hostile floor)
   *   - `false` -> never roll encounter on step (Crypto safe floor)
   *   - undefined -> legacy behavior (`kind === "ground"` triggers inside
   *     buildings). Arcade and Bank rely on this default.
   */
  encounter?: boolean;
  /**
   * Free loot drop tile. When the player steps on a `loot: true` tile for
   * the first time this session, the reducer rolls a boss-tier drop and
   * adds it to the inventory. Tracked in session state (cleared on zone
   * transition), not persisted to the save.
   */
  loot?: boolean;
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

export type OnboardingKey = "loot" | "shop" | "disc" | "boss";

export type OnboardingFlags = {
  loot: boolean;
  shop: boolean;
  disc: boolean;
  boss: boolean;
};

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
  /** Boss IDs whose post-battle intel report has been viewed. */
  unlockedIntelEntries: string[];
  /** Progressive-onboarding flags -- each fires once per save. */
  onboarding: OnboardingFlags;
  bits: number;
  credits: number;
  playTime: number;
  savedAt: string;
}

/** Lightweight save summary for boot screen save slot display. */
export interface SaveSummary {
  playerName: string;
  level: number;
  zone: string;
  savedAt: string;
  playTime: number;
}

/* ------------------------------------------------------------------ */
/*  Screen state machine                                              */
/* ------------------------------------------------------------------ */

export type GameScreen =
  | "boot"
  | "title"
  | "overworld"
  | "building"
  | "battle";

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
  /** Tool type this enemy is weak against (1.5x damage). Bosses only. */
  weakness?: ToolType;
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
  lootDrop: ToolInstance | null;
  levelsGained: number;
  isBoss: boolean;
}

export interface ZoneConfig {
  encounterRate: number;
  enemies: string[];
}
