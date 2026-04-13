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

import type { RoomId } from "../../engine/zones";
import { BedroomFurniture } from "./BedroomFurniture";
import { EntryFurniture } from "./EntryFurniture";
import { KitchenFurniture } from "./KitchenFurniture";
import { LivingRoomFurniture } from "./LivingRoomFurniture";
import { OfficeFurniture } from "./OfficeFurniture";

export const ROOM_FURNITURE: Record<RoomId, () => React.JSX.Element> = {
  office: OfficeFurniture,
  bedroom: BedroomFurniture,
  "living-room": LivingRoomFurniture,
  kitchen: KitchenFurniture,
  "entry-exterior": EntryFurniture,
};

export {
  BedroomFurniture,
  EntryFurniture,
  KitchenFurniture,
  LivingRoomFurniture,
  OfficeFurniture,
};
