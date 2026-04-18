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
  "trader-traitor": {
    id: "trader-traitor",
    name: "TraderTraitor",
    nation: "North Korea",
    sector: "Financial / Cryptocurrency",
    weakness: "recon",
    background:
      "A Lazarus Group sub-cluster identified by US CISA, FBI, and Treasury as TraderTraitor -- focused on cryptocurrency theft and laundering. The DPRK treats stolen crypto as sovereign revenue and uses the proceeds to sustain activities under international sanction.",
    operations:
      "Executed the Ronin Bridge ($620M) and Harmony Horizon ($100M) heists in 2022. Laundered proceeds through mixers like Tornado Cash (OFAC-sanctioned August 2022) and cross-chain bridges. UN Panel of Experts reports these operations fund DPRK WMD and ballistic missile programs. The Exchange fight is mechanically harder than the Bank -- Lazarus's laundering arm is hardened, compartmentalized, and doesn't hold still long enough for brute force. You have to trace them.",
    badgeId: "exchange-raider",
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
    id: "exchange-raider",
    label: "Exchange Raider",
    condition: "Defeat TraderTraitor at the Crypto Exchange",
    tier: "silver",
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
