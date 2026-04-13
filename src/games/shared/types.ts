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

export type Difficulty = "easy" | "medium" | "hard";

export type BadgeTier = "bronze" | "silver" | "gold";

export type Badge = {
  id: string;
  gameId: string;
  name: string;
  description: string;
  icon?: string;
  tier: BadgeTier;
  condition: string;
};

export type GameScore = {
  gameId: string;
  difficulty: Difficulty;
  score: number;
  details: Record<string, number>;
  completedAt: string;
  bestScore: number;
};

export type GamePreferences = Record<string, Record<string, unknown>>;

export type GamesState = {
  badges: string[];
  scores: Record<string, GameScore>;
  preferences: GamePreferences;
};

export type Score = {
  value: number;
  details?: Record<string, number>;
};

export type GameState<T = unknown> = {
  gameId: string;
  difficulty: Difficulty;
  data: T;
};
