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

import {
  Bell,
  Gamepad2,
  Laptop,
  PhoneCall,
  Printer,
  Smartphone,
  Speaker,
  Tablet,
  Tv,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { DeviceCategory, DeviceId } from "../engine/devices";

const ICON_FOR_DEVICE: Record<DeviceId, LucideIcon> = {
  "work-laptop": Laptop,
  "personal-phone": Smartphone,
  tablet: Tablet,
  "guest-phone": PhoneCall,
  printer: Printer,
  "smart-tv": Tv,
  "smart-speaker": Speaker,
  "game-console": Gamepad2,
  "doorbell-camera": Bell,
  "camera-hub": Video,
};

type IconStyle = Readonly<{
  bg: string;
  ring: string;
  text: string;
  glow: string;
}>;

const CATEGORY_STYLES: Record<DeviceCategory, IconStyle> = {
  trusted: {
    bg: "bg-sky-500/90",
    ring: "ring-sky-400/50",
    text: "text-white",
    glow: "shadow-[0_2px_8px_rgba(56,189,248,0.45)]",
  },
  guest: {
    bg: "bg-amber-500/90",
    ring: "ring-amber-400/50",
    text: "text-white",
    glow: "shadow-[0_2px_8px_rgba(251,191,36,0.45)]",
  },
  "gray-area": {
    bg: "bg-slate-500/90",
    ring: "ring-slate-400/50",
    text: "text-white",
    glow: "shadow-[0_2px_8px_rgba(148,163,184,0.4)]",
  },
  entertainment: {
    bg: "bg-violet-500/90",
    ring: "ring-violet-400/50",
    text: "text-white",
    glow: "shadow-[0_2px_8px_rgba(167,139,250,0.45)]",
  },
  camera: {
    bg: "bg-rose-500/90",
    ring: "ring-rose-400/50",
    text: "text-white",
    glow: "shadow-[0_2px_8px_rgba(248,113,113,0.45)]",
  },
};

const NEUTRAL_STYLE: IconStyle = {
  bg: "bg-white/92 dark:bg-slate-900/88",
  ring: "ring-slate-300/80 dark:ring-slate-600/70",
  text: "text-slate-700 dark:text-slate-100",
  glow: "shadow-[0_2px_8px_rgba(15,23,42,0.12)] dark:shadow-[0_2px_8px_rgba(2,6,23,0.35)]",
};

const ZONE_STYLES: Record<string, IconStyle> = {
  "zone-main": {
    bg: "bg-sky-500/90",
    ring: "ring-sky-400/50",
    text: "text-white",
    glow: "shadow-[0_2px_8px_rgba(56,189,248,0.45)]",
  },
  "zone-guest": {
    bg: "bg-amber-500/90",
    ring: "ring-amber-400/50",
    text: "text-white",
    glow: "shadow-[0_2px_8px_rgba(251,191,36,0.45)]",
  },
  "zone-iot": {
    bg: "bg-violet-500/90",
    ring: "ring-violet-400/50",
    text: "text-white",
    glow: "shadow-[0_2px_8px_rgba(167,139,250,0.45)]",
  },
};

export type DeviceIconTone = "category" | "neutral" | "zone-main" | "zone-guest" | "zone-iot";
export type DeviceIconSize = "xs" | "sm" | "md" | "lg" | "tile";

const SIZE: Record<
  DeviceIconSize,
  { box: string; icon: number; radius: string }
> = {
  xs: { box: "h-5 w-5", icon: 12, radius: "rounded-md" },
  sm: { box: "h-7 w-7", icon: 14, radius: "rounded-lg" },
  md: { box: "h-9 w-9", icon: 18, radius: "rounded-xl" },
  lg: { box: "h-10 w-10", icon: 24, radius: "rounded-lg" },
  tile: { box: "h-8 w-8", icon: 20, radius: "rounded-lg" },
};

type DeviceIconProps = Readonly<{
  deviceId: DeviceId;
  category: DeviceCategory;
  size?: DeviceIconSize;
  tone?: DeviceIconTone;
  className?: string;
  popOnMount?: boolean;
}>;

export function DeviceIcon({
  deviceId,
  category,
  size = "md",
  tone = "category",
  className = "",
  popOnMount = false,
}: DeviceIconProps) {
  const Icon = ICON_FOR_DEVICE[deviceId];
  const style =
    tone === "neutral"
      ? NEUTRAL_STYLE
      : tone.startsWith("zone-")
        ? ZONE_STYLES[tone] ?? CATEGORY_STYLES[category]
        : CATEGORY_STYLES[category];
  const sizing = SIZE[size];
  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center ring-1",
        sizing.box,
        sizing.radius,
        style.bg,
        style.ring,
        style.text,
        style.glow,
        className,
      ].join(" ")}
      style={
        popOnMount
          ? { animation: "dh-popIn 0.36s cubic-bezier(0.34,1.56,0.64,1)" }
          : undefined
      }
      aria-hidden
    >
      <Icon size={sizing.icon} strokeWidth={2.25} />
    </span>
  );
}

export { ICON_FOR_DEVICE, CATEGORY_STYLES, NEUTRAL_STYLE };
