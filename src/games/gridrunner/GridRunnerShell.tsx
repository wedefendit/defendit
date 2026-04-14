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

import type { ReactNode } from "react";
import { GameControls } from "./ui/hud/GameControls";

type GridRunnerShellProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Top-level game frame container. Sits below the site nav inside the
 * Layout h-dvh flex column. The frame:
 *
 *   - fills available width on mobile (respecting safe-area insets)
 *   - caps at a max width on desktop, centered horizontally
 *   - never exceeds available height (no vertical scroll)
 *   - clips all overflow so the game world stays contained
 *
 * All game screens (title, overworld, battle, etc.) render inside
 * the frame. On desktop with extra horizontal room, future HUD
 * panels can be placed outside the frame in gr-root's remaining space.
 *
 * Mobile controls (d-pad + action buttons) sit at the bottom of the
 * frame as a fixed-height bar. The game viewport fills remaining space.
 */
export function GridRunnerShell({ children }: GridRunnerShellProps) {
  return (
    <main
      data-testid="gr-root"
      className="relative flex min-h-0 flex-1 flex-col items-center overflow-hidden"
      style={{
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <section
        data-testid="gr-frame"
        aria-label="GRIDRUNNER game"
        className="relative mx-auto flex min-h-0 w-full max-w-[960px] flex-1 flex-col overflow-hidden"
      >
        {/* Game viewport - fills available space above controls */}
        <div data-testid="gr-viewport" className="relative min-h-0 flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
        {/* Mobile controls - hidden on desktop (lg+) */}
        <GameControls />
      </section>
    </main>
  );
}
