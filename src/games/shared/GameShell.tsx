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

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DifficultyPicker } from "./DifficultyPicker";
import { useLocalScores } from "./hooks/useLocalScores";
import type { Badge, Difficulty, GameScore } from "./types";

type GameShellContextValue = {
  gameId: string;
  difficulty: Difficulty;
  setDifficulty: (next: Difficulty) => void;
  resetCount: number;
  reset: () => void;
  recordScore: (score: Omit<GameScore, "gameId" | "bestScore" | "completedAt">) => void;
  awardBadge: (badge: Badge) => void;
  hasBadge: (badgeId: string) => boolean;
  bestScore: number | null;
};

const GameShellContext = createContext<GameShellContextValue | null>(null);

export function useGameShell(): GameShellContextValue {
  const ctx = useContext(GameShellContext);
  if (!ctx) {
    throw new Error("useGameShell must be used inside <GameShell>");
  }
  return ctx;
}

type GameShellProps = Readonly<{
  gameId: string;
  title: string;
  description?: ReactNode;
  howToPlay?: ReactNode;
  children: ReactNode;
  initialDifficulty?: Difficulty;
  /**
   * "full" (default) — renders the outer card, title, difficulty picker,
   * reset button, and how-to-play collapse. Use for pages that embed a game
   * in normal site content flow.
   *
   * "headless" — only provides context + children + the badge earned dialog.
   * The game owns its own chrome (header, difficulty picker, reset, help).
   * Use for full-viewport game layouts like The Digital House.
   */
  chrome?: "full" | "headless";
}>;

export function GameShell({
  gameId,
  title,
  description,
  howToPlay,
  children,
  initialDifficulty = "easy",
  chrome = "full",
}: GameShellProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [resetCount, setResetCount] = useState(0);
  const [howToOpen, setHowToOpen] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);

  const scores = useLocalScores();
  const existing = scores.getScore(gameId);
  const bestScore = existing ? existing.bestScore : null;

  const onDifficultyChange = useCallback((next: Difficulty) => {
    setDifficulty(next);
    setResetCount((c) => c + 1);
  }, []);

  const onReset = useCallback(() => {
    setResetCount((c) => c + 1);
  }, []);

  const recordScore = useCallback(
    (score: Omit<GameScore, "gameId" | "bestScore" | "completedAt">) => {
      scores.recordScore({
        ...score,
        gameId,
        bestScore: score.score,
        completedAt: new Date().toISOString(),
      });
    },
    [gameId, scores],
  );

  const awardBadge = useCallback(
    (badge: Badge) => {
      if (scores.hasBadge(badge.id)) return;
      scores.earnBadge(badge.id);
      setEarnedBadge(badge);
    },
    [scores],
  );

  const hasBadge = useCallback(
    (badgeId: string) => scores.hasBadge(badgeId),
    [scores],
  );

  const ctxValue = useMemo<GameShellContextValue>(
    () => ({
      gameId,
      difficulty,
      setDifficulty: onDifficultyChange,
      resetCount,
      reset: onReset,
      recordScore,
      awardBadge,
      hasBadge,
      bestScore,
    }),
    [
      gameId,
      difficulty,
      onDifficultyChange,
      resetCount,
      onReset,
      recordScore,
      awardBadge,
      hasBadge,
      bestScore,
    ],
  );

  useEffect(() => {
    if (!earnedBadge) return;
    const t = globalThis.setTimeout(() => setEarnedBadge(null), 6000);
    return () => globalThis.clearTimeout(t);
  }, [earnedBadge]);

  if (chrome === "headless") {
    return (
      <GameShellContext.Provider value={ctxValue}>
        {children}
        {earnedBadge && (
          <dialog
            open
            aria-label="Badge earned"
            className="fixed inset-x-3 top-20 bottom-auto z-80 mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-sky-300/70 bg-white/95 p-4 shadow-2xl ring-1 ring-sky-200/60 backdrop-blur-md min-[820px]:inset-x-0 min-[820px]:top-auto min-[820px]:bottom-6 dark:border-sky-700/60 dark:bg-slate-900/95 dark:ring-sky-800/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700 dark:bg-sky-900/60 dark:text-sky-200">
              ★
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                Badge earned
              </p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
                {earnedBadge.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                {earnedBadge.description}
              </p>
            </div>
            <button
              type="button"
              aria-label="Dismiss badge notification"
              onClick={() => setEarnedBadge(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ×
            </button>
          </dialog>
        )}
      </GameShellContext.Provider>
    );
  }

  return (
    <GameShellContext.Provider value={ctxValue}>
      <section
        aria-label={title}
        className="relative w-full max-w-6xl rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-lg ring-1 ring-slate-200/40 backdrop-blur-md sm:p-7 dark:border-sky-900/50 dark:bg-slate-900/60 dark:shadow-sky-900/20 dark:ring-sky-900/30"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_60%)]"
        />

        <header className="relative flex flex-col gap-4 border-b border-slate-200/70 pb-4 sm:flex-row sm:items-start sm:justify-between dark:border-sky-900/40">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
              {title}
            </h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                {description}
              </p>
            )}
            {bestScore !== null && (
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
                Best score: {bestScore}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DifficultyPicker value={difficulty} onChange={onDifficultyChange} />
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-slate-300/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-sky-900/50 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800/80"
            >
              Reset
            </button>
          </div>
        </header>

        <div className="relative mt-5">{children}</div>

        {howToPlay && (
          <div className="relative mt-6 border-t border-slate-200/70 pt-4 dark:border-sky-900/40">
            <button
              type="button"
              aria-expanded={howToOpen}
              onClick={() => setHowToOpen((v) => !v)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              <span>How to play</span>
              <span aria-hidden className="text-slate-400">
                {howToOpen ? "−" : "+"}
              </span>
            </button>
            {howToOpen && (
              <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {howToPlay}
              </div>
            )}
          </div>
        )}
      </section>

      {earnedBadge && (
        <dialog
          open
          aria-label="Badge earned"
          className="fixed inset-x-0 bottom-6 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-2xl border border-sky-300/70 bg-white/95 p-4 shadow-2xl ring-1 ring-sky-200/60 backdrop-blur-md dark:border-sky-700/60 dark:bg-slate-900/95 dark:ring-sky-800/50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700 dark:bg-sky-900/60 dark:text-sky-200">
            ★
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
              Badge earned
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-50">
              {earnedBadge.name}
            </p>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
              {earnedBadge.description}
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss badge notification"
            onClick={() => setEarnedBadge(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ×
          </button>
        </dialog>
      )}
    </GameShellContext.Provider>
  );
}
