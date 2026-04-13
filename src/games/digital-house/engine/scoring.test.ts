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

import { describe, it, expect } from "vitest";
import { calculateScore, type DevicePlacement } from "./scoring";

const p = (deviceId: DevicePlacement["deviceId"], zoneId: DevicePlacement["zoneId"]): DevicePlacement => ({
  deviceId,
  zoneId,
});

describe("calculateScore — baseline", () => {
  it("returns 50/50/50 for empty placements", () => {
    const r = calculateScore([]);
    expect(r.privacy).toBe(50);
    expect(r.blastRadius).toBe(50);
    expect(r.recovery).toBe(50);
    expect(r.total).toBe(50);
    expect(r.appliedCombos).toHaveLength(0);
  });
});

describe("calculateScore — base matrix spot checks (spec §13)", () => {
  it("Work laptop on Main: +12 / +10 / +8", () => {
    const r = calculateScore([p("work-laptop", "main")]);
    expect(r.privacy).toBe(62);
    expect(r.blastRadius).toBe(60);
    expect(r.recovery).toBe(58);
  });

  it("Work laptop on IoT: -35 / -30 / -28", () => {
    const r = calculateScore([p("work-laptop", "iot")]);
    expect(r.privacy).toBe(15);
    expect(r.blastRadius).toBe(20);
    expect(r.recovery).toBe(22);
  });

  it("Guest phone on Guest: +8 / +10 / +8", () => {
    const r = calculateScore([p("guest-phone", "guest")]);
    expect(r.privacy).toBe(58);
    expect(r.blastRadius).toBe(60);
    expect(r.recovery).toBe(58);
  });

  it("Printer on IoT (gray-area best fit): +2 / +4 / +2", () => {
    const r = calculateScore([p("printer", "iot")]);
    expect(r.privacy).toBe(52);
    expect(r.blastRadius).toBe(54);
    expect(r.recovery).toBe(52);
  });

  it("Printer on Main (gray-area acceptable with mild penalty): -2 / -4 / -6", () => {
    const r = calculateScore([p("printer", "main")]);
    expect(r.privacy).toBe(48);
    expect(r.blastRadius).toBe(46);
    expect(r.recovery).toBe(44);
  });

  it("Camera hub on IoT: +10 / +12 / +10", () => {
    const r = calculateScore([p("camera-hub", "iot")]);
    expect(r.privacy).toBe(60);
    expect(r.blastRadius).toBe(62);
    expect(r.recovery).toBe(60);
  });
});

describe("calculateScore — clamping", () => {
  it("never goes below 0", () => {
    // work-laptop on iot = -35 privacy; add personal phone on iot = another -28
    // starting 50 - 35 - 28 = -13 → clamped to 0
    const r = calculateScore([
      p("work-laptop", "iot"),
      p("personal-phone", "iot"),
    ]);
    expect(r.privacy).toBe(0);
    expect(r.blastRadius).toBe(0);
    expect(r.recovery).toBe(0);
  });

  it("never exceeds 100 — perfect layout clamps up", () => {
    // All 10 devices in their best-fit zones. Sum of positive deltas pushes
    // every meter above 100; clamped to 100. No combo penalties fire.
    const r = calculateScore([
      p("work-laptop", "main"),
      p("personal-phone", "main"),
      p("tablet", "main"),
      p("guest-phone", "guest"),
      p("printer", "iot"),
      p("smart-tv", "iot"),
      p("smart-speaker", "iot"),
      p("game-console", "iot"),
      p("doorbell-camera", "iot"),
      p("camera-hub", "iot"),
    ]);
    expect(r.privacy).toBe(100);
    expect(r.blastRadius).toBe(100);
    expect(r.recovery).toBe(100);
    expect(r.total).toBe(100);
    expect(r.appliedCombos).toHaveLength(0);
  });
});

