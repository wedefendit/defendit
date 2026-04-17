/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { Button } from "../shared/Button";
import { OverlayShell } from "../shared/OverlayShell";

type SaveScreenProps = Readonly<{
  onClose: () => void;
  onSave: () => void;
}>;

export function SaveScreen({ onClose, onSave }: SaveScreenProps) {
  return (
    <OverlayShell
      testId="gr-save-overlay"
      title="SAVE GAME"
      onClose={onClose}
      variant="dialog"
    >
      <p className="gr-font-mono text-center text-xs text-[#aabbcc]">
        Progress saves automatically. Use this to force a manual save.
      </p>
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={onSave}
          testId="gr-save-confirm"
          className="flex-1 border-2 border-[#00ff41] text-[#00ff41] text-sm py-2.5"
        >
          SAVE
        </Button>
        <Button
          variant="neutral"
          onClick={onClose}
          testId="gr-save-cancel"
          className="flex-1 text-sm py-2.5"
        >
          CANCEL
        </Button>
      </div>
    </OverlayShell>
  );
}
