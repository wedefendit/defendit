import { DEVICE_TIPS } from "../content/deviceTips";
import type { Difficulty } from "../../shared/types";
import {
  DEVICES,
  SCORING_INTERNALS,
  type DeviceId,
  type ScoreResult,
  type ZoneId,
} from "../engine";
import type { LastPlacement, ScoreDelta } from "../model";
import { DeviceIcon } from "./DeviceIcon";
import { buildOpenRiskItems } from "../summary";
import { DeltaFloater } from "./DeltaFloater";
import { ScoreRingBar } from "./ScoreRingBar";

type Tone = "good" | "bad" | "neutral";
function placementTone(did: DeviceId, zid: ZoneId): Tone {
  const d = SCORING_INTERNALS.BASE_MATRIX[did]?.[zid];
  if (!d) return "neutral";
  return d.privacy >= 6 ? "good" : d.privacy <= -6 ? "bad" : "neutral";
}
const TS: Record<Tone, { border: string; dot: string; hl: string }> = {
  good: {
    border: "border-emerald-300/70 dark:border-emerald-400/25",
    dot: "bg-emerald-400",
    hl: "text-emerald-700 dark:text-emerald-300",
  },
  bad: {
    border: "border-rose-300/70 dark:border-rose-400/25",
    dot: "bg-rose-400",
    hl: "text-rose-700 dark:text-rose-300",
  },
  neutral: {
    border: "border-slate-200/80 dark:border-slate-700/70",
    dot: "bg-sky-400",
    hl: "text-sky-700 dark:text-sky-300",
  },
};

export type SelectedDeviceInfo = {
  id: DeviceId;
  name: string;
  description: string;
} | null;

type AnalysisStripProps = Readonly<{
  lastPlacement: LastPlacement | null;
  selectedDevice: SelectedDeviceInfo;
  result: ScoreResult;
  desktop?: boolean;
}>;

/**
 * Fixed-height analysis slot. On mobile h-10 (40px). Content cross-fades, no layout shift.
 * Priority: placement tip > selected device info > empty "tap a device".
 */
