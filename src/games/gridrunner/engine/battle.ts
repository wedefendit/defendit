/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { BattleEnemy, BattleState, EnemyMove, PlayerState, ToolInstance, ToolType } from "./types";
import { pickEnemyMove } from "./enemies";

/* ------------------------------------------------------------------ */
/*  Type effectiveness (GDD §8.4)                                     */
/* ------------------------------------------------------------------ */

const STRONG: Record<ToolType, ToolType> = {
  recon: "persistence",
  exploit: "defense",
  defense: "exploit",
  persistence: "recon",
};

const WEAK: Record<ToolType, ToolType> = {
  recon: "defense",
  exploit: "persistence",
  defense: "recon",
  persistence: "exploit",
};

function typeMultiplier(attackerType: ToolType, _defenderType?: ToolType): number {
  // For random encounters, enemies don't have a tool type.
  // Type effectiveness applies against boss weaknesses (future).
  // For now, neutral.
  return 1.0;
}

/* ------------------------------------------------------------------ */
/*  Damage calculation                                                */
/* ------------------------------------------------------------------ */

function calcPlayerDamage(
  tool: ToolInstance,
  player: PlayerState,
  enemy: BattleEnemy,
): number {
  const base = tool.power * typeMultiplier(tool.type);
  const reduced = Math.max(1, base - enemy.def.defense);
  return Math.round(reduced);
}

function calcEnemyDamage(
  move: EnemyMove,
  enemy: BattleEnemy,
  player: PlayerState,
): number {
  const base = move.power;
  const reduced = Math.max(1, base - player.firewall);
  return Math.round(reduced);
}

/* ------------------------------------------------------------------ */
/*  Turn resolution                                                   */
/* ------------------------------------------------------------------ */

export interface TurnResult {
  state: BattleState;
  player: PlayerState;
}

export function resolvePlayerTurn(
  tool: ToolInstance,
  player: PlayerState,
  battle: BattleState,
): TurnResult {
  const log = [...battle.log];
  let updatedPlayer = { ...player };
  let updatedEnemy = { ...battle.enemy, hp: battle.enemy.hp };

  // Check energy
  if (updatedPlayer.compute < tool.energyCost) {
    log.push(`Not enough Compute to use ${tool.baseToolId.toUpperCase()}.`);
    return {
      state: { ...battle, log, phase: "player_turn" },
      player: updatedPlayer,
    };
  }

  // Spend energy
  updatedPlayer = { ...updatedPlayer, compute: updatedPlayer.compute - tool.energyCost };

  // Accuracy check
  const roll = Math.random() * 100;
  if (roll > tool.accuracy) {
    log.push(`${tool.baseToolId.toUpperCase()} missed!`);
  } else {
    const dmg = calcPlayerDamage(tool, updatedPlayer, updatedEnemy);
    updatedEnemy = { ...updatedEnemy, hp: Math.max(0, updatedEnemy.hp - dmg) };
    log.push(`${tool.baseToolId.toUpperCase()} hit for ${dmg} damage.`);
  }

  // Check win
  if (updatedEnemy.hp <= 0) {
    log.push(`${updatedEnemy.def.name} defeated!`);
    return {
      state: {
        ...battle,
        enemy: updatedEnemy,
        log,
        phase: "won",
        xpEarned: updatedEnemy.def.xpReward,
        bitsEarned: updatedEnemy.def.bitsReward,
      },
      player: updatedPlayer,
    };
  }

  // Enemy turn
  return resolveEnemyTurn(updatedPlayer, { ...battle, enemy: updatedEnemy, log });
}

function resolveEnemyTurn(
  player: PlayerState,
  battle: BattleState,
): TurnResult {
  const log = [...battle.log];
  let updatedPlayer = { ...player };
  const move = pickEnemyMove(battle.enemy);

  // Special case: Rage Quit = heal
  if (move.name === "Rage Quit") {
    const healed = Math.min(battle.enemy.maxHp, battle.enemy.hp + 10);
    log.push(`${battle.enemy.def.name} used ${move.name}. Healed 10 HP.`);
    return {
      state: {
        ...battle,
        enemy: { ...battle.enemy, hp: healed },
        log,
        phase: "player_turn",
        turnCount: battle.turnCount + 1,
      },
      player: updatedPlayer,
    };
  }

  // Accuracy check
  const roll = Math.random() * 100;
  if (roll > move.accuracy) {
    log.push(`${battle.enemy.def.name} used ${move.name}... missed!`);
  } else {
    const dmg = calcEnemyDamage(move, battle.enemy, updatedPlayer);
    updatedPlayer = {
      ...updatedPlayer,
      integrity: Math.max(0, updatedPlayer.integrity - dmg),
    };
    log.push(`${battle.enemy.def.name} used ${move.name} for ${dmg} damage.`);
  }

  // Check lose
  if (updatedPlayer.integrity <= 0) {
    log.push("System compromised. Connection lost.");
    return {
      state: { ...battle, log, phase: "lost", turnCount: battle.turnCount + 1 },
      player: updatedPlayer,
    };
  }

  return {
    state: { ...battle, log, phase: "player_turn", turnCount: battle.turnCount + 1 },
    player: updatedPlayer,
  };
}

/** Attempt to run from a non-boss encounter. */
export function attemptRun(
  player: PlayerState,
  enemy: BattleEnemy,
): boolean {
  const chance = 50 + (player.bandwidth - enemy.def.speed) * 5;
  return Math.random() * 100 < chance;
}

/** Create initial battle state from a spawned enemy. */
export function createBattle(enemy: BattleEnemy): BattleState {
  return {
    enemy,
    phase: "player_turn",
    log: [`THREAT DETECTED: ${enemy.def.name}`],
    turnCount: 1,
    xpEarned: 0,
    bitsEarned: 0,
  };
}
