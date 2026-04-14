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

import type { ReactNode } from "react";

export type GameToastProps = Readonly<{
  icon: ReactNode;
  label: string;
  hint: string;
  accent: "sky" | "amber";
  mobile: boolean;
  bottomOffset: number;
}>;

export function GameToast({
  icon,
  label,
  hint,
  accent,
  mobile,
  bottomOffset,
}: GameToastProps) {
  const accentClasses =
    accent === "amber"
      ? "border-amber-400/50 bg-white/96 text-amber-800 shadow-[0_20px_50px_rgba(251,191,36,0.18)] ring-amber-400/20 dark:bg-slate-900/90 dark:text-amber-100 dark:shadow-[0_20px_50px_rgba(251,191,36,0.3)] dark:ring-amber-400/25"
      : "border-sky-400/50 bg-white/96 text-sky-800 shadow-[0_20px_50px_rgba(56,189,248,0.18)] ring-sky-400/20 dark:bg-slate-900/90 dark:text-sky-100 dark:shadow-[0_20px_50px_rgba(56,189,248,0.3)] dark:ring-sky-400/25";
  return (
    <div
      aria-live="polite"
      style={{
        animation: "dh-toastIn 2.2s cubic-bezier(0.22,1,0.36,1)",
        bottom: mobile
          ? "calc(" + bottomOffset + "px + env(safe-area-inset-bottom))"
          : undefined,
      }}
      className={[
        "pointer-events-none fixed left-1/2 z-80 max-w-[calc(100vw-24px)] -translate-x-1/2 border backdrop-blur-md ring-1",
        mobile
          ? "rounded-xl px-2.5 py-1.5"
          : "rounded-full px-5 py-2.5 min-[820px]:bottom-auto min-[820px]:top-24",
        accentClasses,
      ].join(" ")}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={
            accent === "amber"
              ? "text-amber-600 dark:text-amber-300"
              : "text-sky-600 dark:text-sky-300"
          }
        >
          {icon}
        </span>
        <span
          className={
            mobile
              ? "text-xs font-bold tracking-wide"
              : "text-sm font-bold tracking-wide"
          }
        >
          {label}
        </span>
        <span
          className={
            mobile
              ? "text-[10px] font-medium opacity-80"
              : "text-xs font-medium opacity-80"
          }
        >
          {hint}
        </span>
      </div>
    </div>
  );
}

// ---- useCountUp hook — eased rAF counter used by the end summary ----
