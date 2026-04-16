/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { BattleEnemy, BattleState, EnemyMove, PlayerState, ToolInstance, ToolType } from "./types";
import { pickEnemyMove } from "./enemies";
import { rollLootDrop, toolDisplayName } from "./loot";

/* ------------------------------------------------------------------ */
/*  Log formatting                                                    */
/* ------------------------------------------------------------------ */

type LogTag = "SYS" | "ATK" | "HIT" | "MISS" | "DMG" | "HEAL" | "WIN" | "LOSS" | "WARN" | "RUN";

function fmt(turn: number, tag: LogTag, msg: string): string {
  const t = String(turn).padStart(2, "0");
  return `[T${t}] [${tag}] ${msg}`;
}

/* ------------------------------------------------------------------ */
/*  Type effectiveness (GDD §8.4)                                     */
/* ------------------------------------------------------------------ */

/** Weak-against mapping: if your tool type matches the enemy's strong suit */
const WEAK_AGAINST: Readonly<Record<ToolType, ToolType>> = {
  recon: "defense",
  exploit: "persistence",
  defense: "recon",
  persistence: "exploit",
};

function typeMultiplier(attackerType: ToolType, enemyWeakness?: ToolType): number {
  if (enemyWeakness && attackerType === enemyWeakness) return 1.5;
  if (enemyWeakness && WEAK_AGAINST[attackerType] === enemyWeakness) return 0.75;
  return 1.0;
}

/* ------------------------------------------------------------------ */
/*  Damage calculation                                                */
/* ------------------------------------------------------------------ */

function calcPlayerDamage(
  tool: ToolInstance,
  _player: PlayerState,
  enemy: BattleEnemy,
): number {
  const base = tool.power * typeMultiplier(tool.type, enemy.def.weakness);
  const reduced = Math.max(1, base - enemy.def.defense);
  return Math.round(reduced);
}

function calcEnemyDamage(
  move: EnemyMove,
  _enemy: BattleEnemy,
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
  const turn = battle.turnCount;
  const log = [...battle.log];
  let updatedPlayer = { ...player };
  let updatedEnemy = { ...battle.enemy, hp: battle.enemy.hp };

  if (updatedPlayer.compute < tool.energyCost) {
    log.push(fmt(turn, "WARN", `Not enough Compute for ${tool.baseToolId.toUpperCase()}.`));
    return {
      state: { ...battle, log, phase: "player_turn" },
      player: updatedPlayer,
    };
  }

  updatedPlayer = { ...updatedPlayer, compute: updatedPlayer.compute - tool.energyCost };

  const roll = Math.random() * 100;
  if (roll > tool.accuracy) {
    log.push(fmt(turn, "MISS", `${tool.baseToolId.toUpperCase()} missed.`));
  } else {
    const dmg = calcPlayerDamage(tool, updatedPlayer, updatedEnemy);
    updatedEnemy = { ...updatedEnemy, hp: Math.max(0, updatedEnemy.hp - dmg) };
    log.push(fmt(turn, "HIT", `${tool.baseToolId.toUpperCase()} hit for ${dmg} damage.`));
  }

  if (updatedEnemy.hp <= 0) {
    log.push(fmt(turn, "WIN", `${updatedEnemy.def.name} defeated.`));

    // Roll loot
    const loot = rollLootDrop(updatedPlayer.level, battle.isBoss);
    if (loot) {
      log.push(fmt(turn, "SYS", `LOOT: ${toolDisplayName(loot)} (Pwr ${loot.power}, Acc ${loot.accuracy}%, EN ${loot.energyCost})`));
    }

    // Preview level-ups
    const xpGain = updatedEnemy.def.xpReward;
    let previewXp = updatedPlayer.xp + xpGain;
    let previewNext = updatedPlayer.xpToNext;
    let lvls = 0;
    while (previewXp >= previewNext && updatedPlayer.level + lvls < 20) {
      previewXp -= previewNext;
      previewNext = Math.round(previewNext * 1.5);
      lvls += 1;
    }
    if (lvls > 0) {
      log.push(fmt(turn, "SYS", `LEVEL UP: ${updatedPlayer.level} -> ${updatedPlayer.level + lvls}`));
    }

    return {
      state: {
        ...battle,
        enemy: updatedEnemy,
        log,
        phase: "won",
        xpEarned: xpGain,
        bitsEarned: updatedEnemy.def.bitsReward,
        lootDrop: loot,
        levelsGained: lvls,
      },
      player: updatedPlayer,
    };
  }

  return resolveEnemyTurn(updatedPlayer, { ...battle, enemy: updatedEnemy, log });
}

function resolveEnemyTurn(
  player: PlayerState,
  battle: BattleState,
): TurnResult {
  const turn = battle.turnCount;
  const log = [...battle.log];
  let updatedPlayer = { ...player };
  const move = pickEnemyMove(battle.enemy);

  if (move.name === "Rage Quit") {
    const healed = Math.min(battle.enemy.maxHp, battle.enemy.hp + 10);
    log.push(fmt(turn, "HEAL", `${battle.enemy.def.name} used ${move.name}. Restored 10 HP.`));
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

  if (move.name === "Manifesto") {
    const healed = Math.min(battle.enemy.maxHp, battle.enemy.hp + 5);
    log.push(fmt(turn, "WARN", `${battle.enemy.def.name} used ${move.name}. Power increased.`));
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

  const roll = Math.random() * 100;
  if (roll > move.accuracy) {
    log.push(fmt(turn, "MISS", `${battle.enemy.def.name} used ${move.name}... missed.`));
  } else {
    const dmg = calcEnemyDamage(move, battle.enemy, updatedPlayer);
    updatedPlayer = {
      ...updatedPlayer,
      integrity: Math.max(0, updatedPlayer.integrity - dmg),
    };
    log.push(fmt(turn, "DMG", `${battle.enemy.def.name} used ${move.name} for ${dmg} damage.`));
  }

  if (updatedPlayer.integrity <= 0) {
    log.push(fmt(turn, "LOSS", "System compromised. Connection lost."));
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

export function attemptRun(
  player: PlayerState,
  enemy: BattleEnemy,
): boolean {
  const chance = 50 + (player.bandwidth - enemy.def.speed) * 5;
  return Math.random() * 100 < chance;
}

export function createBattle(enemy: BattleEnemy, isBoss: boolean): BattleState {
  return {
    enemy,
    phase: "player_turn",
    log: [`[T00] [SYS] THREAT DETECTED: ${enemy.def.name}`],
    turnCount: 1,
    xpEarned: 0,
    bitsEarned: 0,
    lootDrop: null,
    levelsGained: 0,
    isBoss,
  };
}
