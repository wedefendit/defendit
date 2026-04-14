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
import { TitleScreen } from "./ui/screens/TitleScreen";

/**
 * Top-level GRIDRUNNER component. Manages the screen state machine:
 *   title -> overworld -> building -> battle -> intel
 *
 * Phase 1: only renders the title screen inside the frame shell.
 */
export function GridRunner() {
  useForceDarkMode();

  return (
    <GridRunnerShell>
      <TitleScreen />
    </GridRunnerShell>
  );
}
