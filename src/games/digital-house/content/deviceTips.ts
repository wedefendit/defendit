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
    main: "Right where it belongs, safe with your other personal devices.",
    guest: "Can't reach the other devices it needs to work with.",
    iot: "Sitting next to every smart device in the house.",
  },
  "personal-phone": {
    main: "Safe alongside your other personal devices.",
    guest: "Cut off from the files and apps it needs.",
    iot: "Sitting next to devices that rarely get security updates.",
  },
  tablet: {
    main: "Good fit with the rest of your daily devices.",
    guest: "Works for browsing, but can't reach your other devices.",
    iot: "Sitting next to smart devices it doesn't need to be near.",
  },
  "guest-phone": {
    main: "A visitor's phone can now see everything on your network.",
    guest: "Perfect. Your guest gets internet without seeing your stuff.",
    iot: "Better than Main, but visitors really belong on their own network.",
  },
  printer: {
    main: "Convenient, but printers rarely get security updates.",
    guest: "Separated, but harder to actually print to.",
    iot: "Safer. The printer works fine without access to your personal devices.",
  },
  "smart-tv": {
    main: "Smart TVs constantly send data back to the manufacturer. Too much access for a TV.",
    guest: "Still more access to your home than a TV needs.",
    iot: "Streams fine from here and can't see anything it shouldn't.",
  },
  "smart-speaker": {
    main: "An always-listening device with full access to your personal network.",
    guest: "Limited access, but not really where it belongs either.",
    iot: "Works exactly the same from here, just much safer.",
  },
  "game-console": {
    main: "Online gaming and voice chat running on your personal network.",
    guest: "Doesn't really need to be on the guest network.",
    iot: "Gaming works fine from here, away from your personal devices.",
  },
  "doorbell-camera": {
    main: "A camera facing the street with full access to your personal devices.",
    guest: "An outdoor camera with more access than it needs.",
    iot: "Right where it belongs. Works fine, stays separate from everything else.",
  },
  "camera-hub": {
    main: "If someone hacks the camera, they can reach your work files.",
    guest: "Cameras need their own space, not visitor-level access.",
    iot: "If someone breaks in through the cameras, the damage stays limited to this network.",
  },
};

/**
 * Short combo-penalty messages keyed by AppliedCombo.id. These appear in the
 * "Pressure building" warning panel and in the end-state summary.
 */
export const COMBO_TIPS: Record<AppliedCombo["id"], string> = {
  "guest-mixed-with-trusted":
    "A visitor's device is sharing a network with your personal devices.",
  "camera-on-main":
    "Camera on Main. A camera facing the street can see your personal devices.",
  "entertainment-clutter":
    "Smart devices are cluttering up your personal network.",
  "single-zone-dump":
    "Everything is on one network. If any device gets hacked, the rest are exposed.",
};
