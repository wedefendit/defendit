import type { Badge, Difficulty } from "../shared/types";
import { DEVICES, type DeviceId, type RoomId, type ZoneId } from "./engine";
import type { ViewportBand } from "./layout";

export type Placement = Readonly<{ roomId: RoomId; zoneId: ZoneId }>;
export type PlacementMap = Record<DeviceId, Placement | null>;
export type BadgeJustEarned = "rookie" | "architect" | null;
export type ScoreDelta = { key: number; value: number } | null;
export type ActiveToast = {
  key: number;
  type: "halfway" | "streak";
  label: string;
  hint: string;
} | null;
export type LastPlacement = Readonly<{
  deviceId: DeviceId;
  zoneId: ZoneId;
  roomId: RoomId;
}>;
export type ViewportProfile = Readonly<{
  width: number;
  height: number;
  band: ViewportBand;
  isCoarsePointer: boolean;
}>;

// ---- Onboarding ----

export type CoachStepConfig = Readonly<{
  target: string;
  heading: string;
  body: string;
  position: "above" | "below";
}>;

export function coachSteps(
  difficulty: Difficulty,
  mobile: boolean,
): CoachStepConfig[] {
  const inventoryTarget = mobile
    ? "[data-testid='dh-device-strip']"
    : "[data-testid='dh-inventory-panel']";

  const steps: CoachStepConfig[] = [
    {
      target: "[data-testid='dh-house-panel']",
      heading: "Build a secure home network",
      body: "Your home has three network zones: Main for personal and work devices, Guest for visitor access, and IoT for smart devices. Putting the wrong devices on the same network creates real security risk.",
      position: "below",
    },
    {
      target: inventoryTarget,
      heading: "Drag devices into rooms",
      body: "Drag each device from the inventory into the room where it belongs. Your security score adjusts in real time based on which zone each device lands on.",
      position: mobile ? "above" : "below",
    },
    {
      target: "[data-testid='dh-score-hud']",
      heading: "Watch your score",
      body: "Each placement affects privacy, blast radius, and recovery. The analysis card shows what went right or wrong after every move.",
      position: "below",
    },
  ];
  if (difficulty !== "easy") {
    steps.push({
      target: "[data-testid='dh-house-panel']",
      heading: "Set your zones",
      body: "On this difficulty, rooms start without a zone. Set each room's zone before placing devices by using the zone chip in the corner of each room.",
      position: "below",
    });
  }
  return steps;
}

// ---- Idle hints ----

export type IdleHint = Readonly<{ key: number; message: string }>;

// ---- Zone-blocked feedback ----

export type ZoneBlockedFeedback = Readonly<{ key: number; roomId: RoomId }>;

// ---- Badges ----

export const HOME_NETWORK_ROOKIE: Badge = {
  id: "home-network-rookie",
  gameId: "digital-house",
  name: "Home Network Rookie",
  description: "Completed The Digital House",
  tier: "bronze",
  condition: "Place every device to finish a run",
};

export const NETWORK_ARCHITECT: Badge = {
  id: "network-architect",
  gameId: "digital-house",
  name: "Network Architect",
  description: "Completed The Digital House on Hard with a score of 70+",
  tier: "gold",
  condition: "Finish Hard difficulty with an overall score of 70 or more",
};

// ---- Preference keys ----

export const DIGITAL_HOUSE_GAME_ID = "digital-house";
export const HELP_PREF_KEY = "hide-help-modal";
export const ONBOARDING_PREF_KEY = "hide-onboarding";

// ---- Display names ----

export const TRAY_NAME: Record<DeviceId, string> = {
  "work-laptop": "Work Laptop",
  "personal-phone": "Phone",
  tablet: "Tablet",
  "guest-phone": "Guest Phone",
  printer: "Printer",
  "smart-tv": "Smart TV",
  "smart-speaker": "Speaker",
  "game-console": "Console",
  "doorbell-camera": "Doorbell",
  "camera-hub": "Cameras",
};

export const TOOLBAR_LABEL: Record<DeviceId, string> = {
  "work-laptop": "Laptop",
  "personal-phone": "Phone",
  tablet: "Tab",
  "guest-phone": "Guest",
  printer: "Print",
  "smart-tv": "TV",
  "smart-speaker": "Spkr",
  "game-console": "Game",
  "doorbell-camera": "Bell",
  "camera-hub": "Cam",
};

// ---- Device sets ----

export const RISKY_DEVICE_IDS = new Set<DeviceId>([
  "guest-phone",
  "smart-tv",
  "smart-speaker",
  "game-console",
  "doorbell-camera",
  "camera-hub",
  "printer",
]);
export const TRUSTED_DEVICE_IDS = new Set<DeviceId>([
  "work-laptop",
  "personal-phone",
  "tablet",
]);

// ---- Shared card style ----

export const CARD =
  "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_58%)] shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/95 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_62%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5";

// ---- Helpers ----

export function emptyPlacements(): PlacementMap {
  return DEVICES.reduce((acc, d) => {
    acc[d.id] = null;
    return acc;
  }, {} as PlacementMap);
}

export function nextDifficulty(current: Difficulty): Difficulty {
  if (current === "easy") return "medium";
  if (current === "medium") return "hard";
  return "hard";
}
