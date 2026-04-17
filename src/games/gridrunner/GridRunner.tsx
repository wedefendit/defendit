/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

"use client";

import { GridRunnerShell } from "./GridRunnerShell";
import { useCallback, useEffect, useRef } from "react";
import { useForceDarkMode } from "./hooks/useForceDarkMode";
import { useGridRunner } from "./hooks/useGridRunner";
import { useAudio } from "./hooks/useAudio";
import type { ToolInstance, ToolType } from "./engine/types";
import { BootScreen } from "./ui/screens/BootScreen";
import { TitleScreen } from "./ui/screens/TitleScreen";
import { OverworldScreen } from "./ui/screens/OverworldScreen";
import { BattleScreen } from "./ui/screens/BattleScreen";
import { PlayerHUD } from "./ui/hud/PlayerHUD";
import { MenuOverlay } from "./ui/screens/MenuOverlay";
import { DiscScreen } from "./ui/screens/DiscScreen";
import { InventoryScreen } from "./ui/screens/InventoryScreen";
import { OperatorScreen } from "./ui/screens/OperatorScreen";
import { SaveScreen } from "./ui/screens/SaveScreen";
import { SettingsScreen } from "./ui/screens/SettingsScreen";
import { ShopScreen } from "./ui/screens/ShopScreen";
import { ZONE_NAMES } from "./data/zones";

const TOOL_SFX: Record<
  ToolType,
  "tool-recon" | "tool-exploit" | "tool-defense" | "tool-persistence"
> = {
  recon: "tool-recon",
  exploit: "tool-exploit",
  defense: "tool-defense",
  persistence: "tool-persistence",
};

/**
 * Top-level GRIDRUNNER component. Manages the screen state machine:
 *   boot -> title -> overworld -> building -> battle
 * Overlays (menu, disc, inventory, operator, save, settings) render on top.
 */
