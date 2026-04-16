/*
Copyright \u00A9 2026 Defend I.T. Solutions LLC. All Rights Reserved.

This software and its source code are the proprietary property of
Defend I.T. Solutions LLC and are protected by United States and
international copyright laws. Unauthorized reproduction, distribution,
modification, display, or use of this software, in whole or in part, without the
prior written permission of Defend I.T. Solutions LLC, is strictly prohibited.

This software is provided for use only by authorized employees, contractors, or
licensees of Defend I.T. Solutions LLC and may not be disclosed to any third
party without express written consent.
*/

import { DEVICES, isCamera, isTrusted, type DeviceId } from "./devices";
import type { ZoneId } from "./zones";

export type ScoreDelta = {
  privacy: number;
  blastRadius: number;
  recovery: number;
};

export type DevicePlacement = {
  deviceId: DeviceId;
  zoneId: ZoneId;
};

export type PlacementFindingSeverity = "wrong" | "critical";

export type PlacementFinding = {
  deviceId: DeviceId;
  actualZone: ZoneId;
  idealZone: ZoneId;
  severity: PlacementFindingSeverity;
  ceilingPenalty: ScoreDelta;
};

export type ScoreResult = {
  privacy: number;
  blastRadius: number;
  recovery: number;
  total: number;
  baseDeltas: ScoreDelta;
  comboDeltas: ScoreDelta;
  appliedCombos: AppliedCombo[];
  placementFindings: PlacementFinding[];
};

export type AppliedCombo = {
  id:
    | "guest-mixed-with-trusted"
    | "camera-on-main"
    | "entertainment-clutter"
    | "single-zone-dump";
  label: string;
  delta: ScoreDelta;
  count?: number;
};

const STARTING_SCORE = 50;

const BASE_MATRIX: Record<DeviceId, Record<ZoneId, ScoreDelta>> = {
  "work-laptop": {
    main: { privacy: 12, blastRadius: 10, recovery: 8 },
    guest: { privacy: -22, blastRadius: -20, recovery: -18 },
    iot: { privacy: -35, blastRadius: -30, recovery: -28 },
  },
  "personal-phone": {
    main: { privacy: 10, blastRadius: 8, recovery: 6 },
    guest: { privacy: -18, blastRadius: -16, recovery: -14 },
    iot: { privacy: -28, blastRadius: -24, recovery: -22 },
  },
  tablet: {
    main: { privacy: 6, blastRadius: 5, recovery: 4 },
    guest: { privacy: -10, blastRadius: -9, recovery: -8 },
    iot: { privacy: -16, blastRadius: -14, recovery: -12 },
  },
  "guest-phone": {
    main: { privacy: -24, blastRadius: -22, recovery: -18 },
    guest: { privacy: 8, blastRadius: 10, recovery: 8 },
    iot: { privacy: -6, blastRadius: -4, recovery: -4 },
  },
  printer: {
    main: { privacy: -8, blastRadius: -10, recovery: -12 },
    guest: { privacy: -10, blastRadius: -10, recovery: -8 },
    iot: { privacy: 2, blastRadius: 4, recovery: 2 },
  },
  "smart-tv": {
    main: { privacy: -12, blastRadius: -16, recovery: -18 },
    guest: { privacy: -8, blastRadius: -10, recovery: -10 },
    iot: { privacy: 6, blastRadius: 8, recovery: 8 },
  },
  "smart-speaker": {
    main: { privacy: -14, blastRadius: -14, recovery: -16 },
    guest: { privacy: -8, blastRadius: -8, recovery: -8 },
    iot: { privacy: 8, blastRadius: 8, recovery: 8 },
  },
  "game-console": {
    main: { privacy: -8, blastRadius: -12, recovery: -14 },
    guest: { privacy: -6, blastRadius: -8, recovery: -8 },
    iot: { privacy: 6, blastRadius: 8, recovery: 6 },
  },
  "doorbell-camera": {
    main: { privacy: -22, blastRadius: -20, recovery: -20 },
    guest: { privacy: -16, blastRadius: -14, recovery: -14 },
    iot: { privacy: 10, blastRadius: 10, recovery: 10 },
  },
  "camera-hub": {
    main: { privacy: -24, blastRadius: -22, recovery: -22 },
    guest: { privacy: -18, blastRadius: -16, recovery: -16 },
    iot: { privacy: 10, blastRadius: 12, recovery: 10 },
  },
};