export function AnalysisStrip({
  lastPlacement,
  selectedDevice,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  result: _,
  desktop = false,
}: AnalysisStripProps) {
  const base = `dh-analysis-card relative rounded-xl border border-slate-200/80 bg-white/60 backdrop-blur-md dark:border-slate-700/60 transition-all duration-300 dark:bg-slate-900/50 ${desktop ? "min-h-[68px] rounded-2xl px-5 py-4" : "min-h-[40px] px-3 py-1"}`;

  // Placement feedback
  if (lastPlacement) {
    const dev = DEVICES.find((d) => d.id === lastPlacement.deviceId);
    const tip = DEVICE_TIPS[lastPlacement.deviceId][lastPlacement.zoneId];
    if (!dev) return null;
    const tone = placementTone(lastPlacement.deviceId, lastPlacement.zoneId);
    const s = TS[tone];
    return (
      <div
        data-testid="dh-analysis-card"
        key={`${lastPlacement.deviceId}-${lastPlacement.roomId}`}
        style={{ animation: "dh-slideIn 0.3s ease" }}
        className={`${base} ${s.border} ring-1 ring-white/80 dark:ring-white/5 shadow-[0_4px_12px_rgba(15,23,42,0.06)] ${desktop ? "bg-white/95 dark:bg-slate-900/95" : ""}`}
      >
        <div
          className={
            desktop ? "flex items-start gap-3" : "flex flex-col gap-0.5"
          }
        >
          {desktop && (
            <DeviceIcon deviceId={dev.id} category={dev.category} size="md" />
          )}
          <div className={desktop ? "min-w-0 flex-1" : "min-w-0"}>
            {desktop && (
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className={`inline-block h-1.5 w-1.5 rounded-full ${s.dot}`}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  Live Analysis
                </span>
              </div>
            )}
            {!desktop && (
              <div className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${s.dot}`}
                />
                <span
                  className={`text-[10px] font-black uppercase tracking-[0.12em] ${s.hl}`}
                >
                  {dev.name}
                </span>
              </div>
            )}
            {desktop && (
              <span
                className={`shrink-0 text-[11px] font-black uppercase tracking-[0.12em] ${s.hl} mt-1 block`}
              >
                {dev.name}
              </span>
            )}
            <span
              className={
                desktop
                  ? "mt-1 text-[13px] leading-snug text-slate-700 dark:text-slate-200"
                  : "mt-0.5 block text-[11px] leading-snug text-slate-700 dark:text-slate-200"
              }
            >
              {tip}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Selected device info
  if (selectedDevice) {
    return (
      <div
        data-testid="dh-analysis-card"
        key={`info-${selectedDevice.id}`}
        style={{ animation: "dh-slideIn 0.3s ease" }}
        className={`${base} border-sky-200/60 ring-1 ring-sky-100/40 shadow-[0_4px_12px_rgba(56,189,248,0.08)] dark:border-sky-400/20 dark:ring-sky-500/10`}
      >
        <div
          className={
            desktop ? "flex items-start gap-3" : "flex flex-col gap-0.5"
          }
        >
          {desktop && (
            <DeviceIcon
              deviceId={selectedDevice.id}
              category={
                DEVICES.find((d) => d.id === selectedDevice.id)?.category ??
                "trusted"
              }
              size="md"
            />
          )}
          <div className={desktop ? "min-w-0 flex-1" : "min-w-0"}>
            <span
              className={`text-[10px] font-black uppercase tracking-[0.12em] text-sky-700 dark:text-sky-300 ${desktop ? "block text-[11px]" : ""}`}
            >
              {selectedDevice.name}
            </span>
            <span
              className={
                desktop
                  ? "mt-1 text-[13px] leading-snug text-slate-600 dark:text-slate-300"
                  : "mt-0.5 block text-[11px] leading-snug text-slate-600 dark:text-slate-300"
              }
            >
              {selectedDevice.description}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Empty
  return (
    <div
      data-testid="dh-analysis-card"
      className={`${base} border-slate-200/70 ring-1 ring-white/70 shadow-[0_4px_12px_rgba(15,23,42,0.04)] dark:border-slate-700/60 dark:ring-white/5`}
    >
      <div
        className={
          desktop
            ? "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3"
            : "flex h-full items-center gap-2"
        }
      >
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400"
          />
          <span className="shrink-0 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-sky-700 dark:text-sky-300">
            Live Analysis
          </span>
        </span>
        <span className="min-w-0 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          Drag a device to a room to begin
        </span>
      </div>
    </div>
  );
}

// ---- Score HUD wrapper ----

export type DigitalHouseScoreHudProps = Readonly<{
  result: ScoreResult;
  placedCount: number;
  totalDevices: number;
  mobile: boolean;
  difficulty: Difficulty;
  scoreDelta: ScoreDelta;
}>;

export function DigitalHouseScoreHud({
  result,
  placedCount,
  totalDevices,
  mobile,
  difficulty,
  scoreDelta,
}: DigitalHouseScoreHudProps) {
  return (
    <div className="dh-score-slot relative z-20 w-full shrink-0">
      <ScoreRingBar
        privacy={result.privacy}
        blastRadius={result.blastRadius}
        recovery={result.recovery}
        overall={result.total}
        placedCount={placedCount}
        totalDevices={totalDevices}
        mobile={mobile}
        compact
        riskItems={buildOpenRiskItems(result, difficulty)}
      />
      <DeltaFloater delta={scoreDelta} />
    </div>
  );
}

export type DigitalHouseAnalysisCardProps = Readonly<{
  lastPlacement: LastPlacement | null;
  selectedDevice: SelectedDeviceInfo;
  result: ScoreResult;
  desktop?: boolean;
}>;

export function DigitalHouseAnalysisCard(props: DigitalHouseAnalysisCardProps) {
  return (
    <div className="w-full shrink-0">
      <AnalysisStrip {...props} />
    </div>
  );
}
