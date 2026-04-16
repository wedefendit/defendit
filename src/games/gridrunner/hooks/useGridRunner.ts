/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { useCallback, useEffect, useReducer, useRef } from "react";
import type {
  BattleState,
  GameScreen,
  GridRunnerSave,
  Position,
  ToolInstance,
} from "../engine/types";
import { createNewSave, hasSave, loadSave, writeSave } from "../engine/save";
import { move, tileAt, type Direction } from "../engine/movement";
import { getMap } from "../data/maps";
import { overworldMap } from "../data/maps/overworld";
import {
  bosses,
  pickRandomEnemy,
  shouldEncounter,
  spawnEnemy,
} from "../engine/enemies";
import { attemptRun, createBattle, resolvePlayerTurn } from "../engine/battle";

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
  overlay:
    | "none"
    | "menu"
    | "disc"
    | "inventory"
    | "operator"
    | "save"
    | "settings";
  /** Where B/Close navigates back to. "none" closes entirely, "menu" goes back to menu. */
  overlayReturnTo: "none" | "menu";
}

type Action =
  | { type: "NEW_GAME"; name: string }
  | { type: "CONTINUE" }
  | { type: "MOVE"; dir: Direction }
  | { type: "INTERACT" }
  | { type: "CHECK_SAVE" }
  | { type: "USE_TOOL"; tool: ToolInstance }
  | { type: "RUN" }
  | { type: "BATTLE_END" }
  | { type: "OPEN_MENU" }
  | { type: "OPEN_DISC" }
  | {
      type: "OPEN_OVERLAY";
      target: "disc" | "inventory" | "operator" | "save" | "settings";
    }
  | { type: "CLOSE_OVERLAY" }
  | { type: "EQUIP_TOOL"; toolId: string; slotIndex: number }
  | { type: "SCRAP_TOOL"; toolId: string }
  | { type: "MANUAL_SAVE" };

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
    overlay: "none",
    overlayReturnTo: "none",
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
      if (state.overlay !== "none") return state;
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
        ...(state.currentZone === "overworld" ? { overworldPos: newPos } : {}),
      };

      // Boss tile: start boss fight if level requirement met
      const BOSS_MIN_LEVEL: Record<string, number> = {
        lazarus: 5,
      };

      if (
        state.screen === "building" &&
        steppedTile?.kind === "boss" &&
        steppedTile.bossId &&
        state.save
      ) {
        const bossDef = bosses[steppedTile.bossId];
        const minLevel = BOSS_MIN_LEVEL[steppedTile.bossId] ?? 1;

        if (bossDef && state.save.player.level >= minLevel) {
          const bossEnemy = {
            def: bossDef,
            hp: bossDef.baseHp,
            maxHp: bossDef.baseHp,
          };
          return {
            ...baseUpdate,
            screen: "battle",
            battle: createBattle(bossEnemy, true),
          };
        }
        // Under-leveled: don't start fight, stay on tile
      }

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
            battle: createBattle(enemy, false),
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
          p.maxCompute += 8;
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

        // Track boss defeats
        const bossId = state.battle.enemy.def.id;
        if (bosses[bossId] && !updatedSave.defeatedBosses.includes(bossId)) {
          updatedSave = {
            ...updatedSave,
            defeatedBosses: [...updatedSave.defeatedBosses, bossId],
          };
        }

        // Add loot drop to inventory
        if (state.battle.lootDrop) {
          updatedSave = {
            ...updatedSave,
            inventory: [...updatedSave.inventory, state.battle.lootDrop],
          };
        }
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

    case "OPEN_MENU": {
      if (state.screen === "title") return state;
      if (state.overlay === "menu")
        return { ...state, overlay: "none", overlayReturnTo: "none" };
      return { ...state, overlay: "menu", overlayReturnTo: "none" };
    }

    case "OPEN_DISC": {
      // Direct access via SELECT -- B closes entirely
      if (state.screen === "title") return state;
      if (state.overlay === "disc")
        return { ...state, overlay: "none", overlayReturnTo: "none" };
      return { ...state, overlay: "disc", overlayReturnTo: "none" };
    }

    case "OPEN_OVERLAY": {
      // Opened from menu -- B goes back to menu
      if (state.screen === "title") return state;
      return { ...state, overlay: action.target, overlayReturnTo: "menu" };
    }

    case "CLOSE_OVERLAY": {
      return {
        ...state,
        overlay: state.overlayReturnTo,
        overlayReturnTo: "none",
      };
    }

    case "EQUIP_TOOL": {
      if (!state.save) return state;
      const tool = state.save.inventory.find((t) => t.id === action.toolId);
      if (!tool) return state;
      const idx = action.slotIndex;
      if (idx < 0 || idx >= state.save.equippedTools.length) return state;

      const oldTool = state.save.equippedTools[idx];
      const newEquipped = [...state.save.equippedTools];
      newEquipped[idx] = tool;

      let newInventory = state.save.inventory.filter(
        (t) => t.id !== action.toolId,
      );
      if (oldTool) {
        newInventory = [...newInventory, oldTool];
      }

      return {
        ...state,
        save: {
          ...state.save,
          equippedTools: newEquipped,
          inventory: newInventory,
        },
      };
    }

    case "SCRAP_TOOL": {
      if (!state.save) return state;
      const tool = state.save.inventory.find((t) => t.id === action.toolId);
      if (!tool) return state;

      const SCRAP_VALUES: Record<string, number> = {
        common: 3,
        uncommon: 8,
        rare: 20,
        epic: 50,
        legendary: 120,
      };
      const bitsGained = SCRAP_VALUES[tool.rarity] ?? 3;

      return {
        ...state,
        save: {
          ...state.save,
          inventory: state.save.inventory.filter((t) => t.id !== action.toolId),
          bits: state.save.bits + bitsGained,
        },
      };
    }

    case "MANUAL_SAVE": {
      if (state.save) {
        writeSave(state.save);
      }
      return { ...state, overlay: "none" };
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

  // Keyboard controls -- always active except title screen
  useEffect(() => {
    if (state.screen === "title") return;

    const moveKeys: Record<string, Direction> = {
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
      // Escape: close overlay or toggle menu
      if (e.key === "Escape") {
        e.preventDefault();
        if (state.overlay !== "none") {
          dispatch({ type: "CLOSE_OVERLAY" });
        } else {
          dispatch({ type: "OPEN_MENU" });
        }
        return;
      }

      // B / Backspace: close overlay (B button)
      if (e.key === "b" || e.key === "B" || e.key === "Backspace") {
        // Only act as B button when overlay is open or in battle
        // Don't capture 'b' during normal movement (WASD doesn't use B)
        if (state.overlay !== "none") {
          e.preventDefault();
          dispatch({ type: "CLOSE_OVERLAY" });
          return;
        }
      }

      // Tab / I: open Disc (SELECT)
      if (e.key === "Tab" || e.key === "i" || e.key === "I") {
        e.preventDefault();
        dispatch({ type: "OPEN_DISC" });
        return;
      }

      // M: open menu (START)
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        dispatch({ type: "OPEN_MENU" });
        return;
      }

      // Block all other keys when overlay is open
      if (state.overlay !== "none") return;

      // Battle hotkeys: 1-4 for tools, 5/R for run
      if (
        state.screen === "battle" &&
        state.battle?.phase === "player_turn" &&
        state.save
      ) {
        const toolSlot = Number(e.key);
        if (toolSlot >= 1 && toolSlot <= 4) {
          e.preventDefault();
          const tool = state.save.equippedTools[toolSlot - 1];
          if (tool && state.save.player.compute >= tool.energyCost) {
            dispatch({ type: "USE_TOOL", tool });
          }
          return;
        }
        if (e.key === "5" || e.key === "r" || e.key === "R") {
          e.preventDefault();
          dispatch({ type: "RUN" });
          return;
        }
      }

      // Enter / Space: A button (interact / confirm)
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dispatch({ type: "INTERACT" });
        return;
      }

      // Movement (overworld/building only)
      const dir = moveKeys[e.key];
      if (!dir) return;
      e.preventDefault();
      if (held.has(e.key)) return;
      held.add(e.key);
      dispatch({ type: "MOVE", dir });
    }

    function onKeyUp(e: KeyboardEvent) {
      held.delete(e.key);
    }

    globalThis.addEventListener("keydown", onKeyDown);
    globalThis.addEventListener("keyup", onKeyUp);
    return () => {
      globalThis.removeEventListener("keydown", onKeyDown);
      globalThis.removeEventListener("keyup", onKeyUp);
    };
  }, [state.screen, state.overlay, state.battle?.phase, state.save]);

  const startGame = useCallback((name: string) => {
    dispatch({ type: "NEW_GAME", name });
  }, []);

  const continueGame = useCallback(() => {
    dispatch({ type: "CONTINUE" });
  }, []);

  const handleDPadPress = useCallback(
    (dir: Direction) => {
      if (state.screen !== "overworld" && state.screen !== "building") return;
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

  const handleOpenMenu = useCallback(() => {
    dispatch({ type: "OPEN_MENU" });
  }, []);

  const handleOpenDisc = useCallback(() => {
    dispatch({ type: "OPEN_DISC" });
  }, []);

  const handleCloseOverlay = useCallback(() => {
    dispatch({ type: "CLOSE_OVERLAY" });
  }, []);

  const handleOpenOverlay = useCallback(
    (target: "disc" | "inventory" | "operator" | "save" | "settings") => {
      dispatch({ type: "OPEN_OVERLAY", target });
    },
    [],
  );

  const handleEquipTool = useCallback((toolId: string, slotIndex: number) => {
    dispatch({ type: "EQUIP_TOOL", toolId, slotIndex });
  }, []);

  const handleScrapTool = useCallback((toolId: string) => {
    dispatch({ type: "SCRAP_TOOL", toolId });
  }, []);

  const handleManualSave = useCallback(() => {
    dispatch({ type: "MANUAL_SAVE" });
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
    overlay: state.overlay,
    startGame,
    continueGame,
    handleDPadPress,
    handleDPadRelease,
    handleInteract,
    handleUseTool,
    handleRun,
    handleBattleEnd,
    handleOpenMenu,
    handleOpenDisc,
    handleCloseOverlay,
    handleOpenOverlay,
    handleEquipTool,
    handleScrapTool,
    handleManualSave,
  };
}