const COMBO_A_GUEST_WITH_TRUSTED: ScoreDelta = {
  privacy: -12,
  blastRadius: -16,
  recovery: -10,
};

const COMBO_B_CAMERA_ON_MAIN: ScoreDelta = {
  privacy: -10,
  blastRadius: -10,
  recovery: -10,
};

const COMBO_C_ENTERTAINMENT_CLUTTER_PER_DEVICE: ScoreDelta = {
  privacy: -4,
  blastRadius: -8,
  recovery: -10,
};

const COMBO_D_SINGLE_ZONE_DUMP: ScoreDelta = {
  privacy: -15,
  blastRadius: -20,
  recovery: -20,
};

const WRONG_ZONE_CEILING_PENALTY: ScoreDelta = {
  privacy: 10,
  blastRadius: 12,
  recovery: 14,
};

const CRITICAL_ZONE_CEILING_PENALTY: ScoreDelta = {
  privacy: 18,
  blastRadius: 20,
  recovery: 22,
};

const IDEAL_ZONE_BY_DEVICE: Record<DeviceId, ZoneId> = {
  "work-laptop": "main",
  "personal-phone": "main",
  tablet: "main",
  "guest-phone": "guest",
  printer: "iot",
  "smart-tv": "iot",
  "smart-speaker": "iot",
  "game-console": "iot",
  "doorbell-camera": "iot",
  "camera-hub": "iot",
};

function zero(): ScoreDelta {
  return { privacy: 0, blastRadius: 0, recovery: 0 };
}

