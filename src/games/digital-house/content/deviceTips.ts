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

import type { DeviceId } from "../engine/devices";
import type { AppliedCombo } from "../engine/scoring";
import type { ZoneId } from "../engine/zones";

/**
 * One-liner narrative per (device, zone). Tone follows digital_house_v_1_spec
 * §16: calm, plain-English, consequences over judgments. Used by the analysis
 * toast that appears below the house after each placement.
 */
export const DEVICE_TIPS: Record<DeviceId, Record<ZoneId, string>> = {
  "work-laptop": {
    main: "Right where it belongs — protected alongside your trusted devices.",
    guest: "Cut off from the devices it actually needs to reach.",
    iot: "Exposed to every smart device in the house.",
  },
  "personal-phone": {
    main: "Safe alongside your other trusted devices.",
    guest: "Isolated from the files and services it depends on.",
    iot: "Sharing space with the least-patched devices in the house.",
  },
  tablet: {
    main: "Good fit with the rest of your daily devices.",
    guest: "Works for browsing, but loses local network access.",
    iot: "Unnecessary exposure to IoT gear.",
  },
  "guest-phone": {
    main: "A visitor now has full network trust — the exact thing to avoid.",
    guest: "Perfect — isolated internet for friends, no shared trust.",
    iot: "Better than Main, but still in the room with your cameras.",
  },
  printer: {
    main: "Convenient, but printers rarely get patched.",
    guest: "Isolated but harder to actually print to.",
    iot: "Safer — the printer does its job without touching trusted devices.",
  },
  "smart-tv": {
    main: "TVs phone home constantly. Too much trust for a streaming box.",
    guest: "Still more reach into the house than a TV needs.",
    iot: "Contained. Streams fine, sees nothing it shouldn't.",
  },
  "smart-speaker": {
    main: "Always-listening device sitting on your trusted network.",
    guest: "Limited reach, but not where it belongs either.",
    iot: "Contained. Same function, far safer.",
  },
  "game-console": {
    main: "Gaming traffic and chat services in your trusted zone.",
    guest: "Unnecessary guest clutter.",
    iot: "Gaming happens away from sensitive devices.",
  },
  "doorbell-camera": {
    main: "Direct path from outside to every trusted device.",
    guest: "Exterior device, still with too much reach.",
    iot: "Exterior devices belong here — contained and reachable.",
  },
  "camera-hub": {
    main: "A compromised camera becomes a path to your work files.",
    guest: "Cameras need isolation, not guest-level trust.",
    iot: "Isolated. If the hub is breached, the breach stays contained.",
  },
};

/**
 * Short combo-penalty messages keyed by AppliedCombo.id. These appear in the
 * "Pressure building" warning panel and in the end-state summary.
 */
export const COMBO_TIPS: Record<AppliedCombo["id"], string> = {
  "guest-mixed-with-trusted":
    "Guest device mixed with trusted devices — the layout we tell people to break first.",
  "camera-on-main":
    "Camera on Main — direct path from outside to your trusted devices.",
  "entertainment-clutter":
    "Smart devices cluttering the trusted zone.",
  "single-zone-dump":
    "Everything in one zone — any single device can reach everything else.",
};
