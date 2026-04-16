/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { useState } from "react";
import type { ToolInstance } from "../../engine/types";
import { getToolInfo } from "../../engine/loot";

type DiscScreenProps = Readonly<{
  onClose: () => void;
  equippedTools: (ToolInstance | null)[];
  inventory: ToolInstance[];
}>;

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                   */
/* ------------------------------------------------------------------ */

type TabId = "tools" | "types" | "threats" | "killchain" | "intel";

const TABS: { id: TabId; label: string; available: boolean }[] = [
  { id: "tools", label: "TOOLS", available: true },
  { id: "types", label: "TYPES", available: true },
  { id: "threats", label: "THREATS", available: false },
  { id: "killchain", label: "CHAIN", available: false },
  { id: "intel", label: "INTEL", available: false },
];

/* ------------------------------------------------------------------ */
/*  Type chart (GDD §8.4)                                             */
/* ------------------------------------------------------------------ */

const TYPE_CHART = [
  { type: "Recon", strong: "Persistence (1.5x)", weak: "Defense (0.75x)", color: "text-[#00f0ff]", desc: "Scanning and information gathering. Know your target before you strike." },
  { type: "Exploit", strong: "Defense (1.5x)", weak: "Persistence (0.75x)", color: "text-[#ff5c72]", desc: "Direct attacks that break through defenses. High risk, high reward." },
  { type: "Defense", strong: "Exploit (1.5x)", weak: "Recon (0.75x)", color: "text-[#00ff41]", desc: "Shields and detection. Blocks incoming attacks and reveals threats." },
  { type: "Persistence", strong: "Recon (1.5x)", weak: "Exploit (0.75x)", color: "text-[#ff00de]", desc: "Maintaining access. Slow damage over time that is hard to remove." },
];

const TYPE_COLORS: Record<string, string> = {
  recon: "text-[#00f0ff]",
  exploit: "text-[#ff5c72]",
  defense: "text-[#00ff41]",
  persistence: "text-[#ff00de]",
};

/* ------------------------------------------------------------------ */
/*  Tools tab -- education first, tap to expand                       */
/* ------------------------------------------------------------------ */

