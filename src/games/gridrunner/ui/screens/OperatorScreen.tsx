/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { PlayerState } from "../../engine/types";
import { BADGES, BOSSES } from "../../data/bosses";
import { OverlayShell } from "../shared/OverlayShell";

type OperatorScreenProps = Readonly<{
  onClose: () => void;
  player: PlayerState;
  playerName: string;
  bits: number;
  defeatedBosses: string[];
  playTime: number;
}>;

function StatRow({ label, value }: Readonly<{ label: string; value: string | number }>) {
  return (
    <div className="flex items-center justify-between border-b border-[#1a3a4a]/50 py-1.5">
      <span className="text-xs text-[#aabbcc]">{label}</span>
      <span className="text-sm font-bold text-[#00f0ff]">{value}</span>
    </div>
  );
}

export function OperatorScreen({
  onClose, player, playerName, bits, defeatedBosses, playTime,
}: OperatorScreenProps) {
  const minutes = Math.floor(playTime / 60);

  return (
    <OverlayShell testId="gr-operator-overlay" title="OPERATOR" onClose={onClose}>
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
                {BOSSES[id]?.name ?? id}
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
                className={`rounded-sm border bg-[#0f1b2d] px-2.5 py-1.5 ${earned ? "border-[#ff6b00]/50" : "border-[#1a3a4a]"}`}
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
    </OverlayShell>
  );
}