describe("calculateScore — combo A: guest device mixed with trusted on Main", () => {
  it("fires when guest-phone is on Main alongside a trusted device", () => {
    const r = calculateScore([
      p("work-laptop", "main"),
      p("guest-phone", "main"),
    ]);
    // Base: laptop +12/+10/+8 + guest-phone -24/-22/-18 = -12/-12/-10
    // Combo A: -12/-16/-10
    // Total delta: -24/-28/-20
    expect(r.privacy).toBe(50 - 24);
    expect(r.blastRadius).toBe(50 - 28);
    expect(r.recovery).toBe(50 - 20);
    expect(r.appliedCombos.map((c) => c.id)).toContain("guest-mixed-with-trusted");
  });

  it("does NOT fire when guest-phone is on Main but no trusted device is", () => {
    const r = calculateScore([p("guest-phone", "main")]);
    // Base: -24/-22/-18, no combos.
    expect(r.privacy).toBe(50 - 24);
    expect(r.blastRadius).toBe(50 - 22);
    expect(r.recovery).toBe(50 - 18);
    expect(r.appliedCombos).toHaveLength(0);
  });

  it("does NOT fire when guest-phone is NOT on Main", () => {
    const r = calculateScore([
      p("work-laptop", "main"),
      p("guest-phone", "guest"),
    ]);
    expect(r.appliedCombos.map((c) => c.id)).not.toContain(
      "guest-mixed-with-trusted",
    );
  });

  it("fires with tablet as the trusted device (not just laptop/phone)", () => {
    const r = calculateScore([
      p("tablet", "main"),
      p("guest-phone", "main"),
    ]);
    expect(r.appliedCombos.map((c) => c.id)).toContain("guest-mixed-with-trusted");
  });
});

describe("calculateScore — combo B: any camera on Main", () => {
  it("fires once for doorbell camera on Main", () => {
    const r = calculateScore([p("doorbell-camera", "main")]);
    // Base: -22/-20/-20, Combo B: -10/-10/-10
    expect(r.privacy).toBe(50 - 32);
    expect(r.blastRadius).toBe(50 - 30);
    expect(r.recovery).toBe(50 - 30);
    const bs = r.appliedCombos.filter((c) => c.id === "camera-on-main");
    expect(bs).toHaveLength(1);
  });

  it("fires once for camera hub on Main", () => {
    const r = calculateScore([p("camera-hub", "main")]);
    // Base: -24/-22/-22, Combo B: -10/-10/-10
    expect(r.privacy).toBe(50 - 34);
    expect(r.blastRadius).toBe(50 - 32);
    expect(r.recovery).toBe(50 - 32);
  });

  it("fires ONCE (not twice) when both cameras are on Main", () => {
    const r = calculateScore([
      p("doorbell-camera", "main"),
      p("camera-hub", "main"),
    ]);
    const bs = r.appliedCombos.filter((c) => c.id === "camera-on-main");
    expect(bs).toHaveLength(1);
  });

  it("does NOT fire when cameras are on IoT", () => {
    const r = calculateScore([
      p("doorbell-camera", "iot"),
      p("camera-hub", "iot"),
    ]);
    expect(r.appliedCombos.map((c) => c.id)).not.toContain("camera-on-main");
  });
});

describe("calculateScore — combo C: entertainment clutter around trusted devices", () => {
  it("fires once per entertainment/camera device on Main while laptop or phone is on Main", () => {
    const r = calculateScore([
      p("work-laptop", "main"),
      p("smart-tv", "main"),
      p("smart-speaker", "main"),
    ]);
    // Base: laptop 12/10/8 + tv -12/-16/-18 + speaker -14/-14/-16 = -14/-20/-26
    // Combo C × 2: -8/-16/-20
    // Total: -22/-36/-46
    expect(r.privacy).toBe(50 - 22);
    expect(r.blastRadius).toBe(50 - 36);
    expect(r.recovery).toBe(50 - 46);
    const c = r.appliedCombos.find((x) => x.id === "entertainment-clutter");
    expect(c?.count).toBe(2);
  });

  it("counts cameras on Main as clutter too (per spec §14.C list)", () => {
    const r = calculateScore([
      p("personal-phone", "main"),
      p("doorbell-camera", "main"),
    ]);
    // Also triggers combo B (camera on main) at the same time.
    const clutter = r.appliedCombos.find((x) => x.id === "entertainment-clutter");
    expect(clutter?.count).toBe(1);
    expect(r.appliedCombos.map((c) => c.id)).toContain("camera-on-main");
  });

  it("does NOT fire without work-laptop or personal-phone on Main", () => {
    const r = calculateScore([
      p("tablet", "main"),
      p("smart-tv", "main"),
      p("smart-speaker", "main"),
    ]);
    expect(r.appliedCombos.map((c) => c.id)).not.toContain("entertainment-clutter");
  });

  it("does NOT fire when entertainment devices are on IoT", () => {
    const r = calculateScore([
      p("work-laptop", "main"),
      p("smart-tv", "iot"),
    ]);
    expect(r.appliedCombos.map((c) => c.id)).not.toContain("entertainment-clutter");
  });

  it("counts ×1 for a single entertainment device on Main with a laptop", () => {
    const r = calculateScore([
      p("work-laptop", "main"),
      p("smart-tv", "main"),
    ]);
    const c = r.appliedCombos.find((x) => x.id === "entertainment-clutter");
    expect(c?.count).toBe(1);
    expect(c?.delta).toEqual({ privacy: -4, blastRadius: -8, recovery: -10 });
  });
});

