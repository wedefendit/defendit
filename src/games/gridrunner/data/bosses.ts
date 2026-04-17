/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { ToolType } from "../engine/types";

export type BossEntry = Readonly<{
  id: string;
  name: string;
  nation: string;
  sector: string;
  weakness: ToolType;
  background: string;
  operations: string;
  badgeId: string;
}>;

export type BadgeTier = "bronze" | "silver" | "gold";

export type BadgeDef = Readonly<{
  id: string;
  label: string;
  condition: string;
  tier: BadgeTier;
}>;

export const BOSSES: Record<string, BossEntry> = {
  lazarus: {
    id: "lazarus",
    name: "Lazarus Group",
    nation: "North Korea",
    sector: "Financial",
    weakness: "defense",
    background:
      "North Korea's state-sponsored theft operation. The regime treats cybercrime as revenue, running coordinated campaigns against banks, crypto exchanges, and payment networks to fund sanctioned activities.",
    operations:
      "The 2016 Bangladesh Bank heist drained $81 million via fraudulent SWIFT transfers. The 2017 WannaCry ransomware worm crippled hospitals and businesses worldwide. Billions stolen from cryptocurrency platforms since.",
    badgeId: "bank-buster",
  },
};

export const BADGES: readonly BadgeDef[] = [
  {
    id: "grid-runner",
    label: "Grid Runner",
    condition: "Complete the tutorial",
    tier: "bronze",
  },
  {
    id: "bank-buster",
    label: "Bank Buster",
    condition: "Defeat Lazarus Group",
    tier: "bronze",
  },
  {
    id: "loot-hoarder",
    label: "Loot Hoarder",
    condition: "Collect 50 tools",
    tier: "bronze",
  },
  {
    id: "epic-collector",
    label: "Epic Collector",
    condition: "Find an Epic tool",
    tier: "silver",
  },
];
