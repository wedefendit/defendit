/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.

This software and its source code are the proprietary property of
Defend I.T. Solutions LLC and are protected by United States and
international copyright laws. Unauthorized reproduction, distribution,
modification, display, or use of this software, in whole or in part, without the
prior written permission of Defend I.T. Solutions LLC, is strictly prohibited.

This software is provided for use only by authorized employees, contractors, or
licensees of Defend I.T. Solutions LLC and may not be disclosed to any third
party without express written consent.
*/

import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import type { AppliedCombo } from "../engine/scoring";

// ---- Theme thresholds ----
//
// Healthy: site accent — sky-400 → sky-600 gradient on the ring stroke,
// sky-400 on the value text. Cautious / critical fall back to amber + rose
// solid colors. The ring track stays at slate-800 to match the site's dark
// card backgrounds.

const SKY_LIGHT = "#38bdf8"; // sky-400
const SKY_DARK = "#0284c7"; // sky-600
const AMBER = "#f59e0b";
const ROSE = "#ef4444";
const TRACK = "#1e293b"; // slate-800

type ScoreTier = "healthy" | "cautious" | "critical";

function tierFor(value: number): ScoreTier {
  if (value >= 40) return "healthy";
  if (value >= 25) return "cautious";
  return "critical";
}

function tierTextColor(tier: ScoreTier): string {
  switch (tier) {
    case "healthy":
      return SKY_LIGHT;
    case "cautious":
      return AMBER;
    case "critical":
      return ROSE;
  }
}

// ---- ScoreRingBar ----

