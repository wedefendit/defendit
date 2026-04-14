import type { DragEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEVICES, type Device, type DeviceId, type ZoneId } from "../engine";
import { CARD, TOOLBAR_LABEL, TRAY_NAME } from "../model";
import { DeviceIcon, type DeviceIconTone } from "./DeviceIcon";

const CAT_EDGE: Record<Device["category"], string> = {
  trusted: "#38bdf8",
  guest: "#fbbf24",
  "gray-area": "#94a3b8",
  entertainment: "#a78bfa",
  camera: "#f87171",
};

// ======== MOBILE: Horizontal scroll strip ========

export type DeviceStripProps = Readonly<{
  selectedId: DeviceId | null;
  placedIds: ReadonlySet<DeviceId>;
  placedZones?: Record<DeviceId, ZoneId | null>;
  onSelect: (id: DeviceId) => void;
  onReturn: (id: DeviceId) => void;
  allowDrag: boolean;
  guided: boolean;
  deviceTone: DeviceIconTone;
  onTouchDragStart?: (id: DeviceId, e: React.TouchEvent) => void;
}>;

export function DeviceStrip({
  selectedId,
  placedIds,
  placedZones,
  onSelect,
  onReturn,
  allowDrag,
  guided,
  deviceTone,
  onTouchDragStart,
}: DeviceStripProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [fade, setFade] = useState<"start" | "mid" | "end">("start");
  const toneFor = (id: DeviceId, placed: boolean): DeviceIconTone => {
    if (placed && placedZones) {
      const z = placedZones[id];
      if (z) return `zone-${z}` as DeviceIconTone;
    }
    return deviceTone;
  };
  const updateFade = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft: sl, scrollWidth: sw, clientWidth: cw } = el;
    setFade(sl <= 4 ? "start" : sl + cw >= sw - 4 ? "end" : "mid");
  }, []);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateFade();
    el.addEventListener("scroll", updateFade, { passive: true });
    const ro = new globalThis.ResizeObserver(updateFade);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateFade);
      ro.disconnect();
    };
  }, [updateFade]);

  // Long-press gate: quick horizontal swipe = scroll, deliberate hold = drag
  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null);

  const cancelPendingDrag = useCallback(() => {
    if (dragTimerRef.current !== null) {
      clearTimeout(dragTimerRef.current);
      dragTimerRef.current = null;
    }
    dragOriginRef.current = null;
  }, []);

  useEffect(() => {
    const onMove = (e: TouchEvent) => {
      if (!dragOriginRef.current) return;
      const t = e.touches[0];
      if (!t) return;
      if (Math.abs(t.clientX - dragOriginRef.current.x) > 8) {
        cancelPendingDrag();
        return;
      }
      e.preventDefault();
    };
    globalThis.addEventListener("touchmove", onMove, { passive: false });
    globalThis.addEventListener("touchend", cancelPendingDrag);
    globalThis.addEventListener("touchcancel", cancelPendingDrag);
    return () => {
      globalThis.removeEventListener("touchmove", onMove);
      globalThis.removeEventListener("touchend", cancelPendingDrag);
      globalThis.removeEventListener("touchcancel", cancelPendingDrag);
      cancelPendingDrag();
    };
  }, [cancelPendingDrag]);

  const handleStripTouchStart = useCallback(
    (deviceId: DeviceId, e: React.TouchEvent) => {
      if (!onTouchDragStart) return;
      const touch = e.nativeEvent.touches[0];
      if (!touch) return;
      dragOriginRef.current = { x: touch.clientX, y: touch.clientY };
      dragTimerRef.current = setTimeout(() => {
        dragTimerRef.current = null;
        dragOriginRef.current = null;
        if (navigator.vibrate) navigator.vibrate(12);
        onTouchDragStart(deviceId, e);
      }, 250);
    },
    [onTouchDragStart],
  );

  return (
    <div data-testid="dh-device-strip" className="relative w-full">
      {fade !== "start" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"
        />
      )}
      {fade !== "end" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-end bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent pr-1.5"
        >
          <span
            className="text-[18px] font-black text-sky-400"
            style={{ animation: "dh-hintPulse 1.5s ease-in-out infinite" }}
          >
            ›
          </span>
        </div>
      )}
      <div
        ref={scrollRef}
        className="overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="mx-auto flex w-fit gap-1.5">
          {DEVICES.map((dev) => {
            const placed = placedIds.has(dev.id);
            const sel = selectedId === dev.id;
            const bc = guided
              ? CAT_EDGE[dev.category]
              : sel
                ? "#38bdf8"
                : "rgba(148,163,184,0.42)";
            return (
              <div
                key={dev.id}
                role="button"
                tabIndex={0}
                data-testid={"dh-device-" + dev.id}
                draggable={allowDrag && !placed}
                onDragStart={(e) => {
                  if (!allowDrag) return;
                  (e as unknown as DragEvent<HTMLElement>).dataTransfer.setData(
                    "text/plain",
                    dev.id,
                  );
                  (
                    e as unknown as DragEvent<HTMLElement>
                  ).dataTransfer.effectAllowed = "move";
                }}
                onClick={() => {
                  if (placed) onReturn(dev.id);
                  else onSelect(dev.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (placed) onReturn(dev.id);
                    else onSelect(dev.id);
                  }
                }}
                onTouchStart={
                  !placed && onTouchDragStart
                    ? (e) => handleStripTouchStart(dev.id, e)
                    : undefined
                }
                aria-pressed={sel}
                aria-label={dev.name}
                title={dev.name}
                className={[
                  "touch-manipulation flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border bg-white/90 shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-all dark:bg-slate-900/80",
                  sel
                    ? "scale-[1.06] shadow-[0_0_14px_rgba(56,189,248,0.35)] ring-1 ring-sky-300/80 dark:shadow-[0_0_14px_rgba(56,189,248,0.45)] dark:ring-sky-300/70"
                    : placed
                      ? "cursor-pointer opacity-40"
                      : "cursor-pointer hover:bg-slate-100/90 dark:hover:bg-slate-800/90",
                ].join(" ")}
                style={{
                  borderColor: bc,
                  height: 42,
                  width: 50,
                  minWidth: 50,
                  scrollSnapAlign: "start",
                  touchAction: "manipulation",
                }}
              >
                <DeviceIcon
                  deviceId={dev.id}
                  category={dev.category}
                  size="tile"
                  tone={toneFor(dev.id, placed)}
                  className={placed ? "opacity-75" : ""}
                />
                <span
                  className={[
                    "text-[7px] font-bold leading-none",
                    placed
                      ? "text-slate-500"
                      : "text-slate-700 dark:text-slate-100",
                  ].join(" ")}
                >
                  {TOOLBAR_LABEL[dev.id]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ======== DESKTOP: Sidebar card grid (unchanged logic, kept compact) ========

export type DeviceTrayGridProps = Readonly<{
  selectedId: DeviceId | null;
  placedIds: ReadonlySet<DeviceId>;
  placedZones?: Record<DeviceId, ZoneId | null>;
  onSelect: (id: DeviceId) => void;
  onReturn: (id: DeviceId) => void;
  layout: "toolbar" | "compact";
  allowDrag: boolean;
  guided: boolean;
  deviceTone: DeviceIconTone;
  columns?: 1 | 2 | 3 | 4;
  framed?: boolean;
  showHeading?: boolean;
  onTouchDragStart?: (id: DeviceId, e: React.TouchEvent) => void;
}>;

export function DeviceTrayGrid({
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
  const toneFor = (id: DeviceId, placed: boolean): DeviceIconTone => {
    if (placed && placedZones) {
      const z = placedZones[id];
      if (z) return `zone-${z}` as DeviceIconTone;
    }
    return deviceTone;
  };
  const hdrag = (e: DragEvent<HTMLElement>, d: DeviceId) => {
    if (!allowDrag) return;
    e.dataTransfer.setData("text/plain", d);
    e.dataTransfer.effectAllowed = "move";
  };
  const hkey = (e: React.KeyboardEvent, d: DeviceId, pl: boolean) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (pl) onReturn(d);
      else onSelect(d);
    }
  };

  // "toolbar" layout preserved for backward compat but unused in the new layout
  if (layout === "toolbar") return null;

  return (
    <div
      className={
        framed ? CARD + " dh-inventory-panel p-2.5" : "dh-inventory-panel"
      }
    >
      {showHeading && (
        <div className="dh-inventory-heading mb-1.5 flex items-center gap-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-slate-700 xl:text-[11px] dark:text-slate-300">
            Inventory
          </span>
          {placedIds.size > 0 && (
            <span className="text-[12px] font-semibold text-sky-700 xl:text-[11px] dark:text-sky-300">
              {10 - placedIds.size} left
            </span>
          )}
        </div>
      )}
      <div
        data-testid="dh-inventory-grid"
        className="dh-inventory-grid grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
      >
        {DEVICES.map((dev) => {
          const pl = placedIds.has(dev.id);
          const sel = selectedId === dev.id;
          const bc = guided
            ? CAT_EDGE[dev.category]
            : sel
              ? "#38bdf8"
              : "rgba(148,163,184,0.3)";
          return (
            <button
              key={dev.id}
              type="button"
              data-testid={"dh-device-" + dev.id}
              draggable={allowDrag && !pl}
              onDragStart={(e) => hdrag(e, dev.id)}
              onClick={() => {
                if (pl) onReturn(dev.id);
                else onSelect(dev.id);
              }}
              onKeyDown={(e) => hkey(e, dev.id, pl)}
              onTouchStart={
                !pl && onTouchDragStart
                  ? (e) => onTouchDragStart(dev.id, e)
                  : undefined
              }
              aria-pressed={sel}
              aria-label={TRAY_NAME[dev.id]}
              title={dev.description}
              style={{
                borderLeftColor: bc,
                borderLeftWidth: guided ? 3 : 2,
                height: "clamp(50px,4vw,56px)",
                gridTemplateColumns: "32px minmax(0,1fr)",
                touchAction: "manipulation",
              }}
              className={[
                "dh-inventory-card touch-manipulation grid items-center gap-2 overflow-hidden rounded-lg border pl-1.5 pr-2 transition-all",
                sel
                  ? "border-sky-400 bg-sky-50/90 ring-1 ring-sky-300/60 dark:border-sky-400 dark:bg-sky-950/60 dark:ring-sky-500/40"
                  : pl
                    ? "cursor-pointer border-slate-200/70 bg-slate-100/55 opacity-60 dark:border-slate-700/60 dark:bg-slate-800/40"
                    : allowDrag
                      ? "cursor-grab border-slate-200/80 bg-white/84 hover:border-sky-300/80 active:cursor-grabbing dark:border-slate-700/70 dark:bg-slate-900/60 dark:hover:border-sky-400/40"
                      : "cursor-pointer border-slate-200/80 bg-white/84 hover:border-sky-300/80 dark:border-slate-700/70 dark:bg-slate-900/60 dark:hover:border-sky-400/40",
              ].join(" ")}
            >
              <DeviceIcon
                deviceId={dev.id}
                category={dev.category}
                size="tile"
                tone={toneFor(dev.id, pl)}
                className={pl ? "opacity-75" : ""}
              />
              <span
                className={[
                  "min-w-0 truncate text-left text-[11px] font-semibold leading-tight",
                  pl
                    ? "text-slate-500 dark:text-slate-400"
                    : "text-slate-900 dark:text-slate-50",
                ].join(" ")}
              >
                {TRAY_NAME[dev.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ======== After-action button ========

export type AfterActionReportButtonProps = Readonly<{
  score: number;
  riskCount: number;
  onOpen: () => void;
}>;

export function AfterActionReportButton({
  score,
  riskCount,
  onOpen,
}: AfterActionReportButtonProps) {
  const wl =
    riskCount === 0
      ? "No open risk"
      : `${riskCount} open risk${riskCount === 1 ? "" : "s"}`;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={
        CARD +
        " group flex w-full items-center justify-between gap-4 p-4 text-left transition-transform hover:-translate-y-0.5 hover:border-sky-300/80 hover:bg-sky-50/80 dark:hover:border-sky-400/35 dark:hover:bg-slate-900"
      }
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
          {wl}
        </span>
      </span>
    </button>
  );
}

// ======== Desktop sidebar panel ========

export type DigitalHouseInventoryPanelProps = Readonly<{
  selectedId: DeviceId | null;
  placedIds: ReadonlySet<DeviceId>;
  placedZones: Record<DeviceId, ZoneId | null>;
  onSelect: (id: DeviceId) => void;
  onReturn: (id: DeviceId) => void;
  allowDrag: boolean;
  guided: boolean;
  deviceTone: DeviceIconTone;
  columns: 2 | 3 | 4;
  onTouchDragStart?: (id: DeviceId, e: React.TouchEvent) => void;
  showAfterAction?: boolean;
  score?: number;
  riskCount?: number;
  onOpenAfterAction?: () => void;
}>;

export function DigitalHouseInventoryPanel({
  selectedId,
  placedIds,
  placedZones,
  onSelect,
  onReturn,
  allowDrag,
  guided,
  deviceTone,
  columns,
  onTouchDragStart,
  showAfterAction = false,
  score = 0,
  riskCount = 0,
  onOpenAfterAction,
}: DigitalHouseInventoryPanelProps) {
  return (
    <div
      data-testid="dh-inventory-panel"
      className={CARD + " flex flex-col p-3 xl:p-4"}
    >
      <DeviceTrayGrid
        selectedId={selectedId}
        placedIds={placedIds}
        placedZones={placedZones}
        onSelect={onSelect}
        onReturn={onReturn}
        layout="compact"
        allowDrag={allowDrag}
        guided={guided}
        deviceTone={deviceTone}
        columns={columns}
        framed={false}
        showHeading
        onTouchDragStart={onTouchDragStart}
      />
      {showAfterAction && onOpenAfterAction ? (
        <div className="mt-3 shrink-0">
          <AfterActionReportButton
            score={score}
            riskCount={riskCount}
            onOpen={onOpenAfterAction}
          />
        </div>
      ) : null}
    </div>
  );
}
