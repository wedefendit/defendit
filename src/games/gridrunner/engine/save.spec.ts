/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

// @vitest-environment happy-dom

import { describe, it, expect, beforeEach } from "vitest";
import { loadSaveSummary } from "./save";

const SAVE_KEY = "dis-gridrunner-save";

const MOCK_SAVE = {
  version: 1,
  playerName: "TESTOP",
  player: {
    level: 7,
    xp: 120,
    xpToNext: 400,
    integrity: 170,
    maxIntegrity: 170,
    compute: 108,
    maxCompute: 108,
    bandwidth: 16,
    firewall: 11,
  },
  inventory: [],
  equippedTools: [null, null, null, null],
  currentZone: "bank",
  currentPosition: { x: 5, y: 3 },
  defeatedBosses: [],
  completedTutorial: true,
  bits: 42,
  credits: 0,
  playTime: 600,
  savedAt: "2026-04-16T12:00:00.000Z",
};

describe("loadSaveSummary", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no save exists", () => {
    expect(loadSaveSummary()).toBeNull();
  });

  it("returns summary with correct fields from stored save", () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(MOCK_SAVE));
    const summary = loadSaveSummary();
    expect(summary).not.toBeNull();
    expect(summary!.playerName).toBe("TESTOP");
    expect(summary!.level).toBe(7);
    expect(summary!.zone).toBe("bank");
    expect(summary!.playTime).toBe(600);
    expect(summary!.savedAt).toBe("2026-04-16T12:00:00.000Z");
  });

  it("returns null when save has wrong version", () => {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({ ...MOCK_SAVE, version: 999 }),
    );
    expect(loadSaveSummary()).toBeNull();
  });

  it("returns null when save data is corrupted", () => {
    localStorage.setItem(SAVE_KEY, "not-json");
    expect(loadSaveSummary()).toBeNull();
  });
});
