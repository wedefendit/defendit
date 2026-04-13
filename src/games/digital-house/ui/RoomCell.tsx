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

import type {
  CSSProperties,
  DragEvent,
  KeyboardEvent,
  MouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { ChevronDown, Lock } from "lucide-react";
import type { Device, DeviceId } from "../engine/devices";
import { getRoom, type RoomId, type ZoneId } from "../engine/zones";
import { DeviceIcon, type DeviceIconTone } from "./DeviceIcon";
import { ROOM_FURNITURE } from "./furniture";

type FloorStyle = Readonly<{
  base: string;
  overlay: string;
}>;

const FLOOR_STYLES: Record<RoomId, FloorStyle> = {
  office: {
    base: "linear-gradient(135deg,#d4c4a0 0%,#ccbc96 100%)",
    overlay:
      "repeating-linear-gradient(90deg,rgba(74,60,48,0.12) 0 1px,transparent 1px 28px)",
  },
  bedroom: {
    base: "linear-gradient(135deg,#ccc4b4 0%,#c4bcac 100%)",
    overlay:
      "repeating-linear-gradient(0deg,rgba(74,60,48,0.08) 0 1px,transparent 1px 6px)",
  },
  "living-room": {
    base: "linear-gradient(135deg,#d4c4a0 0%,#cabb9a 100%)",
    overlay:
      "repeating-linear-gradient(90deg,rgba(74,60,48,0.12) 0 1px,transparent 1px 32px)",
  },
  kitchen: {
    base: "linear-gradient(135deg,#ddd8d0 0%,#d4cfca 100%)",
    overlay:
      "repeating-linear-gradient(0deg,rgba(74,60,48,0.12) 0 1px,transparent 1px 20px),repeating-linear-gradient(90deg,rgba(74,60,48,0.12) 0 1px,transparent 1px 20px)",
  },
  "entry-exterior": {
    base: "linear-gradient(135deg,#b8b0a0 0%,#a8a090 100%)",
    overlay:
      "repeating-linear-gradient(135deg,rgba(74,60,48,0.14) 0 2px,transparent 2px 16px)",
  },
};

const ZONE_ACCENT: Record<ZoneId, string> = {
  main: "#38bdf8",
  guest: "#fbbf24",
  iot: "#a78bfa",
};

const ZONE_SOFT: Record<ZoneId, string> = {
  main: "rgba(56,189,248,0.09)",
  guest: "rgba(251,191,36,0.09)",
  iot: "rgba(167,139,250,0.09)",
};

const ZONE_MED: Record<ZoneId, string> = {
  main: "rgba(56,189,248,0.2)",
  guest: "rgba(251,191,36,0.2)",
  iot: "rgba(167,139,250,0.2)",
};

const ZONE_GLOW: Record<ZoneId, string> = {
  main: "rgba(56,189,248,0.32)",
  guest: "rgba(251,191,36,0.32)",
  iot: "rgba(167,139,250,0.32)",
};

const ZONE_LABEL: Record<ZoneId, string> = {
  main: "Main",
  guest: "Guest",
  iot: "IoT",
};

type ZoneControl = Readonly<{
  currentZone: ZoneId | null;
  locked: boolean;
  showLock?: boolean;
  open: boolean;
  onToggle: () => void;
  onAssign: (zoneId: ZoneId) => void;
}>;

type RoomCellProps = Readonly<{
  roomId: RoomId;
  zoneId: ZoneId | null;
  devices: ReadonlyArray<Device>;
  isHover: boolean;
  isRisky: boolean;
  isSelectMode: boolean;
  style?: CSSProperties;
  onEnter: () => void;
  onLeave: () => void;
  onClickPlace: () => void;
  onDropDevice: (deviceId: DeviceId) => void;
  onDeviceClick?: (deviceId: DeviceId) => void;
  allowDrag?: boolean;
  zoneControl?: ZoneControl;
  deviceTone?: DeviceIconTone;
  onTouchDragStart?: (deviceId: DeviceId, e: ReactTouchEvent) => void;
}>;

export function RoomCell({
  roomId,
  zoneId,
  devices,
  isHover,
  isRisky,
  isSelectMode,
  style,
  onEnter,
  onLeave,
  onClickPlace,
  onDropDevice,
  onDeviceClick,
  allowDrag = true,
  zoneControl,
  deviceTone = "category",
  onTouchDragStart,
}: RoomCellProps) {
  const floor = FLOOR_STYLES[roomId];
  const Furn = ROOM_FURNITURE[roomId];
  const meta = getRoom(roomId);
  const active = isHover;

  const accent = zoneId ? ZONE_ACCENT[zoneId] : "#8b7355";
  const softTint = zoneId ? ZONE_SOFT[zoneId] : "rgba(255,255,255,0.04)";
  const medTint = zoneId ? ZONE_MED[zoneId] : "rgba(255,255,255,0.08)";
  const glow = zoneId ? ZONE_GLOW[zoneId] : "rgba(255,255,255,0.1)";

  const stopBubble = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!allowDrag) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onEnter();
  };

  const handleDropEvent = (e: DragEvent<HTMLDivElement>) => {
    if (!allowDrag) return;
    e.preventDefault();
    e.stopPropagation();
    const droppedDeviceId = e.dataTransfer.getData("text/plain") as DeviceId;
    if (droppedDeviceId) onDropDevice(droppedDeviceId);
    onLeave();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isSelectMode) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClickPlace();
    }
  };

  const zoneSuffix = zoneId ? " — " + ZONE_LABEL[zoneId] + " zone" : "";
  const chipLabel = zoneControl?.currentZone
    ? ZONE_LABEL[zoneControl.currentZone].toUpperCase()
    : "SET";
  const chipAccent = zoneControl?.currentZone
    ? ZONE_ACCENT[zoneControl.currentZone]
    : "rgba(255,255,255,0.22)";

  return (
    <div
      data-testid={"dh-room-" + roomId}
      role="button"
      tabIndex={0}
      aria-label={meta.name + zoneSuffix}
      onDragOver={handleDragOver}
      onDragLeave={onLeave}
      onDrop={handleDropEvent}
      onClick={onClickPlace}
      onKeyDown={handleKeyDown}
      style={{
        position: "relative",
        overflow: "visible",
        cursor: isSelectMode ? "pointer" : "default",
        background: floor.base,
        borderRadius: 5,
        border: "2px solid " + (active ? accent : isRisky ? "#dc2626" : "rgba(139,115,85,0.55)"),
        boxShadow: active
          ? "inset 0 0 24px " + glow + ", 0 4px 12px rgba(0,0,0,0.25)"
          : isRisky
            ? "inset 0 0 18px rgba(220,38,38,0.18), 0 2px 6px rgba(0,0,0,0.2)"
            : "inset 0 2px 6px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.15)",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
        animation: isRisky ? "dh-dangerPulse 2s ease-in-out infinite" : "none",
        touchAction: "manipulation",
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: floor.overlay,
          pointerEvents: "none",
          opacity: 0.6,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: active ? medTint : softTint,
          transition: "background 0.3s",
          pointerEvents: "none",
        }}
      />

      <Furn />

      <div
        style={{
          position: "absolute",
          bottom: 5,
          left: 6,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 7px 3px 7px",
          borderRadius: 999,
          background: "rgba(15,23,42,0.78)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.45)",
          zIndex: 7,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: "0.01em",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {meta.name}
        </span>
        {zoneControl ? (
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <button
              type="button"
              data-testid={"dh-room-zone-" + roomId}
              aria-label={meta.name + " zone"}
              aria-expanded={zoneControl.locked ? undefined : zoneControl.open}
              aria-haspopup={zoneControl.locked ? undefined : "dialog"}
              disabled={zoneControl.locked}
              onClick={(e) => {
                stopBubble(e);
                if (!zoneControl.locked) zoneControl.onToggle();
              }}
              className="touch-manipulation"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                border: "1px solid transparent",
                borderColor: zoneControl.currentZone ? chipAccent : "rgba(255,255,255,0.18)",
                background: zoneControl.currentZone ? chipAccent : "rgba(255,255,255,0.06)",
                color: zoneControl.currentZone ? "#0b1120" : "#f8fafc",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.08em",
                lineHeight: 1,
                padding: "2px 6px 2px 7px",
                borderRadius: 999,
                cursor: zoneControl.locked ? "not-allowed" : "pointer",
                opacity: zoneControl.locked ? 0.92 : 1,
                touchAction: "manipulation",
                verticalAlign: "middle",
              }}
            >
              <span>{chipLabel}</span>
              {zoneControl.locked && zoneControl.showLock ? <Lock size={10} /> : null}
              {!zoneControl.locked ? <ChevronDown size={10} /> : null}
            </button>
            {!zoneControl.locked && zoneControl.open ? (
              <div
                data-testid={"dh-room-zone-popover-" + roomId}
                role="dialog"
                aria-label={meta.name + " zone options"}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: "calc(100% + 6px)",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 4,
                  width: 200,
                  maxWidth: "calc(100vw - 24px)",
                  padding: 6,
                  borderRadius: 10,
                  border: "1px solid rgba(125,211,252,0.28)",
                  background: "rgba(15,23,42,0.96)",
                  boxShadow: "0 12px 26px rgba(2,6,23,0.4)",
                  zIndex: 100,
                }}
              >
                {(["main", "guest", "iot"] as ZoneId[]).map((nextZone) => {
                  const activeZone = zoneControl.currentZone === nextZone;
                  const nextAccent = ZONE_ACCENT[nextZone];
                  return (
                    <button
                      key={nextZone}
                      type="button"
                      data-testid={"dh-room-zone-option-" + roomId + "-" + nextZone}
                      onClick={(e) => {
                        stopBubble(e);
                        zoneControl.onAssign(nextZone);
                      }}
                      style={{
                        minHeight: 26,
                        borderRadius: 7,
                        border: "1px solid " + (activeZone ? nextAccent : "rgba(148,163,184,0.22)"),
                        background: activeZone ? nextAccent : "rgba(15,23,42,0.45)",
                        color: activeZone ? "#0b1120" : "#f8fafc",
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                        touchAction: "manipulation",
                      }}
                    >
                      {ZONE_LABEL[nextZone]}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : zoneId ? (
          <span
            style={{
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: "0.1em",
              padding: "2px 6px",
              borderRadius: 999,
              background: accent,
              color: "#0b1120",
              lineHeight: 1,
            }}
          >
            {ZONE_LABEL[zoneId].toUpperCase()}
          </span>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 26,
          left: 7,
          right: 7,
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          zIndex: 4,
        }}
      >
        {devices.map((dev) => (
          <DeviceChip
            key={dev.id}
            device={dev}
            onClick={onDeviceClick}
            allowDrag={allowDrag}
            tone={zoneId ? (`zone-${zoneId}` as DeviceIconTone) : deviceTone}
            onTouchDragStart={onTouchDragStart}
          />
        ))}
      </div>

      {active && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.32)",
            backdropFilter: "blur(2px)",
            zIndex: 6,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              background: accent + "ee",
              padding: "5px 14px",
              borderRadius: 999,
              boxShadow: "0 4px 12px " + glow,
              letterSpacing: "0.02em",
            }}
          >
            Place here
          </span>
        </div>
      )}
    </div>
  );
}