function clamp(value: number): number {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function addDelta(a: ScoreDelta, b: ScoreDelta): ScoreDelta {
  return {
    privacy: a.privacy + b.privacy,
    blastRadius: a.blastRadius + b.blastRadius,
    recovery: a.recovery + b.recovery,
  };
}

function scaleDelta(delta: ScoreDelta, count: number): ScoreDelta {
  return {
    privacy: delta.privacy * count,
    blastRadius: delta.blastRadius * count,
    recovery: delta.recovery * count,
  };
}

function idealZoneFor(deviceId: DeviceId): ZoneId {
  return IDEAL_ZONE_BY_DEVICE[deviceId];
}

function penaltyForSeverity(severity: PlacementFindingSeverity): ScoreDelta {
  return severity === "wrong"
    ? WRONG_ZONE_CEILING_PENALTY
    : CRITICAL_ZONE_CEILING_PENALTY;
}

function classifyPlacementSeverity(
  deviceId: DeviceId,
  actualZone: ZoneId,
): PlacementFindingSeverity | null {
  const idealZone = idealZoneFor(deviceId);
  if (actualZone === idealZone) return null;

  if (isTrusted(deviceId)) {
    return actualZone === "guest" ? "wrong" : "critical";
  }

  switch (deviceId) {
    case "guest-phone":
      return actualZone === "iot" ? "wrong" : "critical";
    case "printer":
    case "smart-tv":
    case "smart-speaker":
    case "game-console":
    case "doorbell-camera":
    case "camera-hub":
      return actualZone === "guest" ? "wrong" : "critical";
    default:
      return null;
  }
}

function isEntertainmentDevice(deviceId: DeviceId): boolean {
  return (
    deviceId === "smart-tv" ||
    deviceId === "smart-speaker" ||
    deviceId === "game-console"
  );
}

function buildPlacementFinding(
  placement: DevicePlacement,
): PlacementFinding | null {
  const severity = classifyPlacementSeverity(
    placement.deviceId,
    placement.zoneId,
  );
  if (!severity) return null;

  return {
    deviceId: placement.deviceId,
    actualZone: placement.zoneId,
    idealZone: idealZoneFor(placement.deviceId),
    severity,
    ceilingPenalty: penaltyForSeverity(severity),
  };
}

export function calculateScore(placements: DevicePlacement[]): ScoreResult {
  let baseDeltas = zero();
  for (const placement of placements) {
    const delta = BASE_MATRIX[placement.deviceId]?.[placement.zoneId];
    if (!delta) continue;
    baseDeltas = addDelta(baseDeltas, delta);
  }

  const appliedCombos: AppliedCombo[] = [];
  let comboDeltas = zero();

  const byZone: Record<ZoneId, DeviceId[]> = { main: [], guest: [], iot: [] };
  for (const placement of placements) {
    byZone[placement.zoneId].push(placement.deviceId);
  }

  const mainDevices = byZone.main;
  const mainHasTrusted = mainDevices.some(isTrusted);
  const mainHasWorkOrPersonal =
    mainDevices.includes("work-laptop") ||
    mainDevices.includes("personal-phone");

  if (mainDevices.includes("guest-phone") && mainHasTrusted) {
    comboDeltas = addDelta(comboDeltas, COMBO_A_GUEST_WITH_TRUSTED);
    appliedCombos.push({
      id: "guest-mixed-with-trusted",
      label: "Guest device sharing trust with your daily-use devices",
      delta: COMBO_A_GUEST_WITH_TRUSTED,
    });
  }

  if (mainDevices.some(isCamera)) {
    comboDeltas = addDelta(comboDeltas, COMBO_B_CAMERA_ON_MAIN);
    appliedCombos.push({
      id: "camera-on-main",
      label: "Camera devices placed inside your main network",
      delta: COMBO_B_CAMERA_ON_MAIN,
    });
  }

  if (mainHasWorkOrPersonal) {
    const clutterCount = mainDevices.filter(isEntertainmentDevice).length;
    if (clutterCount > 0) {
      const delta = scaleDelta(
        COMBO_C_ENTERTAINMENT_CLUTTER_PER_DEVICE,
        clutterCount,
      );
      comboDeltas = addDelta(comboDeltas, delta);
      appliedCombos.push({
        id: "entertainment-clutter",
        label:
          "Entertainment and smart devices sitting next to your work or personal devices",
        delta,
        count: clutterCount,
      });
    }
  }

  if (placements.length === DEVICES.length) {
    const usedZones = new Set(placements.map((placement) => placement.zoneId));
    if (usedZones.size === 1) {
      comboDeltas = addDelta(comboDeltas, COMBO_D_SINGLE_ZONE_DUMP);
      appliedCombos.push({
        id: "single-zone-dump",
        label: "Every device dumped into the same zone",
        delta: COMBO_D_SINGLE_ZONE_DUMP,
      });
    }
  }

  const placementFindings = placements
    .map(buildPlacementFinding)
    .filter((finding): finding is PlacementFinding => finding !== null);

  const ceilingPenalty = placementFindings.reduce(
    (sum, finding) => addDelta(sum, finding.ceilingPenalty),
    zero(),
  );

  const rawPrivacy = STARTING_SCORE + baseDeltas.privacy + comboDeltas.privacy;
  const rawBlastRadius =
    STARTING_SCORE + baseDeltas.blastRadius + comboDeltas.blastRadius;
  const rawRecovery =
    STARTING_SCORE + baseDeltas.recovery + comboDeltas.recovery;

  const privacyCeiling = clamp(100 - ceilingPenalty.privacy);
  const blastRadiusCeiling = clamp(100 - ceilingPenalty.blastRadius);
  const recoveryCeiling = clamp(100 - ceilingPenalty.recovery);

  const privacy = clamp(Math.min(rawPrivacy, privacyCeiling));
  const blastRadius = clamp(Math.min(rawBlastRadius, blastRadiusCeiling));
  const recovery = clamp(Math.min(rawRecovery, recoveryCeiling));
  const total = Math.round((privacy + blastRadius + recovery) / 3);

  return {
    privacy,
    blastRadius,
    recovery,
    total,
    baseDeltas,
    comboDeltas,
    appliedCombos,
    placementFindings,
  };
}

export const SCORING_INTERNALS = {
  STARTING_SCORE,
  BASE_MATRIX,
  COMBO_A_GUEST_WITH_TRUSTED,
  COMBO_B_CAMERA_ON_MAIN,
  COMBO_C_ENTERTAINMENT_CLUTTER_PER_DEVICE,
  COMBO_D_SINGLE_ZONE_DUMP,
  WRONG_ZONE_CEILING_PENALTY,
  CRITICAL_ZONE_CEILING_PENALTY,
  IDEAL_ZONE_BY_DEVICE,
};
