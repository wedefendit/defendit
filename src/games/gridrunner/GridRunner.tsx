/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { GridRunnerShell } from "./GridRunnerShell";
import { useForceDarkMode } from "./hooks/useForceDarkMode";
import { useGridRunner } from "./hooks/useGridRunner";
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

const ZONE_NAMES: Record<string, string> = {
  overworld: "CYBERSPACE -- SECTOR 01",
  arcade: "ARCADE",
  bank: "BANK -- FINANCIAL SECTOR",
  hospital: "HOSPITAL -- HEALTHCARE",
  powerplant: "POWER PLANT -- CRITICAL INFRA",
  government: "GOV BUILDING -- ESPIONAGE",
};

/**
 * Top-level GRIDRUNNER component. Manages the screen state machine:
 *   title -> overworld -> building -> battle -> intel
 * Overlays (menu, disc, inventory, operator, save, settings) render on top.
 */
export function GridRunner() {
  useForceDarkMode();
  const game = useGridRunner();

  const isTitleScreen = game.screen === "title";
  const isBattle = game.screen === "battle";
  const isMapScreen = game.screen === "overworld" || game.screen === "building";
  const zoneName = ZONE_NAMES[game.currentZone] ?? game.currentZone.toUpperCase();

  return (
    <GridRunnerShell
      hideControls={isTitleScreen}
      onDPadPress={game.handleDPadPress}
      onDPadRelease={game.handleDPadRelease}
      onActionPress={(btn) => {
        if (btn === "a") game.handleInteract();
        if (btn === "b") game.handleCloseOverlay();
      }}
      onSelect={game.handleOpenDisc}
      onStart={game.handleOpenMenu}
    >
      {isTitleScreen && (
        <TitleScreen
          hasSave={game.hasSaveFile}
          onNewGame={game.startGame}
          onContinue={game.continueGame}
        />
      )}
      {isMapScreen && game.save && (
        <>
          <PlayerHUD
            player={game.save.player}
            playerName={game.save.playerName}
            bits={game.save.bits}
            zoneName={zoneName}
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
          onUseTool={game.handleUseTool}
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
        <SettingsScreen onClose={game.handleCloseOverlay} />
      )}
    </GridRunnerShell>
  );
}
