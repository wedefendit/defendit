/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { PlayerState } from "../../engine/types";

type OperatorScreenProps = Readonly<{
  onClose: () => void;
  player: PlayerState;
  playerName: string;
  bits: number;
  defeatedBosses: string[];
  playTime: number;
}>;

const BOSS_NAMES: Record<string, string> = {
  lazarus: "Lazarus Group",
};

const BADGES: { id: string; label: string; condition: string }[] = [
  { id: "grid-runner", label: "Grid Runner", condition: "Complete the tutorial" },
  { id: "bank-buster", label: "Bank Buster", condition: "Defeat Lazarus Group" },
  { id: "loot-hoarder", label: "Loot Hoarder", condition: "Collect 50 tools" },
  { id: "epic-collector", label: "Epic Collector", condition: "Find an Epic tool" },
];

function StatRow({ label, value }: Readonly<{ label: string; value: string | number }>) {
  return (
    <div className="flex items-center justify-between border-b border-[#1a3a4a]/50 py-1.5">
      <span className="text-xs text-[#aabbcc]">{label}</span>
      <span className="text-sm font-bold text-[#00f0ff]">{value}</span>
    </div>
  );
}

export function OperatorScreen({
  onClose,
  player,
  playerName,
  bits,
  defeatedBosses,
  playTime,
}: OperatorScreenProps) {
  const minutes = Math.floor(playTime / 60);

  return (
    <div
      data-testid="gr-operator-overlay"
      className="absolute inset-0 z-40 flex flex-col bg-[#0a0e1a]/95"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-[#00f0ff] px-3 py-2">
        <h2 className="gr-font-display text-base font-bold tracking-widest text-[#00f0ff]">
          OPERATOR
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="gr-font-mono rounded-sm border border-[#1a3a4a] bg-[#0f1b2d] px-2 py-1 text-xs text-[#aabbcc] active:brightness-150"
        >
          CLOSE
        </button>
      </header>

      <div className="gr-font-mono flex-1 overflow-y-auto p-3">
        <h3 className="mb-2 text-center text-lg font-bold tracking-wider text-[#00f0ff]">
          {playerName}
        </h3>

        <section className="mb-4">
          <h4 className="mb-1 text-xs font-bold tracking-wider text-[#ff6b00]">STATS</h4>
          <StatRow label="Level" value={player.level} />
          <StatRow label="XP" value={`${player.xp} / ${player.xpToNext}`} />
          <StatRow label="Integrity (HP)" value={`${player.integrity} / ${player.maxIntegrity}`} />
          <StatRow label="Compute (EN)" value={`${player.compute} / ${player.maxCompute}`} />
          <StatRow label="Bandwidth (SPD)" value={player.bandwidth} />
          <StatRow label="Firewall (DEF)" value={player.firewall} />
          <StatRow label="Bits" value={bits} />
          <StatRow label="Play Time" value={`${minutes}m`} />
        </section>

        <section className="mb-4">
          <h4 className="mb-1 text-xs font-bold tracking-wider text-[#ff6b00]">BOSSES DEFEATED</h4>
          {defeatedBosses.length === 0 ? (
            <p className="text-xs text-[#aabbcc]">None yet.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {defeatedBosses.map((id) => (
                <div key={id} className="rounded-sm border border-[#00ff41]/30 bg-[#0f1b2d] px-2.5 py-1.5 text-xs text-[#00ff41]">
                  {BOSS_NAMES[id] ?? id}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h4 className="mb-1 text-xs font-bold tracking-wider text-[#ff6b00]">BADGES</h4>
          <div className="flex flex-col gap-1">
            {BADGES.map((badge) => {
              const earned =
                (badge.id === "bank-buster" && defeatedBosses.includes("lazarus")) ||
                badge.id === "grid-runner";
              return (
                <div
                  key={badge.id}
                  className={`rounded-sm border bg-[#0f1b2d] px-2.5 py-1.5 ${
                    earned ? "border-[#ff6b00]/50" : "border-[#1a3a4a]"
                  }`}
                >
                  <span className={`text-xs font-bold ${earned ? "text-[#ff6b00]" : "text-[#4a5568]"}`}>
                    {earned ? badge.label : "???"}
                  </span>
                  <span className="ml-2 text-xs text-[#aabbcc]">{badge.condition}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <p className="gr-font-mono shrink-0 border-t border-[#1a3a4a] px-3 py-1.5 text-center text-xs text-[#aabbcc]">
        Press B to go back
      </p>
    </div>
  );
}
