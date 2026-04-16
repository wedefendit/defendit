/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { ToolInstance } from "../../engine/types";
import { toolDisplayName } from "../../engine/loot";

type InventoryScreenProps = Readonly<{
  onClose: () => void;
  equippedTools: (ToolInstance | null)[];
  inventory: ToolInstance[];
  onEquip: (toolId: string, slotIndex: number) => void;
  onScrap: (toolId: string) => void;
}>;

const RARITY_COLORS: Record<string, string> = {
  common: "text-[#e0e0e0]",
  uncommon: "text-[#00ff41]",
  rare: "text-[#4da6ff]",
  epic: "text-[#a855f7]",
  legendary: "text-[#ff9500]",
};

const RARITY_BORDERS: Record<string, string> = {
  common: "border-[#e0e0e0]/30",
  uncommon: "border-[#00ff41]/30",
  rare: "border-[#4da6ff]/30",
  epic: "border-[#a855f7]/30",
  legendary: "border-[#ff9500]/30",
};

const SCRAP_VALUES: Record<string, number> = {
  common: 3, uncommon: 8, rare: 20, epic: 50, legendary: 120,
};

const TYPE_LABELS: Record<string, string> = {
  recon: "Recon", exploit: "Exploit", defense: "Defense", persistence: "Persistence",
};

export function InventoryScreen({
  onClose,
  equippedTools,
  inventory,
  onEquip,
  onScrap,
}: InventoryScreenProps) {
  return (
    <div
      data-testid="gr-inventory-overlay"
      className="absolute inset-0 z-40 flex flex-col bg-[#0a0e1a]/95"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-[#00f0ff] px-3 py-2">
        <h2 className="gr-font-display text-base font-bold tracking-widest text-[#00f0ff]">
          INVENTORY
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="gr-font-mono rounded-sm border border-[#1a3a4a] bg-[#0f1b2d] px-2 py-1 text-xs text-[#aabbcc] active:brightness-150"
        >
          BACK
        </button>
      </header>

      <div className="gr-font-mono flex-1 overflow-y-auto p-3">
        {/* Equipped slots */}
        <h3 className="mb-1.5 text-xs font-bold tracking-wider text-[#00f0ff]">
          EQUIPPED
        </h3>
        <div className="mb-3 flex flex-col gap-1">
          {equippedTools.map((tool, i) => (
            <div
              key={tool?.id ?? `empty-${i}`}
              className={`rounded-sm border bg-[#0f1b2d] px-2.5 py-2 ${
                tool ? RARITY_BORDERS[tool.rarity] : "border-dashed border-[#1a3a4a]"
              }`}
            >
              {tool ? (
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${RARITY_COLORS[tool.rarity]}`}>
                      Slot {i + 1}: {toolDisplayName(tool)}
                    </span>
                  </div>
                  <span className="text-xs text-[#aabbcc]">
                    {TYPE_LABELS[tool.type]} -- Pwr {tool.power} / Acc {tool.accuracy}% / EN {tool.energyCost}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-[#4a5568]">Slot {i + 1} -- Empty</span>
              )}
            </div>
          ))}
        </div>

        {/* Backpack - each tool has direct equip buttons */}
        <h3 className="mb-1.5 text-xs font-bold tracking-wider text-[#ff6b00]">
          BACKPACK ({inventory.length})
        </h3>
        {inventory.length === 0 ? (
          <p className="text-xs text-[#aabbcc]">No items. Win battles to collect loot.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {inventory.map((tool) => (
              <div
                key={tool.id}
                className={`rounded-sm border bg-[#0f1b2d] px-2.5 py-2 ${RARITY_BORDERS[tool.rarity]}`}
              >
                <div className="flex flex-col gap-1">
                  <span className={`text-sm font-bold ${RARITY_COLORS[tool.rarity]}`}>
                    {toolDisplayName(tool)}
                  </span>
                  <span className="text-xs text-[#aabbcc]">
                    {TYPE_LABELS[tool.type]} -- Pwr {tool.power} / Acc {tool.accuracy}% / EN {tool.energyCost}
                  </span>
                  {/* One-tap equip to any slot */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {equippedTools.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => onEquip(tool.id, i)}
                        className="rounded-sm border border-[#00f0ff] bg-[#0a1220] px-2.5 py-1.5 text-xs font-bold text-[#00f0ff] active:brightness-150"
                      >
                        Equip Slot {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => onScrap(tool.id)}
                      className="rounded-sm border border-[#ff003c] bg-[#0a1220] px-2.5 py-1.5 text-xs font-bold text-[#ff003c] active:brightness-150"
                    >
                      Scrap +{SCRAP_VALUES[tool.rarity] ?? 3}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="gr-font-mono shrink-0 border-t border-[#1a3a4a] px-3 py-1.5 text-center text-xs text-[#aabbcc]">
        Press B to go back
      </p>
    </div>
  );
}