export function GridRunner() {
  useForceDarkMode();
  const game = useGridRunner();

  const isBootScreen = game.screen === "boot";
  const isTitleScreen = game.screen === "title";
  const isBattle = game.screen === "battle";
  const isMapScreen = game.screen === "overworld" || game.screen === "building";
  const zoneName =
    ZONE_NAMES[game.currentZone] ?? game.currentZone.toUpperCase();

  const isBoss = game.battle?.isBoss ?? false;
  const isPaused = game.overlay !== "none";
  const audio = useAudio(
    isBootScreen ? "title" : game.screen,
    game.currentZone,
    isBoss,
    isPaused,
  );

  /* ---- SFX: step on move ---- */
  const prevPosRef = useRef(game.playerPos);
  useEffect(() => {
    const prev = prevPosRef.current;
    if (
      isMapScreen &&
      (prev.x !== game.playerPos.x || prev.y !== game.playerPos.y)
    ) {
      audio.sfx("step");
    }
    prevPosRef.current = game.playerPos;
  }, [game.playerPos, isMapScreen, audio]);

  /* ---- SFX: encounter trigger ---- */
  const prevScreenRef = useRef(game.screen);
  useEffect(() => {
    if (prevScreenRef.current !== "battle" && game.screen === "battle") {
      audio.sfx("encounter");
    }
    prevScreenRef.current = game.screen;
  }, [game.screen, audio]);

  /* ---- SFX: menu open/close ---- */
  const prevOverlayRef = useRef(game.overlay);
  useEffect(() => {
    const prev = prevOverlayRef.current;
    if (prev === "none" && game.overlay !== "none") {
      audio.sfx("menu-open");
    } else if (prev !== "none" && game.overlay === "none") {
      audio.sfx("menu-close");
    }
    prevOverlayRef.current = game.overlay;
  }, [game.overlay, audio]);

  /* ---- SFX: battle log (hit/miss/critical) ---- */
  const prevLogLenRef = useRef(0);
  useEffect(() => {
    if (!game.battle) {
      prevLogLenRef.current = 0;
      return;
    }
    const log = game.battle.log;
    if (log.length <= prevLogLenRef.current) return;

    for (let i = prevLogLenRef.current; i < log.length; i++) {
      const entry = log[i];
      if (entry.includes("[CRIT]")) {
        audio.sfx("critical");
      } else if (entry.includes("[HIT]")) {
        audio.sfx("hit");
      } else if (entry.includes("[MISS]")) {
        audio.sfx("miss");
      }
    }
    prevLogLenRef.current = log.length;
  }, [game.battle?.log.length, game.battle, audio]);

  /* ---- SFX: tool use wrapper ---- */
  const handleUseTool = useCallback(
    (tool: ToolInstance) => {
      audio.sfx(TOOL_SFX[tool.type]);
      game.handleUseTool(tool);
    },
    [audio, game],
  );

  /* ---- Title screen: mute toggle ---- */
  const handleMuteToggle = useCallback(() => {
    audio.onSettingsChange({ ...audio.settings, muted: !audio.settings.muted });
  }, [audio]);

  /* ---- Boot screen: chime ---- */
  const handlePlayChime = useCallback(() => {
    audio.sfx("level-up");
  }, [audio]);

  return (
    <GridRunnerShell
      hideControls={isBootScreen || isTitleScreen}
      onDPadPress={game.handleDPadPress}
      onDPadRelease={game.handleDPadRelease}
      onActionPress={(btn) => {
        if (btn === "a") game.handleInteract();
        if (btn === "b") game.handleCloseOverlay();
      }}
      onSelect={game.handleOpenDisc}
      onStart={game.handleOpenMenu}
    >
      {isBootScreen && (
        <BootScreen
          saveSummary={game.saveSummary}
          onBootDone={game.handleBootDone}
          onDeleteSave={game.handleDeleteSave}
          onPlayChime={handlePlayChime}
        />
      )}
      {isTitleScreen && (
        <TitleScreen
          hasSave={game.hasSaveFile}
          onNewGame={game.startGame}
          onContinue={game.continueGame}
          muted={audio.settings.muted}
          onMuteToggle={handleMuteToggle}
        />
      )}
      {isMapScreen && game.save && (
        <>
          <PlayerHUD
            player={game.save.player}
            playerName={game.save.playerName}
            bits={game.save.bits}
            trackName={audio.trackName}
          />
          <OverworldScreen
            map={game.map}
            playerPos={game.playerPos}
            facing={game.facing}
            zoneName={zoneName}
          />
        </>
      )}
      {isBattle && game.battle && game.save && (
        <BattleScreen
          battle={game.battle}
          player={game.save.player}
          playerName={game.save.playerName}
          equippedTools={game.save.equippedTools}
          onUseTool={handleUseTool}
          onRun={game.handleRun}
          onBattleEnd={game.handleBattleEnd}
        />
      )}

      {/* Overlays */}
      {game.overlay === "menu" && (
        <MenuOverlay
          onClose={game.handleCloseOverlay}
          onOpenOverlay={game.handleOpenOverlay}
          inBattle={isBattle}
        />
      )}
      {game.overlay === "disc" && game.save && (
        <DiscScreen
          onClose={game.handleCloseOverlay}
          equippedTools={game.save.equippedTools}
          inventory={game.save.inventory}
        />
      )}
      {game.overlay === "inventory" && game.save && (
        <InventoryScreen
          onClose={game.handleCloseOverlay}
          equippedTools={game.save.equippedTools}
          inventory={game.save.inventory}
          onEquip={game.handleEquipTool}
          onScrap={game.handleScrapTool}
        />
      )}
      {game.overlay === "operator" && game.save && (
        <OperatorScreen
          onClose={game.handleCloseOverlay}
          player={game.save.player}
          playerName={game.save.playerName}
          bits={game.save.bits}
          defeatedBosses={game.save.defeatedBosses}
          playTime={game.save.playTime}
        />
      )}
      {game.overlay === "save" && (
        <SaveScreen
          onClose={game.handleCloseOverlay}
          onSave={game.handleManualSave}
        />
      )}
      {game.overlay === "settings" && (
        <SettingsScreen
          onClose={game.handleCloseOverlay}
          audioSettings={audio.settings}
          onAudioChange={audio.onSettingsChange}
        />
      )}
      {game.overlay === "shop" && game.save && (
        <ShopScreen
          onClose={game.handleCloseOverlay}
          player={game.save.player}
          bits={game.save.bits}
          inventoryFull={game.save.inventory.length >= 12}
          onBuy={game.handleBuyTool}
        />
      )}
    </GridRunnerShell>
  );
}