describe("calculateScore — combo D: everything dumped into one zone", () => {
  const allMain = (): DevicePlacement[] => [
    p("work-laptop", "main"),
    p("personal-phone", "main"),
    p("tablet", "main"),
    p("guest-phone", "main"),
    p("printer", "main"),
    p("smart-tv", "main"),
    p("smart-speaker", "main"),
    p("game-console", "main"),
    p("doorbell-camera", "main"),
    p("camera-hub", "main"),
  ];

  it("fires when all 10 devices sit in a single zone", () => {
    const r = calculateScore(allMain());
    expect(r.appliedCombos.map((c) => c.id)).toContain("single-zone-dump");
  });

  it("fires for all-IoT as well", () => {
    const r = calculateScore([
      p("work-laptop", "iot"),
      p("personal-phone", "iot"),
      p("tablet", "iot"),
      p("guest-phone", "iot"),
      p("printer", "iot"),
      p("smart-tv", "iot"),
      p("smart-speaker", "iot"),
      p("game-console", "iot"),
      p("doorbell-camera", "iot"),
      p("camera-hub", "iot"),
    ]);
    expect(r.appliedCombos.map((c) => c.id)).toContain("single-zone-dump");
  });

  it("does NOT fire when fewer than 10 devices are placed (even if all in one zone)", () => {
    const r = calculateScore([
      p("work-laptop", "main"),
      p("personal-phone", "main"),
      p("tablet", "main"),
    ]);
    expect(r.appliedCombos.map((c) => c.id)).not.toContain("single-zone-dump");
  });

  it("does NOT fire when all 10 are placed but across multiple zones", () => {
    const r = calculateScore([
      p("work-laptop", "main"),
      p("personal-phone", "main"),
      p("tablet", "main"),
      p("guest-phone", "guest"),
      p("printer", "iot"),
      p("smart-tv", "iot"),
      p("smart-speaker", "iot"),
      p("game-console", "iot"),
      p("doorbell-camera", "iot"),
      p("camera-hub", "iot"),
    ]);
    expect(r.appliedCombos.map((c) => c.id)).not.toContain("single-zone-dump");
  });

  it("worst-case all-Main layout clamps every meter to 0 and fires all four combos", () => {
    const r = calculateScore(allMain());
    expect(r.privacy).toBe(0);
    expect(r.blastRadius).toBe(0);
    expect(r.recovery).toBe(0);
    expect(r.total).toBe(0);
    const ids = r.appliedCombos.map((c) => c.id).sort();
    expect(ids).toEqual(
      [
        "guest-mixed-with-trusted",
        "camera-on-main",
        "entertainment-clutter",
        "single-zone-dump",
      ].sort(),
    );
  });
});

describe("calculateScore — audit trail", () => {
  it("baseDeltas and comboDeltas separate cleanly", () => {
    const r = calculateScore([
      p("work-laptop", "main"),
      p("smart-tv", "main"),
    ]);
    // Base: 12/10/8 + -12/-16/-18 = 0/-6/-10
    expect(r.baseDeltas).toEqual({ privacy: 0, blastRadius: -6, recovery: -10 });
    // Combo C × 1: -4/-8/-10
    expect(r.comboDeltas).toEqual({ privacy: -4, blastRadius: -8, recovery: -10 });
  });

  it("total is the rounded average of the three meters", () => {
    const r = calculateScore([p("work-laptop", "main")]);
    // 62, 60, 58 → avg 60
    expect(r.total).toBe(60);
  });
});
