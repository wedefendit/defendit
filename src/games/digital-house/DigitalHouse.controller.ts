import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Difficulty } from "../shared/types";
import { useGameShell } from "../shared/GameShell";
import { getGamePreference, setGamePreference } from "../shared/storage";
import {
  DEVICES,
  ROOM_ZONE_ASSIGNMENTS,
  calculateScore,
  type Device,
  type DeviceId,
  type DevicePlacement,
  type RoomId,
  type ZoneId,
} from "./engine";
import {
  inventoryColumnsForRail,
  isCompactDesktopLayout,
  widthToBand,
} from "./layout";
import {
  DIGITAL_HOUSE_GAME_ID,
  ONBOARDING_PREF_KEY,
  HOME_NETWORK_ROOKIE,
  NETWORK_ARCHITECT,
  RISKY_DEVICE_IDS,
  TRUSTED_DEVICE_IDS,
  emptyPlacements,
  nextDifficulty,
  coachSteps,
  type ActiveToast,
  type BadgeJustEarned,
  type LastPlacement,
  type PlacementMap,
  type ScoreDelta,
  type ViewportProfile,
  type ZoneBlockedFeedback,
} from "./model";
import { buildOpenRiskItems } from "./summary";
import type { DeviceIconTone } from "./ui/DeviceIcon";
import { useIdleHint, type IdleSnapshot } from "./hooks/useIdleHint";

// ======== Pure helpers (exported for tests — unchanged) ========

export function mergeRoomZones(
  preassigned: Record<RoomId, ZoneId | null>,
  overrides: Partial<Record<RoomId, ZoneId>>,
): Record<RoomId, ZoneId | null> {
  const m: Record<RoomId, ZoneId | null> = { ...preassigned };
  for (const [rid, zid] of Object.entries(overrides) as Array<
    [RoomId, ZoneId]
  >) {
    if (preassigned[rid] === null) m[rid] = zid;
  }
  return m;
}

export function reconcilePlacementsWithRoomZones(
  placements: PlacementMap,
  roomZones: Record<RoomId, ZoneId | null>,
): PlacementMap {
  let changed = false;
  const next: PlacementMap = { ...placements };
  for (const d of DEVICES) {
    const p = placements[d.id];
    if (!p) continue;
    const nz = roomZones[p.roomId];
    if (nz === null) {
      next[d.id] = null;
      changed = true;
    } else if (nz !== p.zoneId) {
      next[d.id] = { roomId: p.roomId, zoneId: nz };
      changed = true;
    }
  }
  return changed ? next : placements;
}

export function toggleSelectedDevice(
  current: DeviceId | null,
  deviceId: DeviceId,
): DeviceId | null {
  return current === deviceId ? null : deviceId;
}

export function buildPlacedIds(placements: PlacementMap): Set<DeviceId> {
  const s = new Set<DeviceId>();
  for (const d of DEVICES) if (placements[d.id]) s.add(d.id);
  return s;
}

export function buildDevicesByRoom(
  placements: PlacementMap,
): Map<RoomId, Device[]> {
  const m = new Map<RoomId, Device[]>();
  for (const d of DEVICES) {
    const p = placements[d.id];
    if (!p) continue;
    const l = m.get(p.roomId) ?? [];
    l.push(d);
    m.set(p.roomId, l);
  }
  return m;
}

export function buildPlacedZones(
  placements: PlacementMap,
): Record<DeviceId, ZoneId | null> {
  const o = {} as Record<DeviceId, ZoneId | null>;
  for (const d of DEVICES) {
    const p = placements[d.id];
    o[d.id] = p ? p.zoneId : null;
  }
  return o;
}

export function deriveRiskyRooms(placements: PlacementMap): Set<RoomId> {
  const byRoom = new Map<RoomId, DeviceId[]>();
  for (const d of DEVICES) {
    const p = placements[d.id];
    if (p?.zoneId !== "main") continue;
    const l = byRoom.get(p.roomId) ?? [];
    l.push(d.id);
    byRoom.set(p.roomId, l);
  }
  const risky = new Set<RoomId>();
  for (const [rid, ids] of byRoom) {
    if (
      ids.some((id) => TRUSTED_DEVICE_IDS.has(id)) &&
      ids.some((id) => RISKY_DEVICE_IDS.has(id))
    )
      risky.add(rid);
  }
  return risky;
}

