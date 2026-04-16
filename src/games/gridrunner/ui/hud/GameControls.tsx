/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { DPad, type DPadDirection } from "./DPad";
import { ActionButtons, type ActionButton } from "./ActionButtons";

type GameControlsProps = Readonly<{
  onDPadPress?: (dir: DPadDirection) => void;
  onDPadRelease?: (dir: DPadDirection) => void;
  onActionPress?: (btn: ActionButton) => void;
  onActionRelease?: (btn: ActionButton) => void;
  onSelect?: () => void;
  onStart?: () => void;
}>;

/**
 * Bottom control bar: d-pad left, Select/Start center, A/B right.
 * Game Boy layout. Visible on ALL screen sizes.
 */
export function GameControls({
  onDPadPress,
  onDPadRelease,
  onActionPress,
  onActionRelease,
  onSelect,
  onStart,
}: GameControlsProps) {
  return (
    <footer
      data-testid="gr-controls"
      aria-label="Game controls"
      className="flex shrink-0 items-center justify-between border-t border-[#1a3a4a] bg-[#080c16] px-4 py-2"
    >
      <DPad onPress={onDPadPress} onRelease={onDPadRelease} />

      <nav aria-label="Menu buttons" className="flex flex-col items-center gap-2">
        <div className="flex gap-3">
          <button
            type="button"
            data-testid="gr-btn-select"
            aria-label="Select (open Disc)"
            onClick={onSelect}
            className="gr-font-mono touch-none rounded-sm border border-[#1a3a4a] bg-[#0a1220] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#aabbcc] active:brightness-150"
          >
            SELECT
          </button>
          <button
            type="button"
            data-testid="gr-btn-start"
            aria-label="Start (open menu)"
            onClick={onStart}
            className="gr-font-mono touch-none rounded-sm border border-[#1a3a4a] bg-[#0a1220] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#aabbcc] active:brightness-150"
          >
            START
          </button>
        </div>
      </nav>

      <ActionButtons onPress={onActionPress} onRelease={onActionRelease} />
    </footer>
  );
}
