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
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Award,
  Flame,
  HelpCircle,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggler";
import type { Badge, Difficulty } from "../shared/types";
import { useGameShell } from "../shared/GameShell";
import { getGamePreference, setGamePreference } from "../shared/storage";
import { inventoryColumnsForRail, isCompactDesktopLayout, type ViewportBand, widthToBand } from "./layout";
import {
  DEVICES,
  ROOM_ZONE_ASSIGNMENTS,
  SCORING_INTERNALS,
  calculateScore,
  getRoom,
  type Device,
  type DeviceId,
  type DevicePlacement,
  type ScoreResult,
  type RoomId,
  type ZoneId,
} from "./engine";
import { COMBO_TIPS, DEVICE_TIPS } from "./content/deviceTips";
import { DeviceIcon, type DeviceIconTone } from "./ui/DeviceIcon";
import { RoomCell } from "./ui/RoomCell";
import { ScoreRingBar } from "./ui/ScoreRingBar";

// ---- Constants ----

type Placement = Readonly<{ roomId: RoomId; zoneId: ZoneId }>;
type PlacementMap = Record<DeviceId, Placement | null>;
type SidebarPanelView = "zones" | "inventory";
type ViewportProfile = Readonly<{
  width: number;
  height: number;
  band: ViewportBand;
  isCoarsePointer: boolean;
}>;

const HOME_NETWORK_ROOKIE: Badge = {
  id: "home-network-rookie",
  gameId: "digital-house",
  name: "Home Network Rookie",
  description: "Completed The Digital House",
  tier: "bronze",
  condition: "Place every device to finish a run",
};

const NETWORK_ARCHITECT: Badge = {
  id: "network-architect",
  gameId: "digital-house",
  name: "Network Architect",
  description: "Completed The Digital House on Hard with a score of 70+",
  tier: "gold",
  condition: "Finish Hard difficulty with an overall score of 70 or more",
};

const DIGITAL_HOUSE_GAME_ID = "digital-house";
const HELP_PREF_KEY = "hide-help-modal";

/**
 * Compact display names for the device tray. Avoids truncation in the
 * grid cards. Used only by the tray; the engine + analysis still use the
 * canonical full names from `engine/devices.ts`.
 */