export function shouldAutoOpenHelp(pref: boolean | undefined): boolean {
  return pref !== true;
}

export function buildScoreFeedback({
  previousTotal,
  nextTotal,
  streak,
  halfwayShown,
  placedCount,
}: {
  previousTotal: number;
  nextTotal: number;
  streak: number;
  halfwayShown: boolean;
  placedCount: number;
}) {
  const delta = nextTotal - previousTotal;
  if (delta === 0)
    return {
      delta,
      nextStreak: streak,
      nextHalfwayShown: halfwayShown,
      nextToast: null as Omit<NonNullable<ActiveToast>, "key"> | null,
    };
  const ns = delta > 0 ? streak + 1 : 0;
  if (!halfwayShown && placedCount === 5 && delta > 0)
    return {
      delta,
      nextStreak: ns,
      nextHalfwayShown: true,
      nextToast: {
        type: "halfway",
        label: "Halfway there",
        hint: "5 of 10 placed",
      } as Omit<NonNullable<ActiveToast>, "key">,
    };
  if (ns >= 3)
    return {
      delta,
      nextStreak: ns,
      nextHalfwayShown: halfwayShown,
      nextToast: {
        type: "streak",
        label: `${ns}× streak`,
        hint: "Nice rhythm",
      } as Omit<NonNullable<ActiveToast>, "key">,
    };
  return {
    delta,
    nextStreak: ns,
    nextHalfwayShown: halfwayShown,
    nextToast: null as Omit<NonNullable<ActiveToast>, "key"> | null,
  };
}

export function resolveEarnedBadge({
  difficulty,
  total,
  hadRookie,
  hadArchitect,
}: {
  difficulty: Difficulty;
  total: number;
  hadRookie: boolean;
  hadArchitect: boolean;
}): BadgeJustEarned {
  let b: BadgeJustEarned = null;
  if (!hadRookie) b = "rookie";
  if (difficulty === "hard" && total >= 70 && !hadArchitect) b = "architect";
  return b;
}

// ======== Viewport hook (unchanged) ========

function useViewportProfile(): ViewportProfile {
  const [p, setP] = useState<ViewportProfile>({
    width: 0,
    height: 0,
    band: "phone",
    isCoarsePointer: false,
  });
  useEffect(() => {
    const cq = globalThis.matchMedia("(pointer: coarse)");
    const hq = globalThis.matchMedia("(hover: none)");
    const update = () => {
      const w = globalThis.innerWidth,
        h = globalThis.innerHeight;
      setP({
        width: w,
        height: h,
        band: widthToBand(w),
        isCoarsePointer: cq.matches || hq.matches,
      });
    };
    const bind = (q: MediaQueryList, fn: () => void) => {
      if (typeof q.addEventListener === "function") {
        q.addEventListener("change", fn);
        return () => q.removeEventListener("change", fn);
      }
      q.addListener(fn);
      return () => q.removeListener(fn);
    };
    update();
    const u1 = bind(cq, update),
      u2 = bind(hq, update);
    globalThis.addEventListener("resize", update);
    return () => {
      u1();
      u2();
      globalThis.removeEventListener("resize", update);
    };
  }, []);
  return p;
}

// ======== Touch drag (unchanged) ========

type TouchDragState = {
  deviceId: DeviceId;
  ghost: HTMLElement;
  currentRoom: RoomId | null;
};

