import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import type { OpenRiskItem } from "../summary";

const SKY_LIGHT = "#38bdf8";
const SKY_DARK = "#0284c7";
const AMBER = "#f59e0b";
const ROSE = "#ef4444";

type ScoreTier = "healthy" | "cautious" | "critical";
function tierFor(v: number): ScoreTier {
  return v >= 40 ? "healthy" : v >= 25 ? "cautious" : "critical";
}
function tierTextColor(t: ScoreTier) {
  return t === "healthy" ? SKY_LIGHT : t === "cautious" ? AMBER : ROSE;
}
function tierBarGrad(t: ScoreTier) {
  return t === "healthy"
    ? "from-sky-400 to-sky-600"
    : t === "cautious"
      ? "from-amber-400 to-amber-500"
      : "from-rose-400 to-rose-500";
}

type ScoreRingBarProps = Readonly<{
  privacy: number;
  blastRadius: number;
  recovery: number;
  overall: number;
  placedCount: number;
  totalDevices: number;
  mobile: boolean;
  compact?: boolean;
  riskItems?: ReadonlyArray<OpenRiskItem>;
}>;

export function ScoreRingBar({
  privacy,
  blastRadius,
  recovery,
  overall,
  placedCount,
  totalDevices,
  mobile,
  compact = false,
  riskItems = [],
}: ScoreRingBarProps) {
  const overallAnim = useAnimatedNumber(overall);
  const overallTier = tierFor(overallAnim);
  const overallColor = tierTextColor(overallTier);
  const [pulseKey, setPulseKey] = useState(0);
  const prevRef = useRef(overall);
  useEffect(() => {
    if (prevRef.current !== overall) {
      prevRef.current = overall;
      setPulseKey((k) => k + 1);
    }
  }, [overall]);
  const pct = Math.round((placedCount / totalDevices) * 100);
  const [riskOpen, setRiskOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!riskOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!popRef.current?.contains(e.target as Node)) setRiskOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setRiskOpen(false);
    };
    globalThis.addEventListener("mousedown", onDown);
    globalThis.addEventListener("keydown", onKey);
    return () => {
      globalThis.removeEventListener("mousedown", onDown);
      globalThis.removeEventListener("keydown", onKey);
    };
  }, [riskOpen]);
  useEffect(() => {
    if (riskItems.length === 0) setRiskOpen(false);
  }, [riskItems.length]);

  // ======== MOBILE COMPACT: horizontal bar strip ========
  if (compact && mobile) {
    return (
      <div
        data-testid="dh-score-hud"
        key={pulseKey}
        style={{ animation: "dh-borderPulse 0.9s ease-out" }}
        className="relative overflow-visible rounded-xl border border-slate-200/80 bg-white/72 px-2.5 py-1.5 shadow-[0_4px_12px_rgba(15,23,42,0.06)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:shadow-[0_8px_20px_rgba(2,6,23,0.25)] dark:ring-white/5"
      >
        <div className="flex items-center gap-2">
          <div
            className="shrink-0 font-mono leading-none"
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: overallColor,
              letterSpacing: "-0.03em",
              transition: "color 0.4s ease",
            }}
          >
            {overallAnim}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <MiniBar label="P" value={privacy} />
            <MiniBar label="B" value={blastRadius} />
            <MiniBar label="R" value={recovery} />
          </div>
          <div className="shrink-0 text-[10px] font-bold tabular-nums text-slate-500 dark:text-slate-400">
            {placedCount}/{totalDevices}
          </div>
          {riskItems.length > 0 && (
            <RiskBadge
              count={riskItems.length}
              items={riskItems}
              open={riskOpen}
              onToggle={() => setRiskOpen((v) => !v)}
              popRef={popRef}
            />
          )}
        </div>
        <div
          className="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80"
          role="progressbar"
          aria-valuenow={placedCount}
          aria-valuemin={0}
          aria-valuemax={totalDevices}
          aria-label="Devices placed"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-sky-400 to-sky-600"
            style={{
              width: `${pct}%`,
              transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
      </div>
    );
  }

  // ======== DESKTOP / SIDEBAR: full rings ========
  const ringSize = compact ? 40 : 70;
  const overallFont = compact ? 34 : 44;
  return (
    <div
      data-testid="dh-score-hud"
      key={pulseKey}
      style={{ animation: "dh-borderPulse 0.9s ease-out" }}
      className="relative overflow-visible rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_62%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-0"
    >
      <div className={compact ? "px-4 py-3" : "px-4 py-3 sm:px-5 sm:py-4"}>
        <div
          className={
            compact
              ? "mb-3 flex items-center justify-between gap-2"
              : "mb-2 flex items-center justify-between gap-2"
          }
        >
          <span
            className={
              compact
                ? "text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
                : "text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"
            }
          >
            House Meters
          </span>
          <div className="flex items-center gap-2">
            <span
              className={
                compact
                  ? "text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  : "text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              }
            >
              {placedCount}/{totalDevices} placed
            </span>
            {riskItems.length > 0 && (
              <RiskBadge
                count={riskItems.length}
                items={riskItems}
                open={riskOpen}
                onToggle={() => setRiskOpen((v) => !v)}
                popRef={popRef}
              />
            )}
          </div>
        </div>
        <div
          className={
            compact
              ? "grid min-w-0 grid-cols-[minmax(0,1fr)_92px] items-center gap-4"
              : "flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          }
        >
          <div
            className={
              compact
                ? "flex min-w-0 items-center justify-start gap-3"
                : "flex min-w-0 items-center gap-3"
            }
          >
            <Ring value={privacy} label="PRIVACY" size={ringSize} />
            <Ring value={blastRadius} label="BLAST" size={ringSize} />
            <Ring value={recovery} label="RECOVERY" size={ringSize} />
          </div>
          {!compact && (
            <div className="hidden h-11 w-px bg-slate-200/70 sm:block dark:bg-slate-700/60" />
          )}
          <div
            className={
              compact
                ? "flex w-[92px] shrink-0 flex-col items-end text-right"
                : "flex shrink-0 flex-col items-center"
            }
          >
            <div
              style={{
                fontSize: overallFont,
                fontWeight: 900,
                lineHeight: 1,
                color: overallColor,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                letterSpacing: "-0.03em",
                transition: "color 0.4s ease",
              }}
            >
              {overallAnim}
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Overall
            </div>
          </div>
        </div>
        <div
          className={[
            "w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80",
            compact ? "mt-3 h-1" : "mt-3 h-1.5",
          ].join(" ")}
          role="progressbar"
          aria-valuenow={placedCount}
          aria-valuemin={0}
          aria-valuemax={totalDevices}
          aria-label="Devices placed"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-sky-400 to-sky-600"
            style={{
              width: `${pct}%`,
              transition: "width 0.45s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MiniBar({ label, value }: Readonly<{ label: string; value: number }>) {
  const a = useAnimatedNumber(value);
  const t = tierFor(a);
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 text-[7px] font-bold uppercase leading-none text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80">
        <div
          className={`h-full rounded-full bg-linear-to-r ${tierBarGrad(t)}`}
          style={{ width: `${a}%`, transition: "width 0.5s ease" }}
        />
      </div>
    </div>
  );
}

function RiskBadge({
  count,
  items,
  open,
  onToggle,
  popRef,
  className,
}: Readonly<{
  count: number;
  items: ReadonlyArray<OpenRiskItem>;
  open: boolean;
  onToggle: () => void;
  popRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}>) {
  return (
    <div ref={popRef} className={className || "relative z-10"}>
      <button
        type="button"
        aria-label={`${count} open risk${count === 1 ? "" : "s"} active`}
        aria-expanded={open}
        onClick={onToggle}
        className="inline-flex items-center gap-1 rounded-full border border-rose-400/50 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-700 shadow-[0_0_12px_rgba(239,68,68,0.3)] backdrop-blur-sm transition-colors hover:bg-rose-500/25 dark:border-rose-400/40 dark:bg-rose-500/15 dark:text-rose-200"
      >
        <AlertTriangle size={10} className="animate-pulse" />
        {count}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Open risk findings"
          className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-rose-300/60 bg-white/96 p-3 shadow-[0_16px_40px_rgba(239,68,68,0.2)] backdrop-blur-md dark:border-rose-400/30 dark:bg-slate-900/96 dark:shadow-[0_20px_46px_rgba(239,68,68,0.25)]"
        >
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-200">
            <AlertTriangle size={11} />
            Open risks
          </div>
          <ul className="space-y-1.5 text-[12px] leading-snug text-rose-900 dark:text-rose-100">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-1.5">
                <span
                  aria-hidden
                  className="mt-0.5 text-rose-500 dark:text-rose-300"
                >
                  •
                </span>
                <span>
                  {item.label}
                  {item.count ? (
                    <span className="ml-1 text-rose-600 dark:text-rose-300">
                      (×{item.count})
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Ring({
  value,
  label,
  size,
}: Readonly<{
  value: number;
  label: string;
  size: number;
}>) {
  const a = useAnimatedNumber(value);
  const sw = 5,
    r = (size - sw) / 2,
    c = 2 * Math.PI * r,
    dash = (a / 100) * c;
  const t = tierFor(a);
  const gid = useId();
  const stroke =
    t === "healthy" ? `url(#${gid})` : t === "cautious" ? AMBER : ROSE;
  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        className="text-slate-200 dark:text-slate-800"
      >
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={SKY_LIGHT} />
            <stop offset="100%" stopColor={SKY_DARK} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={sw}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease, stroke 0.4s ease" }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dy="0.35em"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: "center",
            fontSize: size * 0.3,
            fontWeight: 800,
            fill: tierTextColor(t),
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            transition: "fill 0.4s ease",
          }}
        >
          {a}
        </text>
      </svg>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
        {label}
      </div>
    </div>
  );
}
