/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { useEffect, useRef } from "react";
import type { BattleState, PlayerState, ToolInstance } from "../../engine/types";

type BattleScreenProps = Readonly<{
  battle: BattleState;
  player: PlayerState;
  playerName: string;
  equippedTools: (ToolInstance | null)[];
  onUseTool: (tool: ToolInstance) => void;
  onRun: () => void;
  onBattleEnd: () => void;
}>;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

function HpBar({
  current,
  max,
  color,
  label,
}: {
  current: number;
  max: number;
  color: string;
  label: string;
}) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <span
        className="shrink-0 text-xs"
        style={{ color, fontFamily: "'Share Tech Mono', monospace", minWidth: 20 }}
      >
        {label}
      </span>
      <div
        className="relative flex-1 overflow-hidden rounded-sm"
        role="meter"
        aria-label={`${label} ${current} of ${max}`}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{ height: 10, backgroundColor: "#0d1520", border: "1px solid #1a3a4a" }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`,
            transition: "width 0.3s ease-out",
          }}
        />
      </div>
      <span
        className="shrink-0 text-xs tabular-nums"
        style={{ color: "#8899aa", fontFamily: "'Share Tech Mono', monospace", minWidth: 50, textAlign: "right" }}
      >
        {current}/{max}
      </span>
    </div>
  );
}

function BattleLog({ log }: { log: string[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log.length]);

  return (
    <div
      data-testid="gr-battle-log"
      className="flex-1 min-h-0 overflow-y-auto rounded-sm p-2"
      style={{
        backgroundColor: "#060a12",
        border: "1px solid #1a3a4a",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "clamp(9px, 1.5vw, 12px)",
        color: "#6688aa",
      }}
    >
      {log.map((line, i) => (
        <p key={i} className="py-0.5">{line}</p>
      ))}
      <div ref={endRef} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main screen                                                       */
/* ------------------------------------------------------------------ */

export function BattleScreen({
  battle,
  player,
  playerName,
  equippedTools,
  onUseTool,
  onRun,
  onBattleEnd,
}: BattleScreenProps) {
  const isOver = battle.phase === "won" || battle.phase === "lost";
  const isPlayerTurn = battle.phase === "player_turn";

  return (
    <section
      data-testid="gr-battle"
      aria-label="Battle"
      className="flex flex-1 flex-col gap-2 overflow-hidden p-2 sm:p-3"
      style={{ backgroundColor: "#0a0e1a" }}
    >
      {/* Arena: player left, enemy right */}
      <div className="flex items-center justify-around py-2 sm:py-4">
        {/* Player avatar */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="flex items-center justify-center rounded-sm"
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#00f0ff",
              boxShadow: "0 0 12px #00f0ff",
              color: "#0a0e1a",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            OP
          </div>
          <span
            className="text-xs"
            style={{ color: "#00f0ff", fontFamily: "'Share Tech Mono', monospace" }}
          >
            {playerName}
          </span>
        </div>

        <span
          className="text-lg font-bold"
          style={{ color: "#1a3a4a", fontFamily: "'Orbitron', sans-serif" }}
        >
          VS
        </span>

        {/* Enemy avatar */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="flex items-center justify-center rounded-sm"
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#ff003c",
              boxShadow: "0 0 12px #ff003c44",
              color: "#0a0e1a",
              fontWeight: "bold",
              fontSize: 10,
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            {battle.enemy.def.name.charAt(0).toUpperCase()}
          </div>
          <span
            className="text-xs"
            style={{ color: "#ff003c", fontFamily: "'Share Tech Mono', monospace" }}
          >
            {battle.enemy.def.name}
          </span>
        </div>
      </div>

      {/* Status bars */}
      <div className="flex flex-col gap-1">
        <HpBar current={player.integrity} max={player.maxIntegrity} color="#00f0ff" label="HP" />
        <HpBar current={player.compute} max={player.maxCompute} color="#ff00de" label="EN" />
        <HpBar current={battle.enemy.hp} max={battle.enemy.maxHp} color="#ff003c" label="THREAT" />
      </div>

      {/* Battle log */}
      <BattleLog log={battle.log} />

      {/* Actions */}
      {!isOver && (
        <nav
          data-testid="gr-battle-actions"
          aria-label="Battle actions"
          className="flex flex-wrap gap-1.5 sm:gap-2"
        >
          {equippedTools.map((tool, i) =>
            tool ? (
              <button
                key={tool.id}
                type="button"
                data-testid={`gr-battle-tool-${i}`}
                disabled={!isPlayerTurn || player.compute < tool.energyCost}
                onClick={() => onUseTool(tool)}
                className="flex-1 min-w-0 rounded-sm px-2 py-2.5 text-xs font-bold uppercase tracking-wider transition-opacity disabled:opacity-30"
                style={{
                  backgroundColor: "#0f1b2d",
                  border: "1px solid #00f0ff",
                  color: "#00f0ff",
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                <span className="block truncate">{tool.baseToolId}</span>
                <span className="block text-[9px] opacity-50">{tool.energyCost} EN</span>
              </button>
            ) : null,
          )}
          <button
            type="button"
            data-testid="gr-battle-run"
            disabled={!isPlayerTurn}
            onClick={onRun}
            className="rounded-sm px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-opacity disabled:opacity-30"
            style={{
              backgroundColor: "#0f1b2d",
              border: "1px solid #ff6b00",
              color: "#ff6b00",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            RUN
          </button>
        </nav>
      )}

      {/* Win / Lose result */}
      {isOver && (
        <div
          data-testid="gr-battle-result"
          className="flex flex-col items-center gap-2 rounded-sm p-3"
          style={{
            backgroundColor: "#0f1b2d",
            border: `2px solid ${battle.phase === "won" ? "#00ff41" : "#ff003c"}`,
          }}
        >
          <p
            className="text-lg font-bold tracking-widest"
            style={{
              color: battle.phase === "won" ? "#00ff41" : "#ff003c",
              fontFamily: "'Orbitron', sans-serif",
            }}
          >
            {battle.phase === "won" ? "THREAT NEUTRALIZED" : "SYSTEM COMPROMISED"}
          </p>
          {battle.phase === "won" && (
            <p
              className="text-xs"
              style={{ color: "#00f0ff", fontFamily: "'Share Tech Mono', monospace" }}
            >
              +{battle.xpEarned} XP | +{battle.bitsEarned} Bits
            </p>
          )}
          <button
            type="button"
            data-testid="gr-battle-continue"
            onClick={onBattleEnd}
            className="mt-1 rounded-sm px-6 py-2.5 text-sm font-bold uppercase tracking-widest"
            style={{
              backgroundColor: "#0f1b2d",
              border: "2px solid #00f0ff",
              color: "#00f0ff",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            CONTINUE
          </button>
        </div>
      )}
    </section>
  );
}