function ToolsTab({ equippedTools, inventory }: Readonly<{ equippedTools: (ToolInstance | null)[]; inventory: ToolInstance[] }>) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Deduplicate by baseToolId -- show each tool type once
  const seen = new Set<string>();
  const uniqueTools: ToolInstance[] = [];
  for (const t of [...equippedTools.filter((t): t is ToolInstance => t !== null), ...inventory]) {
    if (!seen.has(t.baseToolId)) {
      seen.add(t.baseToolId);
      uniqueTools.push(t);
    }
  }

  if (uniqueTools.length === 0) {
    return <p className="text-sm text-[#aabbcc]">No tools discovered yet. Win battles to find tools.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-[#aabbcc]">
        Tap a tool to learn what it does. These are real cybersecurity tools used by professionals.
      </p>
      {uniqueTools.map((tool) => {
        const info = getToolInfo(tool.baseToolId);
        const isOpen = expanded === tool.baseToolId;
        const typeColor = TYPE_COLORS[tool.type] ?? "text-[#aabbcc]";

        return (
          <button
            key={tool.baseToolId}
            type="button"
            onClick={() => setExpanded(isOpen ? null : tool.baseToolId)}
            className="w-full rounded-sm border border-[#1a3a4a] bg-[#0f1b2d] px-3 py-2.5 text-left transition-colors hover:border-[#00f0ff]/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#e0e0e0]">
                {info?.name ?? tool.baseToolId}
              </span>
              <span className={`text-xs font-bold ${typeColor}`}>
                {info?.type.toUpperCase() ?? "UNKNOWN"}
              </span>
            </div>
            <p className="mt-1 text-xs text-[#00f0ff]">
              {info?.description ?? "Unknown tool"}
            </p>
            {isOpen && (
              <div className="mt-2 border-t border-[#1a3a4a] pt-2">
                <p className="text-xs text-[#aabbcc]">
                  {tool.type === "recon" && "Recon tools gather intelligence. In the real world, security teams use these to map networks and find weaknesses before attackers do. In battle, Recon is strong against Persistence but weak against Defense."}
                  {tool.type === "exploit" && "Exploit tools attack directly. In the real world, penetration testers use these to prove a vulnerability is real, not theoretical. In battle, Exploit is strong against Defense but weak against Persistence."}
                  {tool.type === "defense" && "Defense tools protect and detect. In the real world, these are the firewalls, intrusion detection systems, and malware scanners that guard every network. In battle, Defense is strong against Exploit but weak against Recon."}
                  {tool.type === "persistence" && "Persistence tools maintain access over time. In the real world, attackers use these to stay hidden inside a network after breaking in. In battle, Persistence is strong against Recon but weak against Exploit."}
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Types tab                                                         */
/* ------------------------------------------------------------------ */

function TypesTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-[#aabbcc]">
        Every tool has a type. Match your type to the enemy weakness for bonus damage.
      </p>
      {TYPE_CHART.map((row) => {
        const isOpen = expanded === row.type;
        return (
          <button
            key={row.type}
            type="button"
            onClick={() => setExpanded(isOpen ? null : row.type)}
            className="w-full rounded-sm border border-[#1a3a4a] bg-[#0f1b2d] px-3 py-2.5 text-left transition-colors hover:border-[#00f0ff]/50"
          >
            <span className={`text-sm font-bold ${row.color}`}>{row.type}</span>
            <div className="mt-1 flex flex-col gap-0.5 text-xs">
              <span className="text-[#00ff41]">Strong vs {row.strong}</span>
              <span className="text-[#ff5c72]">Weak vs {row.weak}</span>
            </div>
            {isOpen && (
              <div className="mt-2 border-t border-[#1a3a4a] pt-2">
                <p className="text-xs text-[#aabbcc]">{row.desc}</p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Locked tab                                                        */
/* ------------------------------------------------------------------ */

function LockedTab() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="gr-font-mono text-sm text-[#aabbcc]">
        ??? LOCKED -- Keep playing to unlock
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Disc screen                                                  */
/* ------------------------------------------------------------------ */

export function DiscScreen({ onClose, equippedTools, inventory }: DiscScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>("tools");

  return (
    <div
      data-testid="gr-disc-overlay"
      className="absolute inset-0 z-40 flex flex-col bg-[#0a0e1a]/95"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-[#00f0ff] px-3 py-2">
        <h2 className="gr-font-display text-base font-bold tracking-widest text-[#00f0ff]">
          IDENTITY DISC
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="gr-font-mono rounded-sm border border-[#1a3a4a] bg-[#0f1b2d] px-2 py-1 text-xs text-[#aabbcc] active:brightness-150"
        >
          BACK
        </button>
      </header>

      {/* Tabs */}
      <nav aria-label="Disc sections" className="flex shrink-0 border-b border-[#1a3a4a]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => tab.available && setActiveTab(tab.id)}
            className={`gr-font-mono flex-1 px-1 py-2 text-xs font-bold tracking-wider transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-[#00f0ff] text-[#00f0ff]"
                : tab.available
                  ? "text-[#aabbcc]"
                  : "text-[#4a5568] opacity-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="gr-font-mono flex-1 overflow-y-auto p-3">
        {activeTab === "tools" && (
          <ToolsTab equippedTools={equippedTools} inventory={inventory} />
        )}
        {activeTab === "types" && <TypesTab />}
        {(activeTab === "threats" || activeTab === "killchain" || activeTab === "intel") && (
          <LockedTab />
        )}
      </div>

      <p className="gr-font-mono shrink-0 border-t border-[#1a3a4a] px-3 py-1.5 text-center text-xs text-[#aabbcc]">
        Press B to go back
      </p>
    </div>
  );
}
