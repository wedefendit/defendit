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

import { DPad } from "./DPad";
import { ActionButtons } from "./ActionButtons";

/**
 * Bottom control bar: d-pad on the left, A/B buttons on the right.
 * Visible on mobile (below lg breakpoint), hidden on desktop where
 * keyboard controls are primary.
 *
 * Sits inside the game frame as a fixed-height bar at the bottom.
 * The game viewport (overworld, battle, etc.) fills the remaining
 * space above.
 */
export function GameControls() {
  return (
    <footer
      data-testid="gr-controls"
      aria-label="Game controls"
      className="flex shrink-0 items-center justify-between px-4 py-2 lg:hidden"
      style={{
        backgroundColor: "#080c16",
        borderTop: "1px solid #1a3a4a",
      }}
    >
      <DPad />
      <ActionButtons />
    </footer>
  );
}
