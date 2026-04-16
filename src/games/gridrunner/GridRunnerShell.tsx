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
import type { DPadDirection } from "./ui/hud/DPad";
import type { ActionButton } from "./ui/hud/ActionButtons";

type GridRunnerShellProps = Readonly<{
  children: ReactNode;
  onDPadPress?: (dir: DPadDirection) => void;
  onDPadRelease?: (dir: DPadDirection) => void;
  onActionPress?: (btn: ActionButton) => void;
  onActionRelease?: (btn: ActionButton) => void;
  onSelect?: () => void;
  onStart?: () => void;
  hideControls?: boolean;
}>;

const GR_STYLES = `
@font-face {
  font-family: 'Share Tech Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/share-tech-mono-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Orbitron';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/orbitron-400.woff2') format('woff2');
}
@font-face {
  font-family: 'Orbitron';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/orbitron-700.woff2') format('woff2');
}
@font-face {
  font-family: 'Orbitron';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url('/fonts/orbitron-900.woff2') format('woff2');
}

/* Utility classes for game fonts */
.gr-font-mono { font-family: 'Share Tech Mono', monospace; }
.gr-font-display { font-family: 'Orbitron', sans-serif; }

/* Safe area padding for notched devices */
.gr-safe-area {
  padding-left: env(safe-area-inset-left, 0px);
  padding-right: env(safe-area-inset-right, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

@keyframes boss-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
`;

export function GridRunnerShell({
  children,
  onDPadPress,
  onDPadRelease,
  onActionPress,
  onActionRelease,
  onSelect,
  onStart,
  hideControls,
}: GridRunnerShellProps) {
  return (
    <main
      data-testid="gr-root"
      className="gr-safe-area relative flex min-h-0 flex-1 flex-col items-center overflow-hidden"
    >
      <style>{GR_STYLES}</style>
      <section
        data-testid="gr-frame"
        aria-label="GRIDRUNNER game"
        className="relative mx-auto flex min-h-0 w-full max-w-[640px] flex-1 flex-col overflow-hidden"
      >
        <div data-testid="gr-viewport" className="relative min-h-0 flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
        {!hideControls && (
          <GameControls
            onDPadPress={onDPadPress}
            onDPadRelease={onDPadRelease}
            onActionPress={onActionPress}
            onActionRelease={onActionRelease}
            onSelect={onSelect}
            onStart={onStart}
          />
        )}
      </section>
    </main>
  );
}