type DeviceChipProps = Readonly<{
  device: Device;
  onClick?: (deviceId: DeviceId) => void;
  allowDrag?: boolean;
  tone?: DeviceIconTone;
  onTouchDragStart?: (deviceId: DeviceId, e: ReactTouchEvent) => void;
}>;

function DeviceChip({
  device,
  onClick,
  allowDrag = true,
  tone = "category",
  onTouchDragStart,
}: DeviceChipProps) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick?.(device.id);
  };

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", device.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: DragEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handleTouchStart = (e: ReactTouchEvent<HTMLButtonElement>) => {
    if (onTouchDragStart) {
      e.stopPropagation();
      // Start the touch drag directly — the ghost follows the finger and
      // dropping on a room will place it there. No need to return to tray first.
      onTouchDragStart(device.id, e);
    }
  };

  return (
    <button
      type="button"
      title={device.name}
      aria-label={device.name + (allowDrag ? " — tap or drag to move" : " — tap to move")}
      draggable={allowDrag}
      onClick={handleClick}
      onDragStart={allowDrag ? handleDragStart : undefined}
      onDragEnd={allowDrag ? handleDragEnd : undefined}
      onTouchStart={onTouchDragStart ? handleTouchStart : undefined}
      style={{
        cursor: onClick ? (allowDrag ? "grab" : "pointer") : "default",
        display: "inline-flex",
        padding: 0,
        border: "none",
        background: "transparent",
        font: "inherit",
        touchAction: "manipulation",
      }}
    >
      <DeviceIcon
        deviceId={device.id}
        category={device.category}
        size="sm"
        tone={tone}
        popOnMount
      />
    </button>
  );
}
