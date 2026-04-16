/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

type SettingsScreenProps = Readonly<{
  onClose: () => void;
}>;

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  return (
    <div
      data-testid="gr-settings-overlay"
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/80"
    >
      <section
        aria-label="Settings"
        className="flex w-full max-w-[280px] flex-col gap-3 rounded-sm border-2 border-[#00f0ff] bg-[#0a0e1a] p-4"
      >
        <h2 className="gr-font-display text-center text-lg font-bold tracking-widest text-[#00f0ff]">
          SETTINGS
        </h2>
        <p className="gr-font-mono text-center text-xs text-[#aabbcc]">
          Audio and control settings coming in a future update.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="gr-font-mono rounded-sm border border-[#1a3a4a] bg-[#0f1b2d] px-3 py-2.5 text-sm font-bold tracking-widest text-[#aabbcc] active:brightness-150"
        >
          CLOSE
        </button>
      </section>
    </div>
  );
}
