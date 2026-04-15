/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.

This software and its source code are the proprietary property of
Defend I.T. Solutions LLC and are protected by United States and
international copyright laws. Unauthorized reproduction, distribution,
modification, display, or use of this software, in whole or in part, without the
prior written permission of Defend I.T. Solutions LLC, is strictly prohibited.

This software is provided for use only by authorized employees, contractors, or
licensees of Defend I.T. Solutions LLC and may not be disclosed to any third
party without express written consent.
*/

import { GridRunnerShell } from "./GridRunnerShell";
import { useForceDarkMode } from "./hooks/useForceDarkMode";
import { useGridRunner } from "./hooks/useGridRunner";
import { TitleScreen } from "./ui/screens/TitleScreen";
import { OverworldScreen } from "./ui/screens/OverworldScreen";
import { BattleScreen } from "./ui/screens/BattleScreen";

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
 */
export function GridRunner() {
  useForceDarkMode();
  const game = useGridRunner();

  const isTitleScreen = game.screen === "title";
  const isBattle = game.screen === "battle";
  const isMapScreen = game.screen === "overworld" || game.screen === "building";

  return (
    <GridRunnerShell
      hideControls={isTitleScreen || isBattle}
      onDPadPress={game.handleDPadPress}
      onDPadRelease={game.handleDPadRelease}
      onActionPress={(btn) => {
        if (btn === "a") game.handleInteract();
      }}
    >
      {isTitleScreen && (
        <TitleScreen
          hasSave={game.hasSaveFile}
          onNewGame={game.startGame}
          onContinue={game.continueGame}
        />
      )}
      {isMapScreen && (
        <OverworldScreen
          map={game.map}
          playerPos={game.playerPos}
          facing={game.facing}
          zoneName={ZONE_NAMES[game.currentZone] ?? game.currentZone.toUpperCase()}
        />
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
    </GridRunnerShell>
  );
}
