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

export type ActionButton = "a" | "b";

type ActionButtonsProps = Readonly<{
  /** Called on press. Wired to game actions in a future phase. */
  onPress?: (button: ActionButton) => void;
  /** Called on release. */
  onRelease?: (button: ActionButton) => void;
}>;

/**
 * Two-button action cluster (A = primary, B = secondary).
 * Arranged diagonally like a Game Boy: B top-left, A bottom-right.
 * Each button is 48px diameter, meeting 44px touch target minimum.
 */
export function ActionButtons({ onPress, onRelease }: ActionButtonsProps) {
  return (
    <div
      data-testid="gr-action-buttons"
      role="group"
      aria-label="Action buttons"
      className="relative"
      style={{ width: 110, height: 100 }}
    >
      {/* B button - top left */}
      <button
        type="button"
        data-testid="gr-btn-b"
        aria-label="B button (cancel)"
        onPointerDown={() => onPress?.("b")}
        onPointerUp={() => onRelease?.("b")}
        onPointerCancel={() => onRelease?.("b")}
        className="absolute flex items-center justify-center rounded-full font-mono text-sm font-bold active:brightness-150"
        style={{
          top: 0,
          left: 0,
          width: 48,
          height: 48,
          backgroundColor: "#0f1b2d",
          border: "2px solid #ff00de",
          color: "#ff00de",
          boxShadow:
            "inset 0 0 8px rgba(255, 0, 222, 0.12), 0 0 4px rgba(255, 0, 222, 0.1)",
          touchAction: "none",
        }}
      >
        B
      </button>

      {/* A button - bottom right */}
      <button
        type="button"
        data-testid="gr-btn-a"
        aria-label="A button (confirm)"
        onPointerDown={() => onPress?.("a")}
        onPointerUp={() => onRelease?.("a")}
        onPointerCancel={() => onRelease?.("a")}
        className="absolute flex items-center justify-center rounded-full font-mono text-sm font-bold active:brightness-150"
        style={{
          bottom: 0,
          right: 0,
          width: 48,
          height: 48,
          backgroundColor: "#0f1b2d",
          border: "2px solid #00f0ff",
          color: "#00f0ff",
          boxShadow:
            "inset 0 0 8px rgba(0, 240, 255, 0.12), 0 0 4px rgba(0, 240, 255, 0.1)",
          touchAction: "none",
        }}
      >
        A
      </button>
    </div>
  );
}
