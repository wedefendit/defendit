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

export type DPadDirection = "up" | "down" | "left" | "right";

type DPadProps = Readonly<{
  /** Called on press. Wired to movement in a future phase. */
  onPress?: (direction: DPadDirection) => void;
  /** Called on release. */
  onRelease?: (direction: DPadDirection) => void;
}>;

const ARROW: Record<DPadDirection, string> = {
  up: "\u25B2",
  down: "\u25BC",
  left: "\u25C0",
  right: "\u25B6",
};

const GRID_AREA: Record<DPadDirection, string> = {
  up: "1 / 2 / 2 / 3",
  left: "2 / 1 / 3 / 2",
  right: "2 / 3 / 3 / 4",
  down: "3 / 2 / 4 / 3",
};

/**
 * Four-directional pad rendered as a 3x3 CSS grid cross.
 * Each arm is a native <button> meeting 44px minimum touch targets.
 * The center cell is decorative.
 */
export function DPad({ onPress, onRelease }: DPadProps) {
  return (
    <nav
      data-testid="gr-dpad"
      aria-label="Directional pad"
      className="grid"
      style={{
        gridTemplateColumns: "repeat(3, 48px)",
        gridTemplateRows: "repeat(3, 48px)",
        gap: "2px",
      }}
    >
      {(["up", "down", "left", "right"] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          data-testid={`gr-dpad-${dir}`}
          aria-label={`Move ${dir}`}
          onPointerDown={() => onPress?.(dir)}
          onPointerUp={() => onRelease?.(dir)}
          onPointerCancel={() => onRelease?.(dir)}
          className="flex items-center justify-center rounded-sm text-sm active:brightness-150"
          style={{
            gridArea: GRID_AREA[dir],
            width: 48,
            height: 48,
            backgroundColor: "#0f1b2d",
            border: "1px solid #1a3a4a",
            color: "#00f0ff",
            boxShadow: "inset 0 0 6px rgba(0, 240, 255, 0.08)",
            touchAction: "none",
          }}
        >
          {ARROW[dir]}
        </button>
      ))}
      {/* Center node - decorative */}
      <div
        aria-hidden
        className="rounded-sm"
        style={{
          gridArea: "2 / 2 / 3 / 3",
          backgroundColor: "#0a1220",
          border: "1px solid #1a3a4a",
        }}
      />
    </nav>
  );
}
