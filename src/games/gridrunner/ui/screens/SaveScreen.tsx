/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

type SaveScreenProps = Readonly<{
  onClose: () => void;
  onSave: () => void;
}>;

export function SaveScreen({ onClose, onSave }: SaveScreenProps) {
  return (
    <div
      data-testid="gr-save-overlay"
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/80"
    >
      <section
        aria-label="Save game"
        className="flex w-full max-w-[280px] flex-col gap-3 rounded-sm border-2 border-[#00f0ff] bg-[#0a0e1a] p-4"
      >
        <h2 className="gr-font-display text-center text-lg font-bold tracking-widest text-[#00f0ff]">
          SAVE GAME
        </h2>
        <p className="gr-font-mono text-center text-xs text-[#aabbcc]">
          Progress saves automatically. Use this to force a manual save.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onSave}
            className="gr-font-mono flex-1 rounded-sm border-2 border-[#00ff41] bg-[#0f1b2d] px-3 py-2.5 text-sm font-bold tracking-widest text-[#00ff41] active:brightness-150"
          >
            SAVE
          </button>
          <button
            type="button"
            onClick={onClose}
            className="gr-font-mono flex-1 rounded-sm border border-[#1a3a4a] bg-[#0f1b2d] px-3 py-2.5 text-sm font-bold tracking-widest text-[#aabbcc] active:brightness-150"
          >
            CANCEL
          </button>
        </div>
      </section>
    </div>
  );
}
