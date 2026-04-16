/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { PlayerState } from "../../engine/types";

type PlayerHUDProps = Readonly<{
  player: PlayerState;
  playerName: string;
  bits: number;
  zoneName: string;
}>;

function StatBar({
  current,
  max,
  color,
  label,
}: Readonly<{
  current: number;
  max: number;
  color: string;
  label: string;
}>) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="flex items-center gap-1.5">
      <span className={`gr-font-mono min-w-[20px] text-xs ${color}`}>{label}</span>
      <div
        className="relative h-1.5 flex-1 overflow-hidden rounded-sm border border-[#1a3a4a] bg-[#0d1520]"
        role="meter"
        aria-label={`${label} ${current} of ${max}`}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`h-full transition-[width] duration-300 ease-out ${color === "text-[#00f0ff]" ? "bg-[#00f0ff]" : "bg-[#ff00de]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="gr-font-mono min-w-[36px] text-right text-xs tabular-nums text-[#aabbcc]">
        {current}/{max}
      </span>
    </div>
  );
}

export function PlayerHUD({ player, playerName, bits, zoneName }: PlayerHUDProps) {
  const xpPct = player.xpToNext > 0
    ? Math.min(100, (player.xp / player.xpToNext) * 100)
    : 100;

  return (
    <aside
      data-testid="gr-player-hud"
      aria-label="Player status"
      className="gr-font-mono flex shrink-0 flex-col gap-0.5 border-b border-[#1a3a4a] bg-[#080c16] px-3 py-1.5"
    >
      {/* Top row: name, level, bits */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-wider text-[#00f0ff]">
          {playerName} <span className="text-[#aabbcc]">Lv.{player.level}</span>
        </span>
        <span className="text-[11px] text-[#ff6b00]">
          {bits} Bits
        </span>
      </div>

      {/* XP bar */}
      <div className="flex items-center gap-1.5">
        <span className="min-w-[20px] text-xs text-[#aabbcc]">XP</span>
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-sm border border-[#1a3a4a] bg-[#0d1520]">
          <div
            className="h-full bg-[#ff6b00] transition-[width] duration-300 ease-out"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <span className="min-w-[36px] text-right text-xs tabular-nums text-[#aabbcc]">
          {player.xp}/{player.xpToNext}
        </span>
      </div>

      {/* HP + EN */}
      <StatBar current={player.integrity} max={player.maxIntegrity} color="text-[#00f0ff]" label="HP" />
      <StatBar current={player.compute} max={player.maxCompute} color="text-[#ff00de]" label="EN" />
    </aside>
  );
}