const TRAY_NAME: Record<DeviceId, string> = {
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

/** Ultra-short labels for the mobile fixed toolbar (max ~5 chars). */
const TOOLBAR_LABEL: Record<DeviceId, string> = {
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

const RISKY_DEVICE_IDS = new Set<DeviceId>([
  "guest-phone",
  "smart-tv",
  "smart-speaker",
  "game-console",
  "doorbell-camera",
  "camera-hub",
]);
const TRUSTED_DEVICE_IDS = new Set<DeviceId>([
  "work-laptop",
  "personal-phone",
  "tablet",
]);

/**
 * Site-consistent glassmorphism card class — matches the hero + benefit
 * cards in src/pages/index.tsx and src/pages/awareness/index.tsx. Used as
 * the base for every chrome panel in the game so the page "belongs" on
 * wedefendit.com.
 */
const CARD =
  "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_58%)] shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-white/80 backdrop-blur-md dark:border-slate-700/70 dark:bg-slate-900/95 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_62%)] dark:shadow-[0_18px_36px_rgba(2,6,23,0.3)] dark:ring-white/5";

function emptyPlacements(): PlacementMap {
  return DEVICES.reduce((acc, d) => {
    acc[d.id] = null;
    return acc;
  }, {} as PlacementMap);
}

function nextDifficulty(current: Difficulty): Difficulty {
  if (current === "easy") return "medium";
  if (current === "medium") return "hard";
  return "hard";
}

// ---- useViewportProfile ----

function useViewportProfile(): ViewportProfile {
  const [profile, setProfile] = useState<ViewportProfile>({
    width: 0,
    height: 0,
    band: "phone",
    isCoarsePointer: false,
  });

  useEffect(() => {
    const coarseQuery = globalThis.matchMedia("(pointer: coarse)");
    const hoverQuery = globalThis.matchMedia("(hover: none)");
    const update = () => {
      const width = globalThis.innerWidth;
      const height = globalThis.innerHeight;
      setProfile({
        width,
        height,
        band: widthToBand(width),
        isCoarsePointer: coarseQuery.matches || hoverQuery.matches,
      });
    };
    const bind = (query: MediaQueryList, listener: () => void) => {
      if (typeof query.addEventListener === "function") {
        query.addEventListener("change", listener);
        return () => query.removeEventListener("change", listener);
      }
      query.addListener(listener);
      return () => query.removeListener(listener);
    };

    update();
    const unbindCoarse = bind(coarseQuery, update);
    const unbindHover = bind(hoverQuery, update);
    globalThis.addEventListener("resize", update);
    return () => {
      unbindCoarse();
      unbindHover();
      globalThis.removeEventListener("resize", update);
    };
  }, []);

  return profile;
}


// ---- Touch drag ----
//
// HTML5 drag-and-drop does not fire from touch events in mobile browsers.
// This hook implements touch-based drag using touchstart/touchmove/touchend
// and elementFromPoint to detect the drop target room.

type TouchDragState = {
  deviceId: DeviceId;
  ghost: HTMLElement;
  currentRoom: RoomId | null;
};

/**
 * Touch-based drag for mobile. Uses native addEventListener with
 * { passive: false } so we can preventDefault to stop page scroll
 * during a drag. React's onTouchStart/Move/End are passive by
 * default in modern browsers and can't preventDefault.
 */
function useTouchDrag(
  onPlace: (deviceId: DeviceId, roomId: RoomId) => void,
  onHoverRoom: (roomId: RoomId | null) => void,
) {
  const stateRef = useRef<TouchDragState | null>(null);
  const onPlaceRef = useRef(onPlace);
  const onHoverRef = useRef(onHoverRoom);
  onPlaceRef.current = onPlace;
  onHoverRef.current = onHoverRoom;

  const startDrag = useCallback((deviceId: DeviceId, originTouch: Touch) => {
    // Create a ghost element that follows the finger.
    const ghost = document.createElement("div");
    ghost.style.cssText =
      "position:fixed;z-index:9999;pointer-events:none;width:44px;height:44px;" +
      "border-radius:12px;background:rgba(56,189,248,0.85);border:2px solid #0ea5e9;" +
      "box-shadow:0 8px 24px rgba(56,189,248,0.5);display:flex;align-items:center;" +
      "justify-content:center;font-size:18px;color:#fff;font-weight:900;" +
      "transform:translate(-50%,-50%) scale(1.1);";
    ghost.textContent = "↓";
    ghost.style.left = originTouch.clientX + "px";
    ghost.style.top = originTouch.clientY + "px";
    document.body.appendChild(ghost);

    stateRef.current = { deviceId, ghost, currentRoom: null };

    const onMove = (e: TouchEvent) => {
      const state = stateRef.current;
      if (!state) return;
      const touch = e.touches[0];
      if (!touch) return;
      e.preventDefault(); // stop scroll — works because { passive: false }

      state.ghost.style.left = touch.clientX + "px";
      state.ghost.style.top = touch.clientY + "px";

      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      let roomId: RoomId | null = null;
      if (el) {
        const roomEl = el.closest("[data-testid^='dh-room-']") as HTMLElement | null;
        if (roomEl) {
          const testId = roomEl.getAttribute("data-testid") ?? "";
          const match = testId.match(/^dh-room-(.+)$/);
          if (match?.[1] && !match[1].startsWith("zone")) {
            roomId = match[1] as RoomId;
          }
        }
      }
      if (roomId !== state.currentRoom) {
        state.currentRoom = roomId;
        onHoverRef.current(roomId);
      }
    };

    const onEnd = () => {
      const state = stateRef.current;
      if (state) {
        state.ghost.remove();
        if (state.currentRoom) {
          onPlaceRef.current(state.deviceId, state.currentRoom);
        }
        onHoverRef.current(null);
        stateRef.current = null;
      }
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };

    // Attach to document with { passive: false } so preventDefault works.
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);
  }, []);

  // The component attaches onTouchStart via React (which IS passive-safe
  // for touchstart on individual elements). The touchmove/end listeners
  // go on document with { passive: false }.
  const handleTouchStart = useCallback(
    (deviceId: DeviceId, e: React.TouchEvent) => {
      const touch = e.nativeEvent.touches[0];
      if (!touch) return;
      startDrag(deviceId, touch);
    },
    [startDrag],
  );

  return { handleTouchStart };
}

// ---- Risk helper ----

function deriveRiskyRooms(placements: PlacementMap): Set<RoomId> {
  const byRoom = new Map<RoomId, DeviceId[]>();
  for (const d of DEVICES) {
    const p = placements[d.id];
    if (p?.zoneId !== "main") continue;
    const list = byRoom.get(p.roomId) ?? [];
    list.push(d.id);
    byRoom.set(p.roomId, list);
  }
  const out = new Set<RoomId>();
  for (const [roomId, ids] of byRoom) {
    const hasTrusted = ids.some((id) => TRUSTED_DEVICE_IDS.has(id));
    const hasRisky = ids.some((id) => RISKY_DEVICE_IDS.has(id));
    if (hasTrusted && hasRisky) out.add(roomId);
  }
  return out;
}

// ---- Main component ----

export function DigitalHouse() {
  const viewport = useViewportProfile();
  const mobile = viewport.band === "phone";
  const allowDrag = true;
  const {
    difficulty,
    setDifficulty,
    resetCount,
    reset: shellReset,
    recordScore,
    awardBadge,
    hasBadge,
  } = useGameShell();

  const [placements, setPlacements] = useState<PlacementMap>(emptyPlacements);
  const [selectedId, setSelectedId] = useState<DeviceId | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<RoomId | null>(null);
  const [lastPlacement, setLastPlacement] = useState<{
    deviceId: DeviceId;
    zoneId: ZoneId;
    roomId: RoomId;
  } | null>(null);
  const [showEnd, setShowEnd] = useState(false);
  const [badgeJustEarned, setBadgeJustEarned] =
    useState<"rookie" | "architect" | null>(null);
  const [userZoneOverrides, setUserZoneOverrides] = useState<
    Partial<Record<RoomId, ZoneId>>
  >({});
  const [sidebarPanelView, setSidebarPanelView] =
    useState<SidebarPanelView>("inventory");
  // Game-feel bits: floating score delta, halfway milestone, streak
  const [scoreDelta, setScoreDelta] = useState<{
    key: number;
    value: number;
  } | null>(null);
  const [halfwayShown, setHalfwayShown] = useState(false);
  const [streak, setStreak] = useState(0);
  // Single active toast slot — newest replaces previous so they never stack.
  const [activeToast, setActiveToast] = useState<{
    key: number;
    type: "halfway" | "streak";
    label: string;
    hint: string;
  } | null>(null);
  const toastKeyRef = useRef(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [trayHeight, setTrayHeight] = useState(0);
  const [openZoneRoom, setOpenZoneRoom] = useState<RoomId | null>(null);
  const [railWidth, setRailWidth] = useState(0);
  const trayRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const prevTotalRef = useRef(50);
  const deltaKeyRef = useRef(0);
  const hasRecordedRef = useRef(false);

  const preassignedZones = useMemo(
    () => ROOM_ZONE_ASSIGNMENTS[difficulty],
    [difficulty],
  );

  const roomZones: Record<RoomId, ZoneId | null> = useMemo(() => {
    const merged: Record<RoomId, ZoneId | null> = { ...preassignedZones };
    for (const [roomId, zoneId] of Object.entries(userZoneOverrides) as Array<
      [RoomId, ZoneId]
    >) {
      if (preassignedZones[roomId] === null) merged[roomId] = zoneId;
    }
    return merged;
  }, [preassignedZones, userZoneOverrides]);

  const compactDesktop = !mobile && isCompactDesktopLayout(viewport.width);
  const houseZoneControls = difficulty !== "easy";
  const hasUnassignedRoom = useMemo(
    () => Object.values(roomZones).includes(null),
    [roomZones],
  );
  const showZonesInRail = false;
  const showZoneHint = false;
  const deviceTone: DeviceIconTone = difficulty === "easy" ? "category" : "neutral";
  const guidedDeviceCards = difficulty === "easy";
  const zoneColumns: 1 | 2 =
    !mobile &&
    railWidth >= 620 &&
    (viewport.band === "wide" || viewport.band === "ultra")
      ? 2
      : 1;
  const inventoryColumns: 2 | 3 | 4 = inventoryColumnsForRail(
    viewport.width,
    railWidth,
  );

  // Reset state on shell reset / difficulty change
  useEffect(() => {
    setPlacements(emptyPlacements());
    setSelectedId(null);
    setHoveredRoom(null);
    setLastPlacement(null);
    setUserZoneOverrides({});
    setShowEnd(false);
    setBadgeJustEarned(null);
    setScoreDelta(null);
    setHalfwayShown(false);
    setStreak(0);
    setActiveToast(null);
    setOpenZoneRoom(null);
    prevTotalRef.current = 50;
    deltaKeyRef.current = 0;
    toastKeyRef.current = 0;
    hasRecordedRef.current = false;
  }, [resetCount, difficulty]);

  // Re-zone existing placements when their room's effective zone changes
  useEffect(() => {
    setPlacements((prev) => {
      let changed = false;
      const next: PlacementMap = { ...prev };
      for (const d of DEVICES) {
        const p = prev[d.id];
        if (!p) continue;
        const newZone = roomZones[p.roomId];
        if (newZone === null) {
          next[d.id] = null;
          changed = true;
        } else if (newZone !== p.zoneId) {
          next[d.id] = { roomId: p.roomId, zoneId: newZone };
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [roomZones]);

  // Scoring
  const scoringPlacements: DevicePlacement[] = useMemo(() => {
    const out: DevicePlacement[] = [];
    for (const d of DEVICES) {
      const p = placements[d.id];
      if (p) out.push({ deviceId: d.id, zoneId: p.zoneId });
    }
    return out;
  }, [placements]);
  const result = useMemo(
    () => calculateScore(scoringPlacements),
    [scoringPlacements],
  );

  const placedIds = useMemo(() => {
    const s = new Set<DeviceId>();
    for (const d of DEVICES) if (placements[d.id]) s.add(d.id);
    return s;
  }, [placements]);
  const isComplete = placedIds.size === DEVICES.length;

  const riskyRooms = useMemo(() => deriveRiskyRooms(placements), [placements]);

  const devicesByRoom = useMemo(() => {
    const m = new Map<RoomId, Device[]>();
    for (const d of DEVICES) {
      const p = placements[d.id];
      if (!p) continue;
      const list = m.get(p.roomId) ?? [];
      list.push(d);
      m.set(p.roomId, list);
    }
    return m;
  }, [placements]);

  // Map device → zone for coloring placed devices by their zone.
  const placedZones = useMemo(() => {
    const out = {} as Record<DeviceId, ZoneId | null>;
    for (const d of DEVICES) {
      const p = placements[d.id];
      out[d.id] = p ? p.zoneId : null;
    }
    return out;
  }, [placements]);

  // Game-feel: when the total changes due to a new placement, fire the
  // floating delta, check halfway milestone, and track streak of positive
  // placements. Toasts are mutually exclusive — newest replaces previous,
  // tracked via a single activeToast slot.
  useEffect(() => {
    const prev = prevTotalRef.current;
    const delta = result.total - prev;
    prevTotalRef.current = result.total;
    if (delta === 0) return;
    deltaKeyRef.current += 1;
    setScoreDelta({ key: deltaKeyRef.current, value: delta });

    const showToast = (
      type: "halfway" | "streak",
      label: string,
      hint: string,
    ) => {
      toastKeyRef.current += 1;
      setActiveToast({ key: toastKeyRef.current, type, label, hint });
    };

    // Streak tracking — consecutive positive deltas. Compute next streak
    // synchronously so we can decide which toast (if any) to fire.
    let nextStreak = 0;
    if (delta > 0) nextStreak = streak + 1;
    setStreak(nextStreak);

    // Halfway milestone — fire once per run, only on an improving placement.
    // Halfway wins over streak when both would fire on the same placement.
    if (!halfwayShown && placedIds.size === 5 && delta > 0) {
      setHalfwayShown(true);
      showToast("halfway", "Halfway there", "5 of 10 placed");
    } else if (nextStreak >= 3) {
      showToast("streak", `${nextStreak}× streak`, "Nice rhythm");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.total]);

  // Auto-dismiss the active toast after ~2.2s.
  useEffect(() => {
    if (!activeToast) return;
    const t = globalThis.setTimeout(() => setActiveToast(null), 2200);
    return () => globalThis.clearTimeout(t);
  }, [activeToast?.key]);

  // Completion: record score + badges + show end summary after a beat
  useEffect(() => {
    if (!isComplete || hasRecordedRef.current) return;
    hasRecordedRef.current = true;
    recordScore({
      score: result.total,
      difficulty,
      details: {
        privacy: result.privacy,
        blastRadius: result.blastRadius,
        recovery: result.recovery,
      },
    });
    const hadRookie = hasBadge(HOME_NETWORK_ROOKIE.id);
    awardBadge(HOME_NETWORK_ROOKIE);
    let newBadge: "rookie" | "architect" | null = null;
    if (!hadRookie) newBadge = "rookie";
    if (difficulty === "hard" && result.total >= 70) {
      const hadArch = hasBadge(NETWORK_ARCHITECT.id);
      awardBadge(NETWORK_ARCHITECT);
      if (!hadArch) newBadge = "architect";
    }
    setBadgeJustEarned(newBadge);
    const t = globalThis.setTimeout(() => setShowEnd(true), 900);
    return () => globalThis.clearTimeout(t);
  }, [
    isComplete,
    result.total,
    result.privacy,
    result.blastRadius,
    result.recovery,
    difficulty,
    recordScore,
    awardBadge,
    hasBadge,
  ]);

  // Handlers
  const placeDevice = useCallback(
    (deviceId: DeviceId, roomId: RoomId) => {
      const zoneId = roomZones[roomId];
      if (!zoneId) return;
      setPlacements((prev) => ({ ...prev, [deviceId]: { roomId, zoneId } }));
      setLastPlacement({ deviceId, zoneId, roomId });
      setSelectedId(null);
      setHoveredRoom(null);
      setOpenZoneRoom(null);
    },
    [roomZones],
  );

  const returnDevice = useCallback((deviceId: DeviceId) => {
    setPlacements((prev) => ({ ...prev, [deviceId]: null }));
    setSelectedId(deviceId);
    setLastPlacement(null);
    setOpenZoneRoom(null);
  }, []);

  const handleSelect = useCallback((deviceId: DeviceId) => {
    setSelectedId((prev) => (prev === deviceId ? null : deviceId));
    setOpenZoneRoom(null);
  }, []);

  const handleRoomClick = useCallback(
    (roomId: RoomId) => {
      if (!selectedId) return;
      placeDevice(selectedId, roomId);
    },
    [placeDevice, selectedId],
  );

  const assignZone = useCallback((roomId: RoomId, zoneId: ZoneId) => {
    setUserZoneOverrides((prev) => ({ ...prev, [roomId]: zoneId }));
    setOpenZoneRoom(null);
  }, []);

  const onTryHarder = useCallback(() => {
    setShowEnd(false);
    setDifficulty(nextDifficulty(difficulty));
  }, [difficulty, setDifficulty]);

  // Touch drag for mobile — maps touch events to device placement.
  const touchDrag = useTouchDrag(placeDevice, setHoveredRoom);

  const handleReset = useCallback(() => {
    shellReset();
  }, [shellReset]);

  useEffect(() => {
    if (showZonesInRail && hasUnassignedRoom) {
      setSidebarPanelView("zones");
    } else {
      setSidebarPanelView("inventory");
    }
  }, [showZonesInRail, hasUnassignedRoom, resetCount]);

  useEffect(() => {
    if (!mobile) {
      setTrayHeight(0);
      return;
    }
    const tray = trayRef.current;
    if (!tray) return;
    const measure = () => {
      setTrayHeight(Math.ceil(tray.getBoundingClientRect().height));
    };
    measure();
    const ro = new globalThis.ResizeObserver(measure);
    ro.observe(tray);
    return () => ro.disconnect();
  }, [mobile]);

  useEffect(() => {
    if (mobile) {
      setRailWidth(0);
      return;
    }
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => {
      setRailWidth(Math.ceil(rail.getBoundingClientRect().width));
    };
    measure();
    const ro = new globalThis.ResizeObserver(measure);
    ro.observe(rail);
    return () => ro.disconnect();
  }, [mobile, viewport.band, showZonesInRail, sidebarPanelView]);

  useEffect(() => {
    if (!houseZoneControls) setOpenZoneRoom(null);
  }, [houseZoneControls]);

  useEffect(() => {
    if (getGamePreference<boolean>(DIGITAL_HOUSE_GAME_ID, HELP_PREF_KEY) === true) {
      return;
    }
    setHelpOpen(true);
  }, []);

  const dismissHelp = useCallback((dontShowAgain: boolean) => {
    if (dontShowAgain) {
      setGamePreference(DIGITAL_HOUSE_GAME_ID, HELP_PREF_KEY, true);
    }
    setHelpOpen(false);
  }, []);

  const houseProps = {
    roomZones,
    preassignedZones,
    devicesByRoom,
    hoveredRoom,
    riskyRooms,
    isSelectMode: selectedId !== null,
    onRoomEnter: setHoveredRoom,
    onRoomLeave: () => setHoveredRoom(null),
    onRoomClick: handleRoomClick,
    onRoomDrop: (roomId: RoomId, deviceId: DeviceId) =>
      placeDevice(deviceId, roomId),
    onDeviceClickInRoom: returnDevice,
    allowDrag,
    showZoneControls: houseZoneControls,
    openZoneRoom,
    onToggleZoneRoom: (roomId: RoomId) =>
      setOpenZoneRoom((prev) => (prev === roomId ? null : roomId)),
    onAssignRoomZone: assignZone,
    deviceTone,
    onTouchDragStart: touchDrag.handleTouchStart,
  };

  const scoreHud = (
    <div className="dh-score-slot relative w-full shrink-0">
      <ScoreRingBar
        privacy={result.privacy}
        blastRadius={result.blastRadius}
        recovery={result.recovery}
        overall={result.total}
        placedCount={placedIds.size}
        totalDevices={DEVICES.length}
        mobile={mobile}
        compact
        combos={result.appliedCombos}
        comboTips={COMBO_TIPS}
      />
      <DeltaFloater delta={scoreDelta} />
    </div>
  );

  const analysisCard = (
    <div className="w-full shrink-0">
      <AnalysisToast
        lastPlacement={lastPlacement}
        result={result}
        compact
      />
    </div>
  );

  const inventoryCard = (
    <div data-testid="dh-inventory-panel" className={CARD + " flex flex-col p-3 xl:p-4"}>
      <DeviceTrayGrid
        selectedId={selectedId}
        placedIds={placedIds}
        placedZones={placedZones}
        onSelect={handleSelect}
        onReturn={returnDevice}
        layout="compact"
        allowDrag={allowDrag}
        guided={guidedDeviceCards}
        deviceTone={deviceTone}
        columns={inventoryColumns}
        framed={false}
        showHeading
        onTouchDragStart={touchDrag.handleTouchStart}
      />
      {isComplete && (
        <div className="mt-3 shrink-0">
          <AfterActionReportButton
            score={result.total}
            riskCount={result.appliedCombos.length}
            onOpen={() => setShowEnd(true)}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      data-testid="dh-root"
      className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden text-slate-950 dark:text-slate-50"
    >
      <style>{`
        @keyframes dh-popIn { 0% { transform: scale(0); opacity: 0 } 60% { transform: scale(1.2) } 100% { transform: scale(1); opacity: 1 } }
        @keyframes dh-dangerPulse { 0%, 100% { border-color: rgba(220,38,38,0.3) } 50% { border-color: rgba(220,38,38,1) } }
        @keyframes dh-slideIn { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes dh-fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes dh-staggerIn { from { transform: translateY(10px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes dh-borderPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0) } 50% { box-shadow: 0 0 0 4px rgba(56,189,248,0.18) } }
        @keyframes dh-floatUp { 0% { transform: translateY(6px); opacity: 0 } 20% { opacity: 1 } 100% { transform: translateY(-26px); opacity: 0 } }
        @keyframes dh-toastIn { 0% { transform: translate(-50%, 24px); opacity: 0 } 10% { opacity: 1 } 90% { opacity: 1 } 100% { transform: translate(-50%, -6px); opacity: 0 } }
        @keyframes dh-hintPulse { 0%, 100% { opacity: 0.65; transform: translateY(0) } 50% { opacity: 1; transform: translateY(-3px) } }
        @keyframes dh-modalRise { 0% { transform: translateY(40px) scale(0.94); opacity: 0 } 60% { transform: translateY(-4px) scale(1.02); opacity: 1 } 100% { transform: translateY(0) scale(1); opacity: 1 } }
        @keyframes dh-comboPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.0), 0 0 0 0 rgba(56,189,248,0) } 50% { box-shadow: 0 0 0 2px rgba(239,68,68,0.4), 0 0 24px rgba(239,68,68,0.15) } }
      `}</style>

      <GameHeader onOpenHelp={() => setHelpOpen(true)} />

      {mobile ? (
        /* ── PHONE (<820px) ──────────────────────────────────────
         * Natural scroll. Score → house → analysis stack top-down.
         * Fixed bottom tray. No viewport locking on the main area.
         * Every element is full-width (w-full), no fixed pixel widths.
         */
        <main
          data-testid="dh-main"
          className="dh-game-main relative flex w-full flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            paddingBottom: `calc(${Math.max(trayHeight, 132)}px + env(safe-area-inset-bottom) + 16px)`,
          }}
        >
          <div className="m-auto flex w-full flex-col gap-2 px-3 py-2">
            {scoreHud}

            <section
              data-testid="dh-house-panel"
              className="dh-house-panel relative w-full overflow-visible"
            >
              <PhoneScaledHouseFrame {...houseProps} bottomOffset={Math.max(trayHeight, 132)} />
            </section>

            <aside data-testid="dh-rail" className="dh-sidebar-panel relative w-full">
              {analysisCard}
              {isComplete && (
                <div className="mt-2">
                  <AfterActionReportButton
                    score={result.total}
                    riskCount={result.appliedCombos.length}
                    onOpen={() => setShowEnd(true)}
                  />
                </div>
              )}
            </aside>
          </div>
        </main>
      ) : (
        /* ── DESKTOP (≥820px) ────────────────────────────────────
         * Two-column layout: house left, rail right.
         * Both centered as a group. Rail scrolls inventory if needed.
         * No page scroll. Everything fits in viewport.
         */
        <main
          data-testid="dh-main"
          className="dh-game-main relative flex min-h-0 w-full flex-1 items-start justify-center overflow-hidden px-4 py-3 xl:px-6 xl:py-4"
        >
          <div data-testid="dh-status-strip" className="contents" />
          <div className="flex min-h-0 w-full max-w-[1200px] items-start gap-4 xl:gap-5" style={{ maxHeight: "100%" }}>
          <section
            data-testid="dh-house-panel"
            className="dh-house-panel relative flex min-h-0 flex-[1.4_1_0] items-center justify-center self-stretch overflow-visible p-2 xl:p-3"
          >
            <ScaledHouseFrame {...houseProps} />
          </section>

          <aside
            data-testid="dh-rail"
            ref={railRef}
            className="dh-sidebar-panel relative flex min-h-0 flex-[1_1_0] flex-col gap-3 self-stretch overflow-hidden p-1 xl:gap-4 xl:p-2"
            style={{
              minWidth: compactDesktop ? 310 : 340,
              maxWidth: viewport.band === "ultra" ? 440 : 400,
            }}
          >
            {scoreHud}
            {analysisCard}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {inventoryCard}
            </div>
          </aside>
          </div>{/* close max-w wrapper */}
        </main>
      )}

      {mobile && (
        <div
          data-testid="dh-mobile-tray"
          ref={trayRef}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-2 pt-2 shadow-[0_-8px_24px_rgba(15,23,42,0.14)] backdrop-blur-md dark:border-sky-400/15 dark:bg-slate-950/95 dark:shadow-[0_-8px_24px_rgba(2,6,23,0.55)]"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
        >
          <DeviceTrayGrid
            selectedId={selectedId}
            placedIds={placedIds}
            placedZones={placedZones}
            onSelect={handleSelect}
            onReturn={returnDevice}
            layout="toolbar"
            allowDrag
            guided={guidedDeviceCards}
            deviceTone={deviceTone}
            onTouchDragStart={touchDrag.handleTouchStart}
          />
        </div>
      )}

      {activeToast && (
        <GameToast
          key={activeToast.key}
          icon={
            activeToast.type === "halfway" ? (
              <Sparkles size={14} />
            ) : (
              <Flame size={14} />
            )
          }
          label={activeToast.label}
          hint={activeToast.hint}
          accent={activeToast.type === "halfway" ? "sky" : "amber"}
          mobile={mobile}
          bottomOffset={Math.max(trayHeight, 132) + 12}
        />
      )}

      {helpOpen && <HelpModal onDismiss={dismissHelp} />}

      {showEnd && (
        <EndSummaryModal
          result={result}
          placements={placements}
          badge={badgeJustEarned}
          canTryHarder={difficulty !== "hard"}
          currentDifficulty={difficulty}
          mobile={mobile}
          onTryAgain={() => {
            setShowEnd(false);
            handleReset();
          }}
          onTryHarder={onTryHarder}
          onDismiss={() => setShowEnd(false)}
        />
      )}
    </div>
  );
}

// ---- ScaledHouseFrame ----
//
// Measures its container via ResizeObserver and applies a CSS transform:
// scale() to the wrapped HouseFrame so the whole house fits any panel size
// while preserving furniture positioning. Drag events still hit-test
// correctly because CSS transforms honor pointer events.

// Natural pixel dimensions of HouseFrame in desktop mode (mobile=false)
// after the tightened internal gaps:
//   roof (38) + 2F (134) + beam stack (4+4) + 1F (134) + foundation (6)
//   + porch gap (5) + porch label (14) + porch (80) + porch base (4)
//   + ground gap (5) + ground line (2) ≈ 430.
const HOUSE_NATURAL_W = 480;
const HOUSE_NATURAL_H = 440;

type ScaledHouseFrameProps = Omit<HouseFrameProps, "mobile"> & {
  /** Measured tray height so we can subtract it from available viewport. */
  bottomOffset?: number;
};

function PhoneScaledHouseFrame({ bottomOffset = 132, ...props }: ScaledHouseFrameProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => {
      const width = host.getBoundingClientRect().width;
      if (width === 0) return;
      const widthScale = (width - 4) / HOUSE_NATURAL_W;
      // Constrain by viewport height so the house doesn't push score +
      // analysis off screen. Measure real elements where possible,
      // fall back to generous estimates.
      const siteNav = document.querySelector("header.w-full")?.getBoundingClientRect().height ?? 56;
      const gameHeader = document.querySelector("[data-testid='dh-header']")?.getBoundingClientRect().height ?? 44;
      const scoreEl = document.querySelector(".dh-score-slot")?.getBoundingClientRect().height ?? 90;
      const analysisEl = document.querySelector(".dh-analysis-card")?.getBoundingClientRect().height ?? 56;
      const gaps = 36;
      const reserved = siteNav + gameHeader + scoreEl + analysisEl + bottomOffset + gaps;
      const maxH = globalThis.innerHeight - reserved;
      const heightScale = maxH > 100 ? maxH / HOUSE_NATURAL_H : 1;
      const nextScale = Math.max(0.36, Math.min(1.48, widthScale, heightScale));
      setScale(nextScale);
    };
    measure();
    const ro = new globalThis.ResizeObserver(measure);
    ro.observe(host);
    globalThis.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      globalThis.removeEventListener("resize", measure);
    };
  }, [bottomOffset]);

  return (
    <div
      ref={hostRef}
      className="relative mx-auto w-full overflow-visible"
      style={{ height: Math.ceil(HOUSE_NATURAL_H * scale) }}
    >
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: HOUSE_NATURAL_W,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <HouseFrame mobile={false} {...props} />
      </div>
    </div>
  );
}

function ScaledHouseFrame(props: ScaledHouseFrameProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0) return;
      // Desktop: scale by WIDTH only. The house panel stretches
      // vertically via flex layout — no circular height dependency.
      // The viewport height cap prevents the house from being taller
      // than the available space below the header.
      const widthScale = (rect.width - 8) / HOUSE_NATURAL_W;
      const headerHeight = 70; // header + gap
      const availHeight = globalThis.innerHeight - headerHeight;
      const heightCap = availHeight / HOUSE_NATURAL_H;
      const fitScale = Math.min(widthScale, heightCap);
      setScale(Math.max(0.5, Math.min(1.58, fitScale)));
    };
    measure();
    const ro = new globalThis.ResizeObserver(measure);
    ro.observe(host);
    globalThis.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      globalThis.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative mx-auto w-full overflow-visible"
      style={{ height: Math.ceil(HOUSE_NATURAL_H * scale) }}
    >
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: HOUSE_NATURAL_W,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <HouseFrame mobile={false} {...props} />
      </div>
    </div>
  );
}

// ---- GameHeader ----
//
// Thin top bar that owns the site-consistent game chrome: title,
// difficulty picker, reset, help button. GameShell is in "headless" mode
// for this page, so this header replaces the default GameShell card header.

type GameHeaderProps = Readonly<{
  onOpenHelp: () => void;
}>;

function GameHeader({ onOpenHelp }: GameHeaderProps) {
  const { difficulty, setDifficulty, reset } = useGameShell();
  const levels: ReadonlyArray<{ id: Difficulty; label: string; short: string }> = [
    { id: "easy", label: "Easy", short: "Easy" },
    { id: "medium", label: "Medium", short: "Med" },
    { id: "hard", label: "Hard", short: "Hard" },
  ];
  const controlButton =
    "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/70 bg-white/80 text-slate-600 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-100";

  return (
    <header
      data-testid="dh-header"
      className="relative z-10 w-full shrink-0 overflow-hidden border-b border-slate-200/70 bg-white/85 px-2 py-2 backdrop-blur-md min-[820px]:px-6 min-[820px]:py-3 dark:border-slate-800/70 dark:bg-slate-950/85"
    >
      <div className="flex items-center justify-between gap-1.5 min-[820px]:grid min-[820px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[820px]:gap-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <h1 className="shrink truncate text-[13px] font-bold leading-none text-slate-900 min-[400px]:text-[14px] min-[820px]:text-[17px] dark:text-slate-50">
            Digital House
          </h1>
          {/* Difficulty picker — inline with the title on ALL breakpoints */}
          <div
            role="radiogroup"
            aria-label="Difficulty"
            className="inline-flex items-center rounded-full border border-slate-300/70 bg-white/80 p-0.5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
          >
            {levels.map((lvl) => {
              const active = difficulty === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setDifficulty(lvl.id)}
                  className={[
                    "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider transition-colors min-[400px]:px-2.5 min-[400px]:py-1 min-[400px]:text-[9px] min-[820px]:px-3 min-[820px]:py-1.5 min-[820px]:text-[11px]",
                    active
                      ? "bg-sky-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100",
                  ].join(" ")}
                >
                  {lvl.short}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 min-[820px]:hidden">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset game"
            className={controlButton}
            style={{ height: 28, width: 28 }}
            title="Reset"
          >
            <RotateCcw size={12} />
          </button>
          <ThemeToggle placement="inline" />
          <button
            type="button"
            onClick={onOpenHelp}
            aria-label="How to play"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/10 text-sky-700 shadow-sm transition-colors hover:border-sky-500 hover:bg-sky-500/20 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:border-sky-400 dark:hover:bg-sky-500/20"
            title="How to play"
          >
            <HelpCircle size={12} />
          </button>
        </div>

        <div className="hidden items-center justify-end gap-2 min-[820px]:flex">
          <button
            type="button"
            onClick={reset}
            aria-label="Reset game"
            className={controlButton}
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
          <ThemeToggle placement="inline" />
          <button
            type="button"
            onClick={onOpenHelp}
            aria-label="How to play"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/40 bg-sky-500/10 text-sky-700 shadow-sm transition-colors hover:border-sky-500 hover:bg-sky-500/20 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:border-sky-400 dark:hover:bg-sky-500/20"
            title="How to play"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ---- HelpModal ----

type HelpModalProps = Readonly<{
  onDismiss: (dontShowAgain: boolean) => void;
}>;

function HelpModal({ onDismiss }: HelpModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss(false);
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div
      style={{ animation: "dh-fadeIn 0.25s ease" }}
      className="fixed inset-0 z-95 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
    >
      <button
        type="button"
        aria-label="Close help"
        onClick={() => onDismiss(false)}
        className="absolute inset-0 z-0 h-full w-full cursor-default touch-manipulation bg-transparent"
        style={{ touchAction: "manipulation" }}
        tabIndex={-1}
      />
      <div
        data-testid="dh-help-modal"
        role="dialog"
        aria-modal="true"
        aria-label="How to play"
        style={{ animation: "dh-modalRise 0.5s cubic-bezier(0.22,1.2,0.36,1)" }}
        className="relative z-10 max-h-[calc(100dvh-24px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/96 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_58%)] p-5 text-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.18)] ring-1 ring-white/90 sm:p-7 dark:border-sky-400/25 dark:bg-slate-900/96 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_58%)] dark:text-slate-100 dark:shadow-[0_30px_80px_rgba(2,6,23,0.6)] dark:ring-white/5"
      >
        <button
          type="button"
          onClick={() => onDismiss(false)}
          aria-label="Close"
          className="absolute right-3 top-3 touch-manipulation rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          style={{ touchAction: "manipulation" }}
        >
          <X size={16} />
        </button>

        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/40 bg-sky-50/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-400/25 dark:bg-slate-900/70 dark:text-sky-300">
            <HelpCircle size={11} /> How to Play
          </div>
          <h2 className="mt-2 text-xl font-bold text-slate-950 dark:text-white">
            The Digital House
          </h2>
        </div>

        <div className="space-y-2 text-[13px] leading-relaxed text-slate-700 dark:text-slate-200">
          <p>
            Drag a device into a room to place it. On touch, you can also tap a
            device and then tap a room. The board updates in real time so you can
            feel how trust, exposure, and recovery shift.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            On Medium and Hard, use the room chips to set Main, Guest, or IoT.
            Locked chips stay fixed. Drag a placed device to another room, or tap
            it again to move it on touch.
          </p>
        </div>

        <div className="mt-5">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
            Network Zones
          </div>
          <ul className="space-y-1.5 text-[12px] text-slate-700 dark:text-slate-200">
            <li className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: "#38bdf8" }}
              />
              <span>
                <strong className="text-slate-900 dark:text-slate-100">Main</strong> — your trusted everyday devices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: "#fbbf24" }}
              />
              <span>
                <strong className="text-slate-900 dark:text-slate-100">Guest</strong> — visitors and short-term devices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: "#a78bfa" }}
              />
              <span>
                <strong className="text-slate-900 dark:text-slate-100">IoT</strong> — smart devices that should stay contained.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200/80 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700/70">
          <label className="flex items-center gap-2 text-[12px] font-medium text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.currentTarget.checked)}
              className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400"
            />
            <span>Don't show again</span>
          </label>
          <button
            type="button"
            onClick={() => onDismiss(dontShowAgain)}
            className="inline-flex touch-manipulation items-center justify-center rounded-xl border border-sky-400/40 bg-sky-500/12 px-4 py-2 text-sm font-bold text-sky-700 transition-colors hover:bg-sky-500/18 dark:border-sky-400/25 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
            style={{ touchAction: "manipulation" }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- HouseFrame ----

type HouseFrameProps = Readonly<{
  mobile: boolean;
  roomZones: Record<RoomId, ZoneId | null>;
  preassignedZones: Record<RoomId, ZoneId | null>;
  devicesByRoom: Map<RoomId, Device[]>;
  hoveredRoom: RoomId | null;
  riskyRooms: Set<RoomId>;
  isSelectMode: boolean;
  onRoomEnter: (roomId: RoomId) => void;
  onRoomLeave: () => void;
  onRoomClick: (roomId: RoomId) => void;
  onRoomDrop: (roomId: RoomId, deviceId: DeviceId) => void;
  onDeviceClickInRoom: (deviceId: DeviceId) => void;
  allowDrag: boolean;
  showZoneControls: boolean;
  openZoneRoom: RoomId | null;
  onToggleZoneRoom: (roomId: RoomId) => void;
  onAssignRoomZone: (roomId: RoomId, zoneId: ZoneId) => void;
  deviceTone: DeviceIconTone;
  onTouchDragStart?: (deviceId: DeviceId, e: React.TouchEvent) => void;
}>;

function HouseFrame({
  roomZones,
  preassignedZones,
  devicesByRoom,
  hoveredRoom,
  riskyRooms,
  isSelectMode,
  onRoomEnter,
  onRoomLeave,
  onRoomClick,
  onRoomDrop,
  onDeviceClickInRoom,
  allowDrag,
  showZoneControls,
  openZoneRoom,
  onToggleZoneRoom,
  onAssignRoomZone,
  deviceTone,
  onTouchDragStart,
}: HouseFrameProps) {
  const roomHeight = 134;
  const porchHeight = 80;
  const maxWidth = 480;

  const cellProps = (roomId: RoomId, height: number) => ({
    roomId,
    zoneId: roomZones[roomId],
    devices: devicesByRoom.get(roomId) ?? [],
    isHover: hoveredRoom === roomId,
    isRisky: riskyRooms.has(roomId),
    isSelectMode,
    style: { height },
    onEnter: () => onRoomEnter(roomId),
    onLeave: onRoomLeave,
    onClickPlace: () => onRoomClick(roomId),
    onDropDevice: (deviceId: DeviceId) => onRoomDrop(roomId, deviceId),
    onDeviceClick: onDeviceClickInRoom,
    allowDrag,
    deviceTone,
    onTouchDragStart,
    zoneControl: showZoneControls
      ? {
          currentZone: roomZones[roomId],
          locked: preassignedZones[roomId] !== null,
          showLock: preassignedZones[roomId] !== null,
          open: openZoneRoom === roomId,
          onToggle: () => onToggleZoneRoom(roomId),
          onAssign: (zoneId: ZoneId) => onAssignRoomZone(roomId, zoneId),
        }
      : undefined,
  });

  return (
    <div className="flex w-full flex-col items-center">
      <div style={{ width: "100%", maxWidth, position: "relative", marginBottom: -2 }}>
        <div
          aria-hidden
          style={{
            height: 0,
            margin: "0 -10px",
            borderLeft: "40px solid transparent",
            borderRight: "40px solid transparent",
            borderBottom: `38px solid`,
            borderBottomColor: "#4a5568",
            filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.35))",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "22%",
            bottom: 0,
            width: 20,
            height: 30,
            background: "linear-gradient(180deg,#6b5744,#5d4a38)",
            borderRadius: "3px 3px 0 0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -3,
              left: -2,
              right: -2,
              height: 4,
              background: "#4a3c30",
              borderRadius: 2,
            }}
          />
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth,
          background: "linear-gradient(180deg,#7a6450,#6b5744)",
          padding: 3,
          borderRadius: "0 0 6px 6px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <RoomCell {...cellProps("office", roomHeight)} />
          <RoomCell {...cellProps("bedroom", roomHeight)} />
        </div>

        <div
          aria-hidden
          style={{
            height: 4,
            background:
              "linear-gradient(180deg,#5d4a38 0%,#4a3c30 50%,#3d3226 100%)",
            marginBottom: 2,
            borderRadius: 1,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          <RoomCell {...cellProps("living-room", roomHeight)} />
          <RoomCell {...cellProps("kitchen", roomHeight)} />
        </div>
      </div>

      <div
        aria-hidden
        style={{
          width: "100%",
          maxWidth,
          height: 6,
          background: "linear-gradient(to bottom,#3d3228,#2e261f)",
          borderRadius: "0 0 6px 6px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
        }}
      />

      <div style={{ width: "100%", maxWidth, marginTop: 5 }}>
        <div
          style={{
            fontSize: 8,
            fontWeight: 800,
            color: "#64748b",
            letterSpacing: "0.14em",
            marginBottom: 2,
            textAlign: "center",
          }}
          className="opacity-70"
        >
          EXTERIOR · FRONT PORCH
        </div>
        <RoomCell {...cellProps("entry-exterior", porchHeight)} />
        <div
          aria-hidden
          style={{
            height: 4,
            background: "linear-gradient(to bottom,#4a5040,#3d4438)",
            borderRadius: "0 0 4px 4px",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
      </div>

      <div
        aria-hidden
        style={{
          width: "100%",
          maxWidth,
          height: 2,
          marginTop: 5,
          background:
            "linear-gradient(90deg,transparent,#334155,#334155,transparent)",
          borderRadius: 1,
          opacity: 0.5,
        }}
      />
    </div>
  );
}

// ---- AnalysisToast ----

type AnalysisTone = "good" | "bad" | "neutral";

function placementTone(deviceId: DeviceId, zoneId: ZoneId): AnalysisTone {
  const delta = SCORING_INTERNALS.BASE_MATRIX[deviceId]?.[zoneId];
  if (!delta) return "neutral";
  if (delta.privacy >= 6) return "good";
  if (delta.privacy <= -6) return "bad";
  return "neutral";
}

const TONE_STYLES: Record<
  AnalysisTone,
  { border: string; dot: string; headline: string }
> = {
  good: {
    border:
      "border-emerald-300/70 ring-emerald-200/40 dark:border-emerald-400/25 dark:ring-emerald-500/15",
    dot: "bg-emerald-400",
    headline: "text-emerald-700 dark:text-emerald-300",
  },
  bad: {
    border:
      "border-rose-300/70 ring-rose-200/40 dark:border-rose-400/25 dark:ring-rose-500/15",
    dot: "bg-rose-400",
    headline: "text-rose-700 dark:text-rose-300",
  },
  neutral: {
    border:
      "border-slate-200/80 ring-white/70 dark:border-slate-700/70 dark:ring-white/5",
    dot: "bg-sky-400",
    headline: "text-sky-700 dark:text-sky-300",
  },
};

type AnalysisToastProps = Readonly<{
  lastPlacement: { deviceId: DeviceId; zoneId: ZoneId; roomId: RoomId } | null;
  result: ScoreResult;
  /** Compact = 1-2 line strip for tight sidebars + mobile bottom. */
  compact?: boolean;
}>;

function AnalysisToast({
  lastPlacement,
  result: _result,
  compact = false,
}: AnalysisToastProps) {
  if (!lastPlacement) {
    return (
      <div
        data-testid="dh-analysis-card"
        className={[
          "dh-analysis-card relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/60 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.04),transparent_58%)] text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.06)] ring-1 ring-white/70 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/50 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.07),transparent_62%)] dark:text-slate-300 dark:shadow-[0_14px_28px_rgba(2,6,23,0.28)] dark:ring-white/5",
          compact
            ? "min-h-12 px-3.5 py-2.5 min-[820px]:min-h-[68px] min-[820px]:px-5 min-[820px]:py-4"
            : "px-4 py-3",
        ].join(" ")}
      >
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 min-[820px]:gap-3">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400"
            />
            <span className="shrink-0 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-sky-700 min-[820px]:text-[11px] dark:text-sky-300">
              Live Analysis
            </span>
          </span>
          <span
            className="min-w-0 text-[12px] leading-snug text-slate-600 min-[820px]:text-[15px] xl:text-[14px] dark:text-slate-300"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: compact ? 2 : 3,
            }}
          >
            Pick a device to begin.
          </span>
        </div>
      </div>
    );
  }
  const device = DEVICES.find((d) => d.id === lastPlacement.deviceId);
  const room = getRoom(lastPlacement.roomId);
  const tip = DEVICE_TIPS[lastPlacement.deviceId][lastPlacement.zoneId];
  if (!device || !room) return null;
  const headerLabel = `${device.name} -> ${room.name}`;
  const tone = placementTone(lastPlacement.deviceId, lastPlacement.zoneId);
  const toneStyles = TONE_STYLES[tone];
  if (compact) {
    return (
      <div
        data-testid="dh-analysis-card"
        key={`${lastPlacement.deviceId}-${lastPlacement.roomId}`}
        style={{ animation: "dh-slideIn 0.3s ease" }}
        className={[
          "dh-analysis-card relative min-h-12 overflow-hidden rounded-2xl border bg-white/95 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.06),transparent_58%)] px-3.5 py-2.5 shadow-[0_10px_22px_rgba(15,23,42,0.08)] ring-1 backdrop-blur-md min-[820px]:min-h-[68px] min-[820px]:px-5 min-[820px]:py-4 dark:bg-slate-900/95 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_62%)] dark:shadow-[0_14px_28px_rgba(2,6,23,0.3)]",
          toneStyles.border,
        ].join(" ")}
      >
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 min-[820px]:gap-3">
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden
              className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full min-[820px]:h-2 min-[820px]:w-2 ${toneStyles.dot}`}
            />
            <span
              className={`max-w-[8rem] shrink-0 truncate text-[10px] font-black uppercase tracking-[0.12em] min-[820px]:text-[11px] ${toneStyles.headline}`}
            >
              {device.name}
            </span>
          </span>
          <span
            className="min-w-0 text-[12px] leading-snug text-slate-700 min-[820px]:text-[15px] xl:text-[14px] dark:text-slate-200"
          >
            {tip}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div
      key={`${lastPlacement.deviceId}-${lastPlacement.roomId}`}
      style={{ animation: "dh-slideIn 0.3s ease" }}
      className={[
        "relative overflow-hidden rounded-2xl border bg-white/75 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.05),transparent_58%)] px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)] ring-1 backdrop-blur-md dark:bg-slate-900/62 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.09),transparent_62%)] dark:shadow-[0_16px_32px_rgba(2,6,23,0.3)]",
        toneStyles.border,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <DeviceIcon
          deviceId={device.id}
          category={device.category}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={`inline-block h-1.5 w-1.5 rounded-full ${toneStyles.dot}`}
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Live Analysis
            </span>
          </div>
          <div
            className={`mt-1 text-[11px] font-bold uppercase tracking-wider ${toneStyles.headline}`}
          >
            {headerLabel}
          </div>
          <div className="mt-1 text-[13px] leading-snug text-slate-700 dark:text-slate-200">
            {tip}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- DeviceTrayGrid ----

type DeviceTrayGridProps = Readonly<{
  selectedId: DeviceId | null;
  placedIds: ReadonlySet<DeviceId>;
  placedZones?: Record<DeviceId, ZoneId | null>;
  onSelect: (deviceId: DeviceId) => void;
  onReturn: (deviceId: DeviceId) => void;
  layout: "toolbar" | "compact";
  allowDrag: boolean;
  guided: boolean;
  deviceTone: DeviceIconTone;
  columns?: 1 | 2 | 3 | 4;
  framed?: boolean;
  showHeading?: boolean;
  /** Touch drag start — move/end are handled at document level with
   *  { passive: false } so preventDefault stops scroll. */
  onTouchDragStart?: (deviceId: DeviceId, e: React.TouchEvent) => void;
}>;

// Category accent colors for each device card's edge/border.
const CATEGORY_EDGE: Record<Device["category"], string> = {
  trusted: "#38bdf8",
  guest: "#fbbf24",
  "gray-area": "#94a3b8",
  entertainment: "#a78bfa",
  camera: "#f87171",
};

function DeviceTrayGrid({
  selectedId,
  placedIds,
  placedZones,
  onSelect,
  onReturn,
  layout,
  allowDrag,
  guided,
  deviceTone,
  columns = 2,
  framed = true,
  showHeading = true,
  onTouchDragStart,
}: DeviceTrayGridProps) {
  /** Compute tone for a device: if placed and we have zone info, use zone color.
   *  Otherwise fall back to the grid-level deviceTone. */
  const toneFor = (deviceId: DeviceId, isPlaced: boolean): DeviceIconTone => {
    if (isPlaced && placedZones) {
      const zone = placedZones[deviceId];
      if (zone) return `zone-${zone}` as DeviceIconTone;
    }
    return deviceTone;
  };
  const handleDragStart = (e: DragEvent<HTMLElement>, d: DeviceId) => {
    if (!allowDrag) return;
    e.dataTransfer.setData("text/plain", d);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleCardKeyDown = (
    e: React.KeyboardEvent<HTMLElement>,
    d: DeviceId,
    isPlaced: boolean,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isPlaced) onReturn(d);
      else onSelect(d);
    }
  };

  if (layout === "toolbar") {
    return (
      <div>
        <div className="grid grid-cols-5 justify-items-center gap-1.5">
          {DEVICES.map((device) => {
            const isPlaced = placedIds.has(device.id);
            const isSelected = selectedId === device.id;
            const edgeColor = CATEGORY_EDGE[device.category];
            const borderColor = guided
              ? edgeColor
              : isSelected
                ? "#38bdf8"
                : "rgba(148,163,184,0.42)";
            return (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/prefer-tag-over-role, jsx-a11y/no-noninteractive-tabindex
              <div
                role="button"
                tabIndex={0}
                data-testid={"dh-device-" + device.id}
                key={device.id}
                draggable={allowDrag && isPlaced === false}
                onDragStart={(e) => handleDragStart(e as unknown as DragEvent<HTMLElement>, device.id)}
                onClick={() =>
                  isPlaced ? onReturn(device.id) : onSelect(device.id)
                }
                onKeyDown={(e) =>
                  handleCardKeyDown(e, device.id, isPlaced)
                }
                onTouchStart={
                  !isPlaced && onTouchDragStart
                    ? (e) => onTouchDragStart(device.id, e)
                    : undefined
                }
                aria-pressed={isSelected}
                aria-label={device.name}
                title={device.name}
                className={[
                  "touch-manipulation flex flex-col items-center justify-center gap-0.5 rounded-lg border bg-white/90 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all dark:bg-slate-900/80 dark:shadow-none",
                  isSelected
                    ? "scale-[1.04] shadow-[0_0_18px_rgba(56,189,248,0.35)] ring-1 ring-sky-300/80 dark:shadow-[0_0_18px_rgba(56,189,248,0.45)] dark:ring-sky-300/70"
                    : isPlaced
                      ? "cursor-pointer opacity-40"
                      : "cursor-pointer hover:bg-slate-100/90 dark:hover:bg-slate-800/90",
                ].join(" ")}
                style={{
                  borderColor,
                  height: "clamp(44px, 14.4vw, 52px)",
                  width: "clamp(44px, 14.4vw, 52px)",
                  touchAction: "manipulation",
                }}
              >
                <DeviceIcon
                  deviceId={device.id}
                  category={device.category}
                  size="tile"
                  tone={toneFor(device.id, isPlaced)}
                  className={isPlaced ? "opacity-75" : ""}
                />
                <span
                  className={[
                    "text-[8px] font-bold leading-none",
                    isPlaced
                      ? "text-slate-500 dark:text-slate-500"
                      : "text-slate-700 dark:text-slate-100",
                  ].join(" ")}
                >
                  {TOOLBAR_LABEL[device.id]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const inventoryContent = (
    <>
      {showHeading && (
        <div className="dh-inventory-heading mb-1 flex items-center gap-2 min-[820px]:mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700 min-[820px]:text-[12px] xl:text-[11px] dark:text-slate-300">
            Inventory
          </span>
          {placedIds.size > 0 && (
            <span className="text-[10px] font-semibold text-sky-700 min-[820px]:text-[12px] xl:text-[11px] dark:text-sky-300">
              {10 - placedIds.size} left
            </span>
          )}
        </div>
      )}
      <div
        data-testid="dh-inventory-grid"
        className="dh-inventory-grid grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {DEVICES.map((device) => {
          const isPlaced = placedIds.has(device.id);
          const isSelected = selectedId === device.id;
          const edgeColor = CATEGORY_EDGE[device.category];
          const displayName = TRAY_NAME[device.id];
          const borderColor = guided
            ? edgeColor
            : isSelected
              ? "#38bdf8"
              : "rgba(148,163,184,0.3)";
          return (
            <button
              type="button"
              data-testid={"dh-device-" + device.id}
              key={device.id}
              draggable={allowDrag && isPlaced === false}
              onDragStart={(e) => handleDragStart(e, device.id)}
              onClick={() =>
                isPlaced ? onReturn(device.id) : onSelect(device.id)
              }
              onKeyDown={(e) =>
                handleCardKeyDown(e, device.id, isPlaced)
              }
              onTouchStart={
                !isPlaced && onTouchDragStart
                  ? (e) => onTouchDragStart(device.id, e)
                  : undefined
              }
              aria-pressed={isSelected}
              aria-label={displayName}
              style={{
                borderLeftColor: borderColor,
                borderLeftWidth: guided ? 3 : 2,
                height: "clamp(50px, 4vw, 56px)",
                gridTemplateColumns: "32px minmax(0, 1fr)",
                touchAction: "manipulation",
              }}
              className={[
                "dh-inventory-card touch-manipulation grid items-center gap-2 overflow-hidden rounded-lg border pl-1.5 pr-2 transition-all",
                isSelected
                  ? "border-sky-400 bg-sky-50/90 ring-1 ring-sky-300/60 dark:border-sky-400 dark:bg-sky-950/60 dark:ring-sky-500/40"
                  : isPlaced
                    ? "cursor-pointer border-slate-200/70 bg-slate-100/55 opacity-60 dark:border-slate-700/60 dark:bg-slate-800/40"
                    : allowDrag
                      ? "cursor-grab border-slate-200/80 bg-white/84 hover:border-sky-300/80 active:cursor-grabbing dark:border-slate-700/70 dark:bg-slate-900/60 dark:hover:border-sky-400/40"
                      : "cursor-pointer border-slate-200/80 bg-white/84 hover:border-sky-300/80 dark:border-slate-700/70 dark:bg-slate-900/60 dark:hover:border-sky-400/40",
              ].join(" ")}
            >
              <DeviceIcon
                deviceId={device.id}
                category={device.category}
                size="tile"
                tone={toneFor(device.id, isPlaced)}
                className={isPlaced ? "opacity-75" : ""}
              />
              <span
                className={[
                  "min-w-0 truncate text-left text-[11px] font-semibold leading-tight",
                  isPlaced
                    ? "text-slate-500 dark:text-slate-400"
                    : "text-slate-900 dark:text-slate-50",
                ].join(" ")}
              >
                {displayName}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );

  if (!framed) {
    return <div className="dh-inventory-panel">{inventoryContent}</div>;
  }

  return (
    <div className={CARD + " dh-inventory-panel p-2 min-[820px]:p-2.5"}>
      {inventoryContent}
    </div>
  );
}

// ---- SidebarTaskPanel ----

type SidebarTaskPanelProps = Readonly<{
  activeView: SidebarPanelView;
  showZones: boolean;
  effectiveZones: Record<RoomId, ZoneId | null>;
  preassignedZones: Record<RoomId, ZoneId | null>;
  selectedId: DeviceId | null;
  placedIds: ReadonlySet<DeviceId>;
  zoneColumns: 1 | 2;
  inventoryColumns: 2 | 3 | 4;
  allowDrag: boolean;
  guided: boolean;
  deviceTone: DeviceIconTone;
  onAssignZone: (roomId: RoomId, zoneId: ZoneId) => void;
  onReturn: (deviceId: DeviceId) => void;
  onSelect: (deviceId: DeviceId) => void;
  onViewChange: (view: SidebarPanelView) => void;
}>;

function SidebarTaskPanel({
  activeView,
  showZones,
  effectiveZones,
  preassignedZones,
  selectedId,
  placedIds,
  zoneColumns,
  inventoryColumns,
  allowDrag,
  guided,
  deviceTone,
  onAssignZone,
  onReturn,
  onSelect,
  onViewChange,
}: SidebarTaskPanelProps) {
  const view = showZones ? activeView : "inventory";
  const tabBase =
    "flex-1 rounded-md border px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition-colors";
  const tabActive =
    "border-sky-400 bg-sky-500 text-white shadow-[0_0_16px_rgba(56,189,248,0.28)]";
  const tabInactive =
    "border-slate-300/70 bg-white/60 text-slate-600 hover:border-sky-400 hover:text-sky-700 dark:border-sky-900/50 dark:bg-slate-950/30 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-200";

  return (
    <div data-testid="dh-task-panel" className={CARD + " dh-task-panel p-2 min-[820px]:p-2.5"}>
      {showZones && (
        <div className="mb-2 flex gap-1.5">
          <button
            type="button"
            onClick={() => onViewChange("zones")}
            className={[tabBase, view === "zones" ? tabActive : tabInactive].join(" ")}
          >
            Room Zones
          </button>
          <button
            type="button"
            onClick={() => onViewChange("inventory")}
            className={[
              tabBase,
              view === "inventory" ? tabActive : tabInactive,
            ].join(" ")}
          >
            Inventory
          </button>
        </div>
      )}

      {view === "zones" ? (
        <ZoneAssignerInline
          effectiveZones={effectiveZones}
          preassignedZones={preassignedZones}
          onAssign={onAssignZone}
          framed={false}
          showHeading={false}
          columns={zoneColumns}
        />
      ) : (
        <DeviceTrayGrid
          selectedId={selectedId}
          placedIds={placedIds}
          onSelect={onSelect}
          onReturn={onReturn}
          layout="compact"
          allowDrag={allowDrag}
          guided={guided}
          deviceTone={deviceTone}
          columns={inventoryColumns}
          framed={false}
          showHeading={!showZones}
        />
      )}
    </div>
  );
}

// ---- ZoneAssignerInline ----

type ZoneAssignerInlineProps = Readonly<{
  effectiveZones: Record<RoomId, ZoneId | null>;
  preassignedZones: Record<RoomId, ZoneId | null>;
  onAssign: (roomId: RoomId, zoneId: ZoneId) => void;
  columns?: 1 | 2;
  framed?: boolean;
  showHeading?: boolean;
}>;

const ZONE_BUTTONS: ReadonlyArray<{
  id: ZoneId;
  label: string;
  active: string;
  inactive: string;
}> = [
  {
    id: "main",
    label: "Main",
    active: "bg-sky-500 text-white border-sky-600",
    inactive:
      "border-slate-300 text-slate-700 hover:border-sky-400 hover:text-sky-800 dark:border-sky-900/40 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:text-sky-200",
  },
  {
    id: "guest",
    label: "Guest",
    active: "bg-amber-500 text-white border-amber-600",
    inactive:
      "border-slate-300 text-slate-700 hover:border-amber-400 hover:text-amber-800 dark:border-sky-900/40 dark:text-slate-200 dark:hover:border-amber-500 dark:hover:text-amber-200",
  },
  {
    id: "iot",
    label: "IoT",
    active: "bg-violet-500 text-white border-violet-600",
    inactive:
      "border-slate-300 text-slate-700 hover:border-violet-400 hover:text-violet-800 dark:border-sky-900/40 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:text-violet-200",
  },
];

function ZoneAssignerInline({
  effectiveZones,
  preassignedZones,
  onAssign,
  columns = 1,
  framed = true,
  showHeading = true,
}: ZoneAssignerInlineProps) {
  const zoneContent = (
    <>
      {showHeading && (
        <div className="dh-zone-heading mb-2 flex items-center gap-2 min-[820px]:mb-3 xl:mb-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700 min-[820px]:text-[13px] dark:text-slate-200">
            Room Zones
          </span>
          <span
            aria-hidden
            className="h-px flex-1 bg-slate-200/80 dark:bg-slate-700/60"
          />
        </div>
      )}
      <ul
        className="dh-zone-list grid gap-2.5 min-[820px]:gap-3"
        style={{
          gridTemplateColumns:
            columns === 2 ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
        }}
      >
        {(Object.keys(effectiveZones) as RoomId[]).map((roomId) => {
          const current = effectiveZones[roomId];
          const locked = preassignedZones[roomId] !== null;
          return (
            <li
              data-testid={`dh-zone-room-${roomId}`}
              key={roomId}
              className="dh-zone-room rounded-lg border border-slate-200/70 bg-white/88 p-2.5 min-[820px]:p-3 dark:border-sky-800/70 dark:bg-slate-900/85"
            >
              <div className="dh-zone-room-header mb-1.5 flex items-center justify-between min-[820px]:mb-2">
                <span className="text-[12px] font-bold text-slate-900 min-[820px]:text-[14px] dark:text-slate-50">
                  {getRoom(roomId).name}
                </span>
                {locked && (
                  <span className="text-[9px] uppercase tracking-wide text-slate-600 min-[820px]:text-[10px] dark:text-slate-300">
                    Locked
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {ZONE_BUTTONS.map((btn) => {
                  const active = current === btn.id;
                  const disabled = locked && !active;
                  return (
                    <button
                      key={btn.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => onAssign(roomId, btn.id)}
                      className={[
                        "dh-zone-button rounded-md border px-2 py-1.5 text-[11px] font-black transition-colors min-[820px]:px-3 min-[820px]:py-2 min-[820px]:text-[12px]",
                        active ? btn.active : btn.inactive,
                        disabled ? "cursor-not-allowed opacity-65" : "",
                      ].join(" ")}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );

  if (!framed) {
    return <div data-testid="dh-zone-panel" className="dh-zone-panel">{zoneContent}</div>;
  }

  return (
    <div data-testid="dh-zone-panel" className={CARD + " dh-zone-panel p-3 min-[820px]:p-4 xl:p-4"}>
      {zoneContent}
    </div>
  );
}

function ZoneHintCard() {
  return (
    <div className={CARD + " rounded-2xl p-3 min-[820px]:p-3.5"}>
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
        Room Zones
      </div>
      <p className="mt-1 text-[12px] leading-snug text-slate-700 dark:text-slate-200">
        Tap a room zone chip on the house to choose Main, Guest, or IoT.
        Locked rooms stay preset.
      </p>
    </div>
  );
}

// ---- AfterActionReportButton ----

type AfterActionReportButtonProps = Readonly<{
  score: number;
  riskCount: number;
  onOpen: () => void;
}>;

function AfterActionReportButton({
  score,
  riskCount,
  onOpen,
}: AfterActionReportButtonProps) {
  const warningLabel =
    riskCount === 0 ? "No combo risk" : `${riskCount} warning${riskCount === 1 ? "" : "s"}`;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        CARD,
        "group flex w-full items-center justify-between gap-4 p-4 text-left transition-transform hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-sky-50/80 dark:hover:border-sky-400/35 dark:hover:bg-slate-900",
      ].join(" ")}
    >
      <span className="min-w-0">
        <span className="block text-[12px] font-black uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">
          After-Action Report
        </span>
        <span className="mt-1 block text-[13px] font-medium leading-snug text-slate-700 dark:text-slate-200">
          Review what worked, what still adds risk, and the stronger setup.
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end">
        <span className="font-mono text-3xl font-black leading-none text-sky-600 dark:text-sky-300">
          {score}
        </span>
        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {warningLabel}
        </span>
      </span>
    </button>
  );
}

// ---- EndSummaryModal ----

type EndSummaryModalProps = Readonly<{
  result: ScoreResult;
  placements: PlacementMap;
  badge: "rookie" | "architect" | null;
  canTryHarder: boolean;
  currentDifficulty: Difficulty;
  mobile: boolean;
  onTryAgain: () => void;
  onTryHarder: () => void;
  onDismiss: () => void;
}>;

function EndSummaryModal({
  result,
  placements,
  badge,
  canTryHarder,
  currentDifficulty,
  mobile,
  onTryAgain,
  onTryHarder,
  onDismiss,
}: EndSummaryModalProps) {
  const countedScore = useCountUp(result.total, 1200);
  const scoreTier =
    result.total >= 70 ? "healthy" : result.total >= 40 ? "cautious" : "critical";
  const scoreColor =
    scoreTier === "healthy"
      ? "#38bdf8"
      : scoreTier === "cautious"
        ? "#f59e0b"
        : "#ef4444";
  const badgeLabel = getBadgeLabel(result.total, currentDifficulty);
  const wins = scanWins(placements);
  const risks = scanRisks(placements, result);
  const improvements = scanImprovements(placements, result);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    globalThis.addEventListener("keydown", handleKey);
    return () => globalThis.removeEventListener("keydown", handleKey);
  }, [onDismiss]);

  return (
    <div
      style={{ animation: "dh-fadeIn 0.45s ease" }}
      className="fixed inset-0 z-90 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
    >
      <button
        type="button"
        aria-label="Close summary"
        onClick={onDismiss}
        className="absolute inset-0 h-full w-full cursor-default bg-transparent"
        tabIndex={-1}
      />
      <dialog
        open
        aria-modal="true"
        aria-label="After-action report"
        style={{ animation: "dh-modalRise 0.7s cubic-bezier(0.22,1.2,0.36,1)" }}
        className="relative z-10 max-h-[calc(100dvh-24px)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/96 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_58%)] p-5 text-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.2)] ring-1 ring-white/90 sm:p-7 dark:border-sky-400/28 dark:bg-slate-900/96 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_58%)] dark:text-slate-100 dark:shadow-[0_30px_80px_rgba(2,6,23,0.6)] dark:ring-white/5"
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute right-3 top-3 touch-manipulation rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          style={{ touchAction: "manipulation" }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div
          style={{ animation: "dh-staggerIn 0.5s ease 0.05s both" }}
          className="text-center"
        >
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-sky-300/40 bg-sky-50/90 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-400/25 dark:bg-slate-900/70 dark:text-sky-300">
            <Sparkles size={11} /> After-Action Report
          </div>
          <div
            style={{
              fontSize: mobile ? 52 : 64,
              fontWeight: 900,
              lineHeight: 1,
              color: scoreColor,
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "-0.04em",
              filter: `drop-shadow(0 0 24px ${scoreColor}66)`,
              transition: "color 0.4s ease",
            }}
          >
            {countedScore}
          </div>
          <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Security Score
          </div>
          {badge && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-700 shadow-[0_0_20px_rgba(251,191,36,0.25)] dark:text-amber-200">
              <Award size={12} />
              {badge === "architect"
                ? "Network Architect — earned"
                : "Home Network Rookie — earned"}
            </div>
          )}
          {!badge && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-300/70 bg-slate-100/90 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-600/60 dark:bg-slate-900/50 dark:text-slate-300">
              <Award size={12} /> {badgeLabel}
            </div>
          )}
        </div>

        {/* Sections (staggered) */}
        <div className="mt-5 space-y-2">
          <SummarySection
            title="What you did well"
            accent="#4ade80"
            items={wins}
            delay={0.15}
          />
          {risks.length > 0 && (
            <SummarySection
              title="What still adds risk"
              accent="#fbbf24"
              items={risks}
              delay={0.27}
            />
          )}
          <SummarySection
            title="A stronger setup"
            accent="#38bdf8"
            items={improvements}
            delay={0.39}
          />
        </div>

        {/* Footer */}
        <div
          style={{ animation: "dh-staggerIn 0.5s ease 0.5s both" }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <button
            type="button"
            onClick={onTryAgain}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
          >
            Try Again
          </button>
          {canTryHarder && (
            <button
              type="button"
              onClick={onTryHarder}
              className="rounded-xl border border-sky-500/50 bg-sky-50 px-4 py-2 text-xs font-bold text-sky-700 transition-colors hover:border-sky-400 hover:bg-sky-100 dark:bg-sky-600/20 dark:text-sky-100 dark:hover:bg-sky-600/30"
            >
              Try {nextDifficulty(currentDifficulty) === "hard" ? "Hard" : "Medium"}
            </button>
          )}
          <Link
            href="/contact"
            className="rounded-xl bg-linear-to-br from-sky-500 to-sky-700 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-900/30 transition-all hover:-translate-y-0.5 hover:shadow-sky-900/50"
          >
            Get Help →
          </Link>
        </div>
      </dialog>
    </div>
  );
}

type SummarySectionProps = Readonly<{
  title: string;
  accent: string;
  items: ReadonlyArray<string>;
  delay: number;
}>;

function SummarySection({ title, accent, items, delay }: SummarySectionProps) {
  return (
    <div
      style={{ animation: `dh-staggerIn 0.5s ease ${delay}s both` }}
      className="rounded-xl border border-slate-200/80 bg-white/88 px-3 py-2 dark:border-slate-700/70 dark:bg-slate-800/50"
    >
      <div
        className="text-[10px] font-extrabold uppercase tracking-wider"
        style={{ color: accent }}
      >
        {title}
      </div>
      <ul className="mt-1 space-y-1 text-[11px] leading-snug text-slate-700 dark:text-slate-300">
        {items.map((item, i) => (
          <li key={`${i}-${item.slice(0, 14)}`} className="flex gap-2">
            <span aria-hidden className="text-slate-400 dark:text-slate-500">
              ·
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---- DeltaFloater — "+5" / "−8" damage-numbers-style pop near the score HUD ----

type DeltaFloaterProps = Readonly<{
  delta: { key: number; value: number } | null;
}>;

function DeltaFloater({ delta }: DeltaFloaterProps) {
  if (!delta || delta.value === 0) return null;
  const positive = delta.value > 0;
  const sign = positive ? "+" : "−";
  const magnitude = Math.abs(delta.value);
  return (
    <div
      key={delta.key}
      aria-hidden
      style={{ animation: "dh-floatUp 1.1s ease-out forwards" }}
      className={[
        "pointer-events-none absolute right-6 top-3 text-lg font-black tabular-nums",
        positive
          ? "text-emerald-500 drop-shadow-[0_0_10px_rgba(52,211,153,0.55)] dark:text-emerald-300"
          : "text-rose-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.55)] dark:text-rose-300",
      ].join(" ")}
    >
      {sign}
      {magnitude}
    </div>
  );
}

// ---- GameToast — shared pop-up for halfway + streak ----

type GameToastProps = Readonly<{
  icon: ReactNode;
  label: string;
  hint: string;
  accent: "sky" | "amber";
  mobile: boolean;
  bottomOffset: number;
}>;

function GameToast({
  icon,
  label,
  hint,
  accent,
  mobile,
  bottomOffset,
}: GameToastProps) {
  const accentClasses =
    accent === "amber"
      ? "border-amber-400/50 bg-white/96 text-amber-800 shadow-[0_20px_50px_rgba(251,191,36,0.18)] ring-amber-400/20 dark:bg-slate-900/90 dark:text-amber-100 dark:shadow-[0_20px_50px_rgba(251,191,36,0.3)] dark:ring-amber-400/25"
      : "border-sky-400/50 bg-white/96 text-sky-800 shadow-[0_20px_50px_rgba(56,189,248,0.18)] ring-sky-400/20 dark:bg-slate-900/90 dark:text-sky-100 dark:shadow-[0_20px_50px_rgba(56,189,248,0.3)] dark:ring-sky-400/25";
  return (
    <div
      aria-live="polite"
      style={{
        animation: "dh-toastIn 2.2s cubic-bezier(0.22,1,0.36,1)",
        bottom: mobile
          ? "calc(" + bottomOffset + "px + env(safe-area-inset-bottom))"
          : undefined,
      }}
      className={[
        "pointer-events-none fixed left-1/2 z-80 max-w-[calc(100vw-24px)] -translate-x-1/2 rounded-full border px-3 py-2 backdrop-blur-md ring-1 min-[820px]:bottom-auto min-[820px]:top-24 min-[820px]:px-5 min-[820px]:py-2.5",
        accentClasses,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className={accent === "amber" ? "text-amber-600 dark:text-amber-300" : "text-sky-600 dark:text-sky-300"}>
          {icon}
        </span>
        <span className="text-sm font-bold tracking-wide">{label}</span>
        <span className="text-xs font-medium opacity-80">{hint}</span>
      </div>
    </div>
  );
}

// ---- useCountUp hook — eased rAF counter used by the end summary ----

function useCountUp(target: number, durationMs = 1200): number {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    const tick = (now: number) => {
      startRef.current ??= now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      // ease-out cubic — fast at first, settles at the end
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(
        fromRef.current + (target - fromRef.current) * eased,
      );
      setValue(next);
      if (t < 1) {
        rafRef.current = globalThis.requestAnimationFrame(tick);
      }
    };
    rafRef.current = globalThis.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) globalThis.cancelAnimationFrame(rafRef.current);
    };
    // Only restart when target or duration changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return value;
}

// ---- Summary scanners ----

function zoneOf(placements: PlacementMap, deviceId: DeviceId): ZoneId | null {
  return placements[deviceId]?.zoneId ?? null;
}

function scanWins(placements: PlacementMap): string[] {
  const wins: string[] = [];
  if (zoneOf(placements, "guest-phone") === "guest") {
    wins.push("Guest access isolated on its own network.");
  }
  if (
    zoneOf(placements, "doorbell-camera") === "iot" &&
    zoneOf(placements, "camera-hub") === "iot"
  ) {
    wins.push("Both cameras contained on the IoT network.");
  }
  if (
    zoneOf(placements, "work-laptop") === "main" &&
    zoneOf(placements, "personal-phone") === "main"
  ) {
    wins.push("Work and personal devices sharing one trusted zone.");
  }
  if (
    zoneOf(placements, "smart-tv") === "iot" &&
    zoneOf(placements, "smart-speaker") === "iot" &&
    zoneOf(placements, "game-console") === "iot"
  ) {
    wins.push("Entertainment devices separated from your trusted network.");
  }
  if (zoneOf(placements, "printer") === "iot") {
    wins.push("Printer treated as the untrusted IoT device it actually is.");
  }
  if (wins.length === 0) wins.push("You completed the exercise.");
  return wins;
}

function scanRisks(placements: PlacementMap, result: ScoreResult): string[] {
  const risks = result.appliedCombos.map((c) => COMBO_TIPS[c.id]);
  if (zoneOf(placements, "guest-phone") !== "guest") {
    risks.push("Guest phone is not isolated on the Guest network.");
  }
  return risks;
}

function scanImprovements(
  placements: PlacementMap,
  result: ScoreResult,
): string[] {
  const tips: string[] = [];
  const combos = new Set(result.appliedCombos.map((c) => c.id));
  if (combos.has("camera-on-main")) {
    tips.push("Move cameras to the IoT zone.");
  }
  if (zoneOf(placements, "guest-phone") !== "guest") {
    tips.push("Move the guest phone onto the Guest network.");
  }
  if (combos.has("entertainment-clutter")) {
    tips.push("Move smart TVs, speakers, and consoles off Main.");
  }
  if (combos.has("single-zone-dump")) {
    tips.push("Split devices across at least two zones.");
  }
  if (zoneOf(placements, "printer") === "main" && !combos.has("entertainment-clutter")) {
    tips.push("Consider moving the printer to IoT.");
  }
  if (tips.length === 0) {
    tips.push("Solid layout. Enable MFA everywhere.");
  }
  return tips;
}

function getBadgeLabel(total: number, difficulty: Difficulty): string {
  if (difficulty === "hard" && total >= 70) return "Network Architect tier";
  if (total >= 40) return "Home Network Rookie tier";
  return "Getting started";
}
