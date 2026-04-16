/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

type MenuOverlayProps = Readonly<{
  onClose: () => void;
  onOpenOverlay: (target: "disc" | "inventory" | "operator" | "save" | "settings") => void;
  inBattle: boolean;
}>;

const MENU_ITEMS = [
  { id: "disc", label: "DISC", desc: "Identity Disc encyclopedia", battleOk: true },
  { id: "inventory", label: "INVENTORY", desc: "View and equip tools", battleOk: true },
  { id: "operator", label: "OPERATOR", desc: "Stats, badges, level", battleOk: true },
  { id: "save", label: "SAVE", desc: "Save your progress", battleOk: false },
  { id: "settings", label: "SETTINGS", desc: "Audio and controls", battleOk: false },
] as const;

export function MenuOverlay({ onClose, onOpenOverlay, inBattle }: MenuOverlayProps) {
  function handleSelect(id: string) {
    if (id === "disc" || id === "inventory" || id === "operator" || id === "save" || id === "settings") {
      onOpenOverlay(id);
    }
  }

  return (
    <div
      data-testid="gr-menu-overlay"
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/80"
    >
      <section
        aria-label="Game menu"
        className="flex w-full max-w-[280px] flex-col gap-1 rounded-sm border-2 border-[#00f0ff] bg-[#0a0e1a] p-4"
      >
        <h2 className="gr-font-display mb-2 text-center text-lg font-bold tracking-widest text-[#00f0ff]">
          MENU
        </h2>

        {MENU_ITEMS.map((item) => {
          const disabled = inBattle && !item.battleOk;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(item.id)}
              className="gr-font-mono flex items-center justify-between rounded-sm border border-[#1a3a4a] bg-[#0f1b2d] px-3 py-2.5 text-left text-sm text-[#00f0ff] transition-opacity disabled:opacity-30"
            >
              <span className="font-bold tracking-wider">{item.label}</span>
              <span className="text-xs text-[#aabbcc]">{item.desc}</span>
            </button>
          );
        })}

        <p className="gr-font-mono mt-2 text-center text-xs text-[#aabbcc]">
          Press B to close
        </p>
      </section>
    </div>
  );
}
