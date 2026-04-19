/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

"use client";

import { Button } from "../shared/Button";
import { OverlayShell } from "../shared/OverlayShell";

type SectorUnlockOverlayProps = Readonly<{
  onClose: () => void;
}>;

/**
 * Placeholder overlay shown when the player walks onto the Sector 02 gate
 * after defeating TraderTraitor. The V1 prototype ends at Sector 01; this
 * overlay signals that the world continues without promising specific
 * content. Per GDD §4.12, Sectors 02-08 are not implemented.
 */
export function SectorUnlockOverlay({ onClose }: SectorUnlockOverlayProps) {
  return (
    <OverlayShell
      testId="gr-sector-unlock-overlay"
      title="SECTOR BOUNDARY"
      onClose={onClose}
    >
      <header className="flex items-center gap-3">
        <figure className="shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#00f0ff] text-lg font-bold text-[#0a0e1a] shadow-[0_0_12px_#00f0ffaa]">
            02
          </div>
        </figure>
        <div className="min-w-0">
          <h3 className="gr-font-display text-base font-bold tracking-widest text-[#00f0ff]">
            SECTOR 02 DETECTED
          </h3>
          <p className="gr-font-mono text-xs text-[#aabbcc]">
            Trace extends beyond this boundary
          </p>
        </div>
      </header>

      <section>
        <p className="gr-font-mono text-xs leading-snug text-[#e0e0e0]">
          With the Lazarus laundering cell cleared, the eastern gate has gone
          quiet. You sense the grid keeps going -- more sectors, more threat
          actors, more infrastructure to defend.
        </p>
      </section>

      <section>
        <p className="gr-font-mono text-xs leading-snug text-[#aabbcc]">
          But this firmware ends here. Sector 02 and beyond ship in a future
          release. Thanks for running the grid, operator.
        </p>
      </section>

      <div className="pt-4">
        <Button
          variant="primary"
          onClick={onClose}
          testId="gr-sector-unlock-continue"
          className="w-full text-sm py-2.5"
        >
          ACKNOWLEDGED
        </Button>
      </div>
    </OverlayShell>
  );
}
