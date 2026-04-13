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

import type { Difficulty } from "../../shared/types";

export type ZoneId = "main" | "guest" | "iot";

export type RoomId =
  | "office"
  | "living-room"
  | "kitchen"
  | "bedroom"
  | "entry-exterior";

export type Zone = {
  id: ZoneId;
  name: string;
  shortName: string;
  description: string;
};

export type Room = {
  id: RoomId;
  name: string;
  description: string;
};

export const ZONES: Zone[] = [
  {
    id: "main",
    name: "Main Network",
    shortName: "Main",
    description:
      "For devices you trust most and depend on every day — work and personal.",
  },
  {
    id: "guest",
    name: "Guest Network",
    shortName: "Guest",
    description:
      "For temporary or outside-user access that should not share full trust.",
  },
  {
    id: "iot",
    name: "Smart Devices / IoT",
    shortName: "IoT",
    description:
      "For TVs, cameras, speakers, and other connected devices that do not need the reach of your personal or work systems.",
  },
];

export const ROOMS: Room[] = [
  {
    id: "office",
    name: "Office",
    description: "Trusted work zone. Where the laptop lives and the day job happens.",
  },
  {
    id: "living-room",
    name: "Living Room",
    description: "Entertainment and family clutter — TV, console, speaker.",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    description: "Appliances and smart fixtures. A utility space.",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    description: "Private personal space. Phones and tablets end up here.",
  },
  {
    id: "entry-exterior",
    name: "Entry / Exterior",
    description: "The front door, the doorbell camera, and visitor overflow.",
  },
];

/**
 * Room → zone pre-assignments per difficulty tier.
 *
 * - Easy: every room is pre-tagged with a zone so the player only places
 *   devices. Guest separation is introduced in Medium and Hard.
 * - Medium: the most intuitive rooms are pre-tagged, rest are blank (null).
 * - Hard: nothing is pre-tagged — the player assigns every zone and every device.
 *
 * A `null` value means the player must assign the zone for that room.
 */
export const ROOM_ZONE_ASSIGNMENTS: Record<
  Difficulty,
  Record<RoomId, ZoneId | null>
> = {
  easy: {
    office: "main",
    bedroom: "main",
    "living-room": "iot",
    kitchen: "iot",
    "entry-exterior": "iot",
  },
  medium: {
    office: "main",
    "living-room": "iot",
    bedroom: null,
    kitchen: null,
    "entry-exterior": null,
  },
  hard: {
    office: null,
    "living-room": null,
    bedroom: null,
    kitchen: null,
    "entry-exterior": null,
  },
};

const ZONE_BY_ID: Record<ZoneId, Zone> = ZONES.reduce(
  (acc, z) => {
    acc[z.id] = z;
    return acc;
  },
  {} as Record<ZoneId, Zone>,
);

const ROOM_BY_ID: Record<RoomId, Room> = ROOMS.reduce(
  (acc, r) => {
    acc[r.id] = r;
    return acc;
  },
  {} as Record<RoomId, Room>,
);

export function getZone(id: ZoneId): Zone {
  return ZONE_BY_ID[id];
}

export function getRoom(id: RoomId): Room {
  return ROOM_BY_ID[id];
}

export function getRoomZone(
  difficulty: Difficulty,
  roomId: RoomId,
): ZoneId | null {
  return ROOM_ZONE_ASSIGNMENTS[difficulty][roomId];
}
