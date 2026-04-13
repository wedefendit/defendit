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

import type { GamePreferences, GameScore, GamesState } from "./types";

const STORAGE_KEY = "dis-games-state";

const EMPTY_STATE: GamesState = {
  badges: [],
  scores: {},
  preferences: {},
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function cloneEmpty(): GamesState {
  return { badges: [], scores: {}, preferences: {} };
}

function sanitizePreferences(value: unknown): GamePreferences {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([gameId, prefs]) => [
      gameId,
      prefs && typeof prefs === "object"
        ? { ...(prefs as Record<string, unknown>) }
        : {},
    ]),
  );
}

export function getState(): GamesState {
  if (!isBrowser()) return cloneEmpty();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneEmpty();
    const parsed = JSON.parse(raw) as Partial<GamesState>;
    return {
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      scores: parsed.scores && typeof parsed.scores === "object" ? parsed.scores : {},
      preferences: sanitizePreferences(parsed.preferences),
    };
  } catch {
    return cloneEmpty();
  }
}

export function setState(state: GamesState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota or privacy mode — silently ignore. V1 is best-effort local only.
  }
}

export function clearState(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getScore(gameId: string): GameScore | undefined {
  return getState().scores[gameId];
}

export function setScore(score: GameScore): GamesState {
  const state = getState();
  const existing = state.scores[score.gameId];
  const bestScore = existing ? Math.max(existing.bestScore, score.score) : score.score;
  const next: GamesState = {
    ...state,
    scores: {
      ...state.scores,
      [score.gameId]: { ...score, bestScore },
    },
  };
  setState(next);
  return next;
}

export function clearScore(gameId: string): GamesState {
  const state = getState();
  if (!(gameId in state.scores)) return state;
  const { [gameId]: _removed, ...rest } = state.scores;
  void _removed;
  const next: GamesState = { ...state, scores: rest };
  setState(next);
  return next;
}

export function getBadges(): string[] {
  return getState().badges;
}

export function hasBadge(badgeId: string): boolean {
  return getState().badges.includes(badgeId);
}

export function addBadge(badgeId: string): GamesState {
  const state = getState();
  if (state.badges.includes(badgeId)) return state;
  const next: GamesState = { ...state, badges: [...state.badges, badgeId] };
  setState(next);
  return next;
}

export function clearBadges(): GamesState {
  const state = getState();
  const next: GamesState = { ...state, badges: [] };
  setState(next);
  return next;
}

export function getGamePreference<T = unknown>(gameId: string, key: string): T | undefined {
  const prefs = getState().preferences[gameId];
  if (!prefs) return undefined;
  return prefs[key] as T | undefined;
}

export function setGamePreference(gameId: string, key: string, value: unknown): GamesState {
  const state = getState();
  const next: GamesState = {
    ...state,
    preferences: {
      ...state.preferences,
      [gameId]: {
        ...(state.preferences[gameId] ?? {}),
        [key]: value,
      },
    },
  };
  setState(next);
  return next;
}

export function clearGamePreference(gameId: string, key: string): GamesState {
  const state = getState();
  const existing = state.preferences[gameId];
  if (!existing || !(key in existing)) return state;
  const { [key]: _removed, ...rest } = existing;
  void _removed;
  const nextPreferences = { ...state.preferences };
  if (Object.keys(rest).length === 0) delete nextPreferences[gameId];
  else nextPreferences[gameId] = rest;
  const next: GamesState = { ...state, preferences: nextPreferences };
  setState(next);
  return next;
}

export const STORAGE_KEY_NAME = STORAGE_KEY;
export { EMPTY_STATE };
