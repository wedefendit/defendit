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

import { useCallback, useEffect, useState } from "react";
import * as storage from "../storage";
import type { GameScore, GamesState } from "../types";

export function useLocalScores() {
  const [state, setLocalState] = useState<GamesState>(() => storage.getState());

  useEffect(() => {
    setLocalState(storage.getState());
  }, []);

  const recordScore = useCallback((score: GameScore) => {
    const next = storage.setScore(score);
    setLocalState(next);
    return next;
  }, []);

  const earnBadge = useCallback((badgeId: string) => {
    const next = storage.addBadge(badgeId);
    setLocalState(next);
    return next;
  }, []);

  const clearGame = useCallback((gameId: string) => {
    const next = storage.clearScore(gameId);
    setLocalState(next);
    return next;
  }, []);

  const clearAll = useCallback(() => {
    storage.clearState();
    setLocalState({ badges: [], scores: {}, preferences: {} });
  }, []);

  const hasBadge = useCallback(
    (badgeId: string) => state.badges.includes(badgeId),
    [state.badges],
  );

  const getScore = useCallback(
    (gameId: string): GameScore | undefined => state.scores[gameId],
    [state.scores],
  );

  return {
    state,
    recordScore,
    earnBadge,
    clearGame,
    clearAll,
    hasBadge,
    getScore,
  };
}
