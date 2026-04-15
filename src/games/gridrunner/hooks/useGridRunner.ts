/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { useCallback, useEffect, useReducer, useRef } from "react";
import type {
  BattleState,
  GameScreen,
  GridRunnerSave,
  PlayerState,
  Position,
  ToolInstance,
} from "../engine/types";
import { createNewSave, hasSave, loadSave, writeSave } from "../engine/save";
import { move, tileAt, type Direction } from "../engine/movement";
import { getMap } from "../data/maps";
import { overworldMap } from "../data/maps/overworld";
import {
  pickRandomEnemy,
  shouldEncounter,
  spawnEnemy,
} from "../engine/enemies";
import {
  attemptRun,
  createBattle,
  resolvePlayerTurn,
} from "../engine/battle";

/* ------------------------------------------------------------------ */
/*  State                                                             */
/* ------------------------------------------------------------------ */

interface GameState {
  screen: GameScreen;
  save: GridRunnerSave | null;
  hasSaveFile: boolean;
  playerPos: Position;
  facing: Direction;
  currentZone: string;
  overworldPos: Position;
  battle: BattleState | null;
}

type Action =
  | { type: "NEW_GAME"; name: string }
  | { type: "CONTINUE" }
  | { type: "MOVE"; dir: Direction }
  | { type: "INTERACT" }
  | { type: "CHECK_SAVE" }
  | { type: "USE_TOOL"; tool: ToolInstance }
  | { type: "RUN" }
  | { type: "BATTLE_END" };

function init(): GameState {
  return {
    screen: "title",
    save: null,
    hasSaveFile: false,
    playerPos: overworldMap.spawn,
    facing: "down",
    currentZone: "overworld",
    overworldPos: overworldMap.spawn,
    battle: null,
  };
}