function useTouchDrag(
  onPlace: (did: DeviceId, rid: RoomId) => void,
  onHoverRoom: (rid: RoomId | null) => void,
) {
  const stateRef = useRef<TouchDragState | null>(null);
  const onPlaceRef = useRef(onPlace);
  const onHoverRef = useRef(onHoverRoom);
  onPlaceRef.current = onPlace;
  onHoverRef.current = onHoverRoom;

  const startDrag = useCallback((deviceId: DeviceId, originTouch: Touch) => {
    const ghost = document.createElement("div");
    ghost.style.cssText =
      "position:fixed;z-index:9999;pointer-events:none;width:44px;height:44px;border-radius:12px;background:rgba(56,189,248,0.85);border:2px solid #0ea5e9;box-shadow:0 8px 24px rgba(56,189,248,0.5);display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;font-weight:900;transform:translate(-50%,-50%) scale(1.1);";
    ghost.textContent = "↓";
    ghost.style.left = originTouch.clientX + "px";
    ghost.style.top = originTouch.clientY + "px";
    document.body.appendChild(ghost);
    stateRef.current = { deviceId, ghost, currentRoom: null };
    const onMove = (e: TouchEvent) => {
      const s = stateRef.current;
      if (!s) return;
      const t = e.touches[0];
      if (!t) return;
      e.preventDefault();
      s.ghost.style.left = t.clientX + "px";
      s.ghost.style.top = t.clientY + "px";
      const el = document.elementFromPoint(t.clientX, t.clientY);
      let rid: RoomId | null = null;
      if (el) {
        const re = el.closest(
          "[data-testid^='dh-room-']",
        ) as HTMLElement | null;
        if (re) {
          const m = (re.getAttribute("data-testid") ?? "").match(
            /^dh-room-(.+)$/,
          );
          if (m?.[1] && !m[1].startsWith("zone")) rid = m[1] as RoomId;
        }
      }
      if (rid !== s.currentRoom) {
        s.currentRoom = rid;
        onHoverRef.current(rid);
      }
    };
    const onEnd = () => {
      const s = stateRef.current;
      if (s) {
        s.ghost.remove();
        if (s.currentRoom) onPlaceRef.current(s.deviceId, s.currentRoom);
        onHoverRef.current(null);
        stateRef.current = null;
      }
      document.removeEventListener("touchmove", onMove, { capture: true });
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
    document.addEventListener("touchmove", onMove, {
      passive: false,
      capture: true,
    });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);
  }, []);

  const handleTouchStart = useCallback(
    (deviceId: DeviceId, e: React.TouchEvent) => {
      const t = e.nativeEvent.touches[0];
      if (!t) return;
      startDrag(deviceId, t);
    },
    [startDrag],
  );

  return { handleTouchStart };
}

// ======== Main controller ========