type ScoreRingBarProps = Readonly<{
  privacy: number;
  blastRadius: number;
  recovery: number;
  overall: number;
  placedCount: number;
  totalDevices: number;
  mobile: boolean;
  /** Compact mode — smaller rings + tighter padding for sidebar / mobile bar use. */
  compact?: boolean;
  /** Active combo penalties (count) — shows an ⚠ badge that opens a popover. */
  combos?: ReadonlyArray<AppliedCombo>;
  /** Map of combo id → human-readable tip. */
  comboTips?: Record<string, string>;
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
  combos = [],
  comboTips = {},
}: ScoreRingBarProps) {
  const ringSize = compact ? (mobile ? 34 : 40) : mobile ? 58 : 70;
  const overallFontSize = compact ? (mobile ? 18 : 34) : mobile ? 34 : 44;
  const tinyMobileCompact = compact && mobile;
  const overallAnim = useAnimatedNumber(overall);
  const overallTier = tierFor(overallAnim);
  const overallColor = tierTextColor(overallTier);

  const [pulseKey, setPulseKey] = useState(0);
  const prevTotalRef = useRef(overall);
  useEffect(() => {
    if (prevTotalRef.current !== overall) {
      prevTotalRef.current = overall;
      setPulseKey((k) => k + 1);
    }
  }, [overall]);

  const progressPct = Math.round((placedCount / totalDevices) * 100);

  const [comboOpen, setComboOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!comboOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(e.target as Node)) setComboOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setComboOpen(false);
    };
    globalThis.addEventListener("mousedown", onDown);
    globalThis.addEventListener("keydown", onKey);
    return () => {
      globalThis.removeEventListener("mousedown", onDown);
      globalThis.removeEventListener("keydown", onKey);
    };
  }, [comboOpen]);
  // Close popover automatically if all combos clear.
  useEffect(() => {
    if (combos.length === 0) setComboOpen(false);
  }, [combos.length]);

  return (
    <div
      data-testid="dh-score-hud"
      key={pulseKey}
      style={{ animation: "dh-borderPulse 0.9s ease-out" }}
      className="relative overflow-visible rounded-2xl border border-slate-200/80 bg-white/72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/58 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_62%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5"
    >
      <div
        className={
          compact
            ? mobile
              ? "px-2.5 py-2"
              : "px-4 py-3"
            : "px-4 py-3 sm:px-5 sm:py-4"
        }
      >
        <div className={compact && !mobile ? "mb-3 flex items-baseline justify-between" : "mb-2 flex items-baseline justify-between"}>
          <span className={compact && !mobile ? "text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400" : "text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"}>
            House Meters
          </span>
          <span className={compact && !mobile ? "text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" : "text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"}>
            {placedCount}/{totalDevices} placed
          </span>
        </div>

        <div
          className={
            compact
              ? mobile
                ? "grid grid-cols-1 gap-1.5 min-[360px]:grid-cols-[minmax(0,1fr)_58px] min-[360px]:items-center"
                : "grid min-w-0 grid-cols-[minmax(0,1fr)_92px] items-center gap-4"
              : "flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          }
        >
          <div
            className={
              compact && mobile
                ? "grid grid-cols-3 justify-items-center gap-1 min-[360px]:flex min-[360px]:items-center min-[360px]:gap-1.5"
                : compact
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
              compact && !mobile
                ? "flex w-[92px] shrink-0 flex-col items-end text-right"
                : tinyMobileCompact
                  ? "flex min-w-0 items-end justify-end text-right min-[360px]:w-[58px] min-[360px]:shrink-0 min-[360px]:flex-col"
                  : "flex shrink-0 flex-col items-center"
            }
          >
            <div
              style={{
                fontSize: overallFontSize,
                fontWeight: 900,
                lineHeight: 1,
                color: overallColor,
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                letterSpacing: "-0.03em",
                transition: "color 0.4s ease",
              }}
            >
              {overallAnim}
            </div>
            <div className={tinyMobileCompact ? "mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500 min-[360px]:mt-1 min-[360px]:text-[10px] min-[360px]:tracking-[0.18em] dark:text-slate-400" : "mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400"}>
              Overall
            </div>
          </div>
        </div>

        {/* Progress bar — always visible, slightly thinner in compact mode */}
        {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role, sonarjs/prefer-element-type */}
        <div
          className={[
            "w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/80",
            compact && mobile ? "mt-2 h-1" : compact ? "mt-3 h-1" : "mt-3 h-1.5",
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
              width: `${progressPct}%`,
              transition: "width 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        </div>
      </div>

      {/* Combo warning badge + popover (top-right corner).
          Note: we deliberately use <div role="dialog">, not <dialog>. Native
          <dialog open> in Chrome/Safari has user-agent styles (position:
          fixed; margin: auto) that fight our absolute positioning and
          send the popover off-screen. */}
      {combos.length > 0 && (
        <div ref={popoverRef} className="absolute right-2 top-2 z-10">
          <button
            type="button"
            aria-label={`${combos.length} combo penalty${combos.length === 1 ? "" : "s"} active`}
            aria-expanded={comboOpen}
            onClick={() => setComboOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full border border-rose-400/50 bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-700 shadow-[0_0_12px_rgba(239,68,68,0.3)] backdrop-blur-sm transition-colors hover:bg-rose-500/25 dark:border-rose-400/40 dark:bg-rose-500/15 dark:text-rose-200"
          >
            <span aria-hidden className="animate-pulse">
              ⚠
            </span>
            {combos.length}
          </button>
          {comboOpen && (
            // eslint-disable-next-line jsx-a11y/prefer-tag-over-role, sonarjs/prefer-element-type
            <div
              role="dialog"
              aria-label="Active combo penalties"
              className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-24px)] overflow-hidden rounded-xl border border-rose-300/60 bg-white/96 p-3 shadow-[0_16px_40px_rgba(239,68,68,0.2)] backdrop-blur-md dark:border-rose-400/30 dark:bg-slate-900/96 dark:shadow-[0_20px_46px_rgba(239,68,68,0.25)]"
            >
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-200">
                <AlertTriangle size={11} />
                Pressure building
              </div>
              <ul className="space-y-1.5 text-[12px] leading-snug text-rose-900 dark:text-rose-100">
                {combos.map((c) => (
                  <li key={c.id} className="flex items-start gap-1.5">
                    <span
                      aria-hidden
                      className="mt-0.5 text-rose-500 dark:text-rose-300"
                    >
                      •
                    </span>
                    <span>
                      {comboTips[c.id] ?? c.label}
                      {c.count ? (
                        <span className="ml-1 text-rose-600 dark:text-rose-300">
                          (×{c.count})
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---- Ring ----

type RingProps = Readonly<{
  value: number;
  label: string;
  size: number;
}>;

function Ring({ value, label, size }: RingProps) {
  const animated = useAnimatedNumber(value);
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (animated / 100) * circumference;

  const tier = tierFor(animated);
  const gradientId = useId();
  const stroke =
    tier === "healthy"
      ? `url(#${gradientId})`
      : tier === "cautious"
        ? AMBER
        : ROSE;
  const textColor = tierTextColor(tier);

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        className="text-slate-200 dark:text-slate-800"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={SKY_LIGHT} />
            <stop offset="100%" stopColor={SKY_DARK} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 0.5s ease, stroke 0.4s ease",
          }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: "center",
            fontSize: size * 0.3,
            fontWeight: 800,
            fill: textColor,
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, monospace",
            transition: "fill 0.4s ease",
          }}
        >
          {animated}
        </text>
      </svg>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">
        {label}
      </div>
    </div>
  );
}