function reducer(state: GameState, action: Action): GameState {
  const currentMap = getMap(state.currentZone);

  switch (action.type) {
    case "CHECK_SAVE":
      return { ...state, hasSaveFile: hasSave() };

    case "NEW_GAME": {
      const save = createNewSave(action.name);
      writeSave(save);
      return {
        ...state,
        screen: "overworld",
        save,
        hasSaveFile: true,
        playerPos: save.currentPosition,
        facing: "down",
        currentZone: "overworld",
        overworldPos: save.currentPosition,
        battle: null,
      };
    }

    case "CONTINUE": {
      const save = loadSave();
      if (!save) return state;
      return {
        ...state,
        screen: save.currentZone === "overworld" ? "overworld" : "building",
        save,
        playerPos: save.currentPosition,
        facing: "down",
        currentZone: save.currentZone,
        overworldPos:
          save.currentZone === "overworld"
            ? save.currentPosition
            : state.overworldPos,
        battle: null,
      };
    }

    case "MOVE": {
      if (state.screen !== "overworld" && state.screen !== "building")
        return state;
      if (!currentMap) return state;

      const newPos = move(state.playerPos, action.dir, currentMap);
      const moved =
        newPos.x !== state.playerPos.x || newPos.y !== state.playerPos.y;
      if (!moved) return { ...state, facing: action.dir };

      const steppedTile = tileAt(currentMap, newPos);

      // Auto-enter building from overworld
      if (
        state.screen === "overworld" &&
        steppedTile?.kind === "entry" &&
        steppedTile.buildingId
      ) {
        const buildingMap = getMap(steppedTile.buildingId);
        if (buildingMap) {
          const updatedSave = state.save
            ? {
                ...state.save,
                currentZone: steppedTile.buildingId,
                currentPosition: buildingMap.spawn,
              }
            : null;
          return {
            ...state,
            screen: "building",
            currentZone: steppedTile.buildingId,
            playerPos: buildingMap.spawn,
            overworldPos: state.playerPos,
            facing: "up",
            save: updatedSave,
          };
        }
      }

      // Auto-exit building back to overworld
      if (
        state.screen === "building" &&
        steppedTile?.kind === "entry" &&
        steppedTile.buildingId === "overworld"
      ) {
        const updatedSave = state.save
          ? {
              ...state.save,
              currentZone: "overworld",
              currentPosition: state.overworldPos,
            }
          : null;
        return {
          ...state,
          screen: "overworld",
          currentZone: "overworld",
          playerPos: state.overworldPos,
          facing: "down",
          save: updatedSave,
        };
      }

      // Normal move -- check for random encounter inside buildings
      const updatedSave = state.save
        ? {
            ...state.save,
            currentPosition: newPos,
            currentZone: state.currentZone,
          }
        : null;

      const baseUpdate = {
        ...state,
        playerPos: newPos,
        facing: action.dir,
        save: updatedSave,
        ...(state.currentZone === "overworld"
          ? { overworldPos: newPos }
          : {}),
      };

      // Encounter check: only inside buildings, only on ground tiles
      if (
        state.screen === "building" &&
        steppedTile?.kind === "ground" &&
        shouldEncounter(state.currentZone)
      ) {
        const enemyId = pickRandomEnemy(state.currentZone);
        if (enemyId && state.save) {
          const enemy = spawnEnemy(enemyId, state.save.player.level);
          return {
            ...baseUpdate,
            screen: "battle",
            battle: createBattle(enemy),
          };
        }
      }

      return baseUpdate;
    }

    case "INTERACT": {
      if (!currentMap) return state;
      const tile = tileAt(currentMap, state.playerPos);
      if (!tile) return state;
      // Future: shop, save terminal, NPC interactions
      return state;
    }

    case "USE_TOOL": {
      if (state.screen !== "battle" || !state.battle || !state.save)
        return state;
      if (state.battle.phase !== "player_turn") return state;

      const result = resolvePlayerTurn(
        action.tool,
        state.save.player,
        state.battle,
      );

      return {
        ...state,
        battle: result.state,
        save: { ...state.save, player: result.player },
      };
    }

    case "RUN": {
      if (state.screen !== "battle" || !state.battle || !state.save)
        return state;
      if (state.battle.phase !== "player_turn") return state;

      const escaped = attemptRun(state.save.player, state.battle.enemy);
      if (escaped) {
        return {
          ...state,
          screen: "building",
          battle: null,
        };
      }

      // Failed run -- enemy gets a free turn
      const log = [...state.battle.log, "Failed to escape!"];
      return {
        ...state,
        battle: { ...state.battle, log, phase: "player_turn" },
      };
    }

    case "BATTLE_END": {
      if (!state.battle || !state.save) return state;

      let updatedSave = { ...state.save };

      if (state.battle.phase === "won") {
        // Award XP and bits
        const p = { ...updatedSave.player };
        p.xp += state.battle.xpEarned;
        // Level up check
        while (p.xp >= p.xpToNext && p.level < 20) {
          p.xp -= p.xpToNext;
          p.level += 1;
          p.maxIntegrity += 10;
          p.maxCompute += 5;
          p.bandwidth += 1;
          p.firewall += 1;
          p.xpToNext = Math.round(p.xpToNext * 1.5);
        }
        // Restore HP/energy between battles
        p.integrity = p.maxIntegrity;
        p.compute = p.maxCompute;
        updatedSave = {
          ...updatedSave,
          player: p,
          bits: updatedSave.bits + state.battle.bitsEarned,
        };
      } else {
        // Lost: respawn at building entrance, lose 10% bits
        const lostBits = Math.floor(updatedSave.bits * 0.1);
        const buildingMap = getMap(state.currentZone);
        const respawnPos = buildingMap?.spawn ?? state.playerPos;
        const p = { ...updatedSave.player };
        p.integrity = p.maxIntegrity;
        p.compute = p.maxCompute;
        updatedSave = {
          ...updatedSave,
          player: p,
          bits: updatedSave.bits - lostBits,
          currentPosition: respawnPos,
        };
        return {
          ...state,
          screen: "building",
          battle: null,
          save: updatedSave,
          playerPos: respawnPos,
        };
      }

      return {
        ...state,
        screen: "building",
        battle: null,
        save: updatedSave,
      };
    }

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Hook                                                              */
/* ------------------------------------------------------------------ */

export function useGridRunner() {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const moveRepeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check for existing save on mount
  useEffect(() => {
    dispatch({ type: "CHECK_SAVE" });
  }, []);

  // Auto-save on position/zone change
  useEffect(() => {
    if (
      state.save &&
      (state.screen === "overworld" || state.screen === "building")
    ) {
      writeSave(state.save);
    }
  }, [state.save, state.screen]);

  // Keyboard controls -- active on overworld, building, and battle
  useEffect(() => {
    if (
      state.screen !== "overworld" &&
      state.screen !== "building" &&
      state.screen !== "battle"
    )
      return;

    const keyMap: Record<string, Direction> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      w: "up",
      W: "up",
      s: "down",
      S: "down",
      a: "left",
      A: "left",
      d: "right",
      D: "right",
    };

    const held = new Set<string>();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dispatch({ type: "INTERACT" });
        return;
      }
      const dir = keyMap[e.key];
      if (!dir) return;
      e.preventDefault();
      if (held.has(e.key)) return;
      held.add(e.key);
      dispatch({ type: "MOVE", dir });
    }

    function onKeyUp(e: KeyboardEvent) {
      held.delete(e.key);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [state.screen]);

  const startGame = useCallback((name: string) => {
    dispatch({ type: "NEW_GAME", name });
  }, []);

  const continueGame = useCallback(() => {
    dispatch({ type: "CONTINUE" });
  }, []);

  const handleDPadPress = useCallback(
    (dir: Direction) => {
      if (state.screen !== "overworld" && state.screen !== "building")
        return;
      dispatch({ type: "MOVE", dir });
      moveRepeatRef.current = setInterval(() => {
        dispatch({ type: "MOVE", dir });
      }, 180);
    },
    [state.screen],
  );

  const handleDPadRelease = useCallback(() => {
    if (moveRepeatRef.current) {
      clearInterval(moveRepeatRef.current);
      moveRepeatRef.current = null;
    }
  }, []);

  const handleInteract = useCallback(() => {
    dispatch({ type: "INTERACT" });
  }, []);

  const handleUseTool = useCallback((tool: ToolInstance) => {
    dispatch({ type: "USE_TOOL", tool });
  }, []);

  const handleRun = useCallback(() => {
    dispatch({ type: "RUN" });
  }, []);

  const handleBattleEnd = useCallback(() => {
    dispatch({ type: "BATTLE_END" });
  }, []);

  const currentMap = getMap(state.currentZone) ?? overworldMap;
  const currentTile = tileAt(currentMap, state.playerPos);

  return {
    screen: state.screen,
    save: state.save,
    hasSaveFile: state.hasSaveFile,
    playerPos: state.playerPos,
    facing: state.facing,
    currentTile,
    currentZone: state.currentZone,
    map: currentMap,
    battle: state.battle,
    startGame,
    continueGame,
    handleDPadPress,
    handleDPadRelease,
    handleInteract,
    handleUseTool,
    handleRun,
    handleBattleEnd,
  };
}