export function useDigitalHouseController() {
  const viewport = useViewportProfile();
  const mobile = viewport.band === "phone" || viewport.height < 500;
  const tablet =
    !mobile && viewport.width < 1100 && viewport.height > viewport.width;
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
  const [lastPlacement, setLastPlacement] = useState<LastPlacement | null>(
    null,
  );
  const [showEnd, setShowEnd] = useState(false);
  const [badgeJustEarned, setBadgeJustEarned] = useState<BadgeJustEarned>(null);
  const [userZoneOverrides, setUserZoneOverrides] = useState<
    Partial<Record<RoomId, ZoneId>>
  >({});
  const [scoreDelta, setScoreDelta] = useState<ScoreDelta>(null);
  const [halfwayShown, setHalfwayShown] = useState(false);
  const [streak, setStreak] = useState(0);
  const [activeToast, setActiveToast] = useState<ActiveToast>(null);
  const toastKeyRef = useRef(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [openZoneRoom, setOpenZoneRoom] = useState<RoomId | null>(null);
  const [railWidth, setRailWidth] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);
  const prevTotalRef = useRef(50);
  const deltaKeyRef = useRef(0);
  const hasRecordedRef = useRef(false);

  // NEW: zone-blocked feedback
  const [zoneBlocked, setZoneBlocked] = useState<ZoneBlockedFeedback | null>(
    null,
  );
  const zbKeyRef = useRef(0);

  // NEW: onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  const coachStepsConfig = useMemo(
    () => coachSteps(difficulty, mobile),
    [difficulty, mobile],
  );

  // NEW: track whether user has assigned any zone this run
  const [hasAssignedZone, setHasAssignedZone] = useState(false);

  const preassignedZones = useMemo(
    () => ROOM_ZONE_ASSIGNMENTS[difficulty],
    [difficulty],
  );
  const roomZones: Record<RoomId, ZoneId | null> = useMemo(
    () => mergeRoomZones(preassignedZones, userZoneOverrides),
    [preassignedZones, userZoneOverrides],
  );
  const compactDesktop = !mobile && isCompactDesktopLayout(viewport.width);
  const houseZoneControls = difficulty !== "easy";
  const deviceTone: DeviceIconTone =
    difficulty === "easy" ? "category" : "neutral";
  const guidedDeviceCards = difficulty === "easy";
  const inventoryColumns: 2 | 3 | 4 = tablet
    ? 3
    : inventoryColumnsForRail(viewport.width, railWidth);

  // NEW: has unzoned rooms (for idle hint)
  const hasUnzonedRooms = useMemo(
    () => Object.values(roomZones).some((z) => z === null),
    [roomZones],
  );

  // Reset on difficulty/shell reset
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
    setZoneBlocked(null);
    setHasAssignedZone(false);
    prevTotalRef.current = 50;
    deltaKeyRef.current = 0;
    toastKeyRef.current = 0;
    hasRecordedRef.current = 0 as unknown as boolean;
    hasRecordedRef.current = false;
  }, [resetCount, difficulty]);

  // Re-zone placements when room zones change
  useEffect(() => {
    setPlacements((prev) => {
      let changed = false;
      const next: PlacementMap = { ...prev };
      for (const d of DEVICES) {
        const p = prev[d.id];
        if (!p) continue;
        const nz = roomZones[p.roomId];
        if (nz === null) {
          next[d.id] = null;
          changed = true;
        } else if (nz !== p.zoneId) {
          next[d.id] = { roomId: p.roomId, zoneId: nz };
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
  const riskCount = useMemo(
    () => buildOpenRiskItems(result, difficulty).length,
    [difficulty, result],
  );

  const placedIds = useMemo(() => {
    const s = new Set<DeviceId>();
    for (const d of DEVICES) if (placements[d.id]) s.add(d.id);
    return s;
  }, [placements]);
  const isComplete = placedIds.size === DEVICES.length;
  const riskyRooms = useMemo(() => deriveRiskyRooms(placements), [placements]);
  const devicesByRoom = useMemo(
    () => buildDevicesByRoom(placements),
    [placements],
  );
  const placedZones = useMemo(() => buildPlacedZones(placements), [placements]);

  // NEW: selected device info for analysis strip
  const selectedDevice = useMemo(() => {
    if (!selectedId) return null;
    const d = DEVICES.find((dev) => dev.id === selectedId);
    if (!d) return null;
    return { id: d.id, name: d.name, description: d.description };
  }, [selectedId]);

  // Score feedback (toast, delta, streak)
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
    const nextStreak = delta > 0 ? streak + 1 : 0;
    setStreak(nextStreak);
    if (!halfwayShown && placedIds.size === 5 && delta > 0) {
      setHalfwayShown(true);
      showToast("halfway", "Halfway there", "5 of 10 placed");
    } else if (nextStreak >= 3)
      showToast("streak", `${nextStreak}× streak`, "Nice rhythm");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.total]);

  useEffect(() => {
    if (!activeToast) return;
    const t = globalThis.setTimeout(() => setActiveToast(null), 2200);
    return () => globalThis.clearTimeout(t);
  }, [activeToast?.key]);

  // Auto-dismiss zone-blocked feedback
  useEffect(() => {
    if (!zoneBlocked) return;
    const t = globalThis.setTimeout(() => setZoneBlocked(null), 2500);
    return () => globalThis.clearTimeout(t);
  }, [zoneBlocked?.key]);

  // Completion
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
    let newBadge: BadgeJustEarned = null;
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

  // ======== Handlers ========

  const placeDevice = useCallback(
    (deviceId: DeviceId, roomId: RoomId) => {
      const zoneId = roomZones[roomId];
      // FIX: instead of silently returning, show feedback
      if (!zoneId) {
        zbKeyRef.current += 1;
        setZoneBlocked({ key: zbKeyRef.current, roomId });
        return;
      }
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
    setSelectedId(null);
    setLastPlacement(null);
    setOpenZoneRoom(null);
  }, []);

  const handleSelect = useCallback((deviceId: DeviceId) => {
    setSelectedId((prev) => (prev === deviceId ? null : deviceId));
    setLastPlacement(null);
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
    setHasAssignedZone(true); // NEW: track zone assignment
  }, []);

  const onTryHarder = useCallback(() => {
    setShowEnd(false);
    setDifficulty(nextDifficulty(difficulty));
  }, [difficulty, setDifficulty]);
  const touchDrag = useTouchDrag(placeDevice, setHoveredRoom);
  const handleReset = useCallback(() => {
    shellReset();
  }, [shellReset]);

  // Rail width measurement (desktop only)
  useEffect(() => {
    if (mobile) {
      setRailWidth(0);
      return;
    }
    const rail = railRef.current;
    if (!rail) return;
    const measure = () =>
      setRailWidth(Math.ceil(rail.getBoundingClientRect().width));
    measure();
    const ro = new globalThis.ResizeObserver(measure);
    ro.observe(rail);
    return () => ro.disconnect();
  }, [mobile, viewport.band]);

  useEffect(() => {
    if (!houseZoneControls) setOpenZoneRoom(null);
  }, [houseZoneControls]);

  // NEW: Onboarding (replaces auto-help-modal)
  useEffect(() => {
    const pref = getGamePreference<boolean>(
      DIGITAL_HOUSE_GAME_ID,
      ONBOARDING_PREF_KEY,
    );
    if (pref === true) return; // user dismissed with "don't show again"
    // Small delay so DOM is ready for spotlight measurement
    const t = globalThis.setTimeout(() => setShowOnboarding(true), 400);
    return () => globalThis.clearTimeout(t);
  }, []);

  const dismissOnboarding = useCallback((dontShowAgain: boolean) => {
    if (dontShowAgain)
      setGamePreference(DIGITAL_HOUSE_GAME_ID, ONBOARDING_PREF_KEY, true);
    setShowOnboarding(false);
  }, []);

  const dismissHelp = useCallback((dontShowAgain: boolean) => {
    // Keep the old help pref for the help button
    if (dontShowAgain)
      setGamePreference(DIGITAL_HOUSE_GAME_ID, ONBOARDING_PREF_KEY, true);
    setHelpOpen(false);
  }, []);

  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeSummary = useCallback(() => setShowEnd(false), []);
  const openSummary = useCallback(() => setShowEnd(true), []);
  const handleTryAgain = useCallback(() => {
    setShowEnd(false);
    handleReset();
  }, [handleReset]);

  // NEW: idle hint integration
  const idleSnap: IdleSnapshot = useMemo(
    () => ({
      placedCount: placedIds.size,
      selectedId,
      selectedName: selectedDevice?.name ?? null,
      isComplete,
      hasUnzonedRooms,
      difficulty,
      hasAssignedZone,
    }),
    [
      placedIds.size,
      selectedId,
      selectedDevice?.name,
      isComplete,
      hasUnzonedRooms,
      difficulty,
      hasAssignedZone,
    ],
  );

  const { hint: idleHint, dismissHint: dismissIdleHint } =
    useIdleHint(idleSnap);

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

  return {
    viewport,
    mobile,
    tablet,
    compactDesktop,
    allowDrag,
    difficulty,
    result,
    placements,
    selectedId,
    selectedDevice,
    lastPlacement,
    showEnd,
    badgeJustEarned,
    helpOpen,
    railRef,
    activeToast,
    scoreDelta,
    placedIds,
    placedZones,
    deviceTone,
    guidedDeviceCards,
    inventoryColumns,
    houseProps,
    isComplete,
    dismissHelp,
    openHelp,
    closeSummary,
    openSummary,
    onTryHarder,
    handleTryAgain,
    handleSelect,
    returnDevice,
    totalDevices: DEVICES.length,
    riskCount,
    // NEW exports
    showOnboarding,
    coachStepsConfig,
    dismissOnboarding,
    idleHint,
    dismissIdleHint,
    zoneBlockedFeedback: zoneBlocked,
  };
}
