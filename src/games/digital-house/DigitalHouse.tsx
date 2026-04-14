import { Flame, Sparkles } from "lucide-react";
import { useDigitalHouseController } from "./DigitalHouse.controller";
import {
  MobileScaledHouseFrame,
  ScaledHouseFrame,
} from "./ui/DigitalHouseBoard";
import { DigitalHouseHeader } from "./ui/DigitalHouseHeader";
import { CoachMark } from "./ui/CoachMark";
import { IdleHintBanner } from "./ui/IdleHint";
import { HelpModal } from "./ui/HelpModal";
import {
  AfterActionReportButton,
  DeviceStrip,
  DigitalHouseInventoryPanel,
} from "./ui/DigitalHouseInventory";
import { EndSummaryModal } from "./ui/EndSummaryModal";
import { GameToast } from "./ui/GameToast";
import {
  DigitalHouseAnalysisCard,
  DigitalHouseScoreHud,
} from "./ui/DigitalHouseStatusStrip";

export function DigitalHouse() {
  const c = useDigitalHouseController();

  const scoreHud = (
    <DigitalHouseScoreHud
      result={c.result}
      placedCount={c.placedIds.size}
      totalDevices={c.totalDevices}
      mobile={c.mobile}
      difficulty={c.difficulty}
      scoreDelta={c.scoreDelta}
    />
  );

  const analysisCard = (
    <DigitalHouseAnalysisCard
      lastPlacement={c.lastPlacement}
      selectedDevice={c.selectedDevice}
      result={c.result}
      desktop={!c.mobile}
    />
  );

  const inventoryCard = (
    <DigitalHouseInventoryPanel
      selectedId={c.selectedId}
      placedIds={c.placedIds}
      placedZones={c.placedZones}
      onSelect={c.handleSelect}
      onReturn={c.returnDevice}
      allowDrag={c.allowDrag}
      guided={c.guidedDeviceCards}
      deviceTone={c.deviceTone}
      columns={c.inventoryColumns}
      onTouchDragStart={c.houseProps.onTouchDragStart}
      showAfterAction={c.isComplete}
      score={c.result.total}
      riskCount={c.riskCount}
      onOpenAfterAction={c.openSummary}
    />
  );

  return (
    <div
      data-testid="dh-root"
      className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden text-slate-950 dark:text-slate-50"
    >
      {/* Keyframes */}
      <style>
        {[
          "@keyframes dh-popIn { 0% { transform: scale(0); opacity: 0 } 60% { transform: scale(1.2) } 100% { transform: scale(1); opacity: 1 } }",
          "@keyframes dh-dangerPulse { 0%, 100% { border-color: rgba(220,38,38,0.3) } 50% { border-color: rgba(220,38,38,1) } }",
          "@keyframes dh-slideIn { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }",
          "@keyframes dh-fadeIn { from { opacity: 0 } to { opacity: 1 } }",
          "@keyframes dh-staggerIn { from { transform: translateY(10px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }",
          "@keyframes dh-borderPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0) } 50% { box-shadow: 0 0 0 4px rgba(56,189,248,0.18) } }",
          "@keyframes dh-floatUp { 0% { transform: translateY(6px); opacity: 0 } 20% { opacity: 1 } 100% { transform: translateY(-26px); opacity: 0 } }",
          "@keyframes dh-toastIn { 0% { transform: translate(-50%, 24px); opacity: 0 } 10% { opacity: 1 } 90% { opacity: 1 } 100% { transform: translate(-50%, -6px); opacity: 0 } }",
          "@keyframes dh-hintPulse { 0%, 100% { opacity: 0.65; transform: translateY(0) } 50% { opacity: 1; transform: translateY(-3px) } }",
          "@keyframes dh-modalRise { 0% { transform: translateY(40px) scale(0.94); opacity: 0 } 60% { transform: translateY(-4px) scale(1.02); opacity: 1 } 100% { transform: translateY(0) scale(1); opacity: 1 } }",
          "@keyframes dh-comboPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.0), 0 0 0 0 rgba(56,189,248,0) } 50% { box-shadow: 0 0 0 2px rgba(239,68,68,0.4), 0 0 24px rgba(239,68,68,0.15) } }",
        ].join(" ")}
      </style>

      <DigitalHouseHeader onOpenHelp={c.openHelp} />

      {/* ======== MOBILE LAYOUT (base) ======== */}
      {c.mobile ? (
        <main
          data-testid="dh-main"
          className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden px-2 py-1"
        >
          {/* Score strip */}
          <div className="w-full shrink-0">{scoreHud}</div>

          {/* Analysis strip above the house */}
          <div className="w-full shrink-0">{analysisCard}</div>

          {/* House fills remaining vertical space */}
          <section
            data-testid="dh-house-panel"
            className="relative min-h-0 w-full flex-1 overflow-visible"
          >
            <MobileScaledHouseFrame {...c.houseProps} />

            {/* Idle hint floats over the house bottom */}
            {c.idleHint && !c.showOnboarding && (
              <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex justify-center">
                <IdleHintBanner
                  hint={c.idleHint}
                  onDismiss={c.dismissIdleHint}
                />
              </div>
            )}

            {/* Zone-blocked feedback */}
            {c.zoneBlockedFeedback && (
              <div
                key={c.zoneBlockedFeedback.key}
                style={{ animation: "dh-slideIn 0.3s ease" }}
                className="absolute inset-x-2 bottom-2 z-20 flex justify-center"
              >
                <div className="rounded-xl border border-amber-400/50 bg-amber-50/95 px-3 py-1.5 text-[12px] font-medium text-amber-800 shadow-lg dark:border-amber-400/30 dark:bg-amber-950/90 dark:text-amber-200">
                  Set this room&apos;s zone first. Use the zone chip in the
                  corner.
                </div>
              </div>
            )}
          </section>

          {/* Device strip centered */}
          <div className="w-full shrink-0 pt-1">
            <DeviceStrip
              selectedId={c.selectedId}
              placedIds={c.placedIds}
              placedZones={c.placedZones}
              onSelect={c.handleSelect}
              onReturn={c.returnDevice}
              allowDrag={c.allowDrag}
              guided={c.guidedDeviceCards}
              deviceTone={c.deviceTone}
              onTouchDragStart={c.houseProps.onTouchDragStart}
            />
          </div>
          {c.isComplete && (
            <div className="w-full shrink-0 px-1 pt-1">
              <AfterActionReportButton
                score={c.result.total}
                riskCount={c.riskCount}
                onOpen={c.openSummary}
              />
            </div>
          )}
        </main>
      ) : c.tablet ? (
        /* ======== TABLET LAYOUT (820-1099px) — stacked, viewport-locked ======== */
        <main
          data-testid="dh-main"
          className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden px-4 py-2"
        >
          <div className="mx-auto flex min-h-0 w-full max-w-[860px] flex-1 flex-col gap-1 overflow-hidden">
            {/* Score HUD with rings */}
            <div className="w-full shrink-0">{scoreHud}</div>

            {/* Analysis above house */}
            <div className="w-full shrink-0">{analysisCard}</div>

            {/* House — fills remaining space */}
            <section
              data-testid="dh-house-panel"
              className="relative min-h-0 w-full flex-1 overflow-visible"
            >
              <MobileScaledHouseFrame {...c.houseProps} />

              {/* Idle hint */}
              {c.idleHint && !c.showOnboarding && (
                <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex justify-center">
                  <IdleHintBanner
                    hint={c.idleHint}
                    onDismiss={c.dismissIdleHint}
                  />
                </div>
              )}
            </section>

            {/* Inventory — capped height, scrolls internally */}
            <div className="w-full min-h-0 overflow-y-auto max-h-[150px]">
              {inventoryCard}
            </div>
          </div>
        </main>
      ) : (
        /* ======== DESKTOP LAYOUT (1100px+) ======== */
        <main
          data-testid="dh-main"
          className="dh-game-main relative flex min-h-0 w-full flex-1 items-start justify-center overflow-hidden px-4 py-3 xl:px-6 xl:py-4"
        >
          <div className="my-auto flex min-h-0 w-full max-w-[1800px] items-start gap-4 xl:gap-5">
            <section
              data-testid="dh-house-panel"
              className="dh-house-panel relative flex min-h-0 flex-1 items-center justify-center self-stretch overflow-visible p-2 xl:p-3"
            >
              <ScaledHouseFrame {...c.houseProps} />

              {/* Idle hint */}
              {c.idleHint && !c.showOnboarding && (
                <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex justify-center">
                  <IdleHintBanner
                    hint={c.idleHint}
                    onDismiss={c.dismissIdleHint}
                  />
                </div>
              )}
            </section>

            <aside
              data-testid="dh-rail"
              ref={c.railRef}
              className="dh-sidebar-panel relative flex min-h-0 w-[380px] shrink-0 flex-col gap-3 self-stretch overflow-hidden p-1 xl:w-[440px] xl:gap-4 xl:p-2 2xl:w-[500px]"
            >
              {scoreHud}
              {analysisCard}
              <div className="min-h-0 flex-1 overflow-y-auto">
                {inventoryCard}
              </div>
            </aside>
          </div>
        </main>
      )}

      {/* ======== Overlays ======== */}

      {c.activeToast && (
        <GameToast
          key={c.activeToast.key}
          icon={
            c.activeToast.type === "halfway" ? (
              <Sparkles size={14} />
            ) : (
              <Flame size={14} />
            )
          }
          label={c.activeToast.label}
          hint={c.activeToast.hint}
          accent={c.activeToast.type === "halfway" ? "sky" : "amber"}
          mobile={c.mobile}
          bottomOffset={c.mobile ? 60 : 12}
        />
      )}

      {c.showOnboarding && (
        <CoachMark steps={c.coachStepsConfig} onDismiss={c.dismissOnboarding} />
      )}

      {c.helpOpen && <HelpModal onDismiss={c.dismissHelp} />}

      {c.showEnd && (
        <EndSummaryModal
          result={c.result}
          placements={c.placements}
          badge={c.badgeJustEarned}
          canTryHarder={c.difficulty !== "hard"}
          currentDifficulty={c.difficulty}
          mobile={c.mobile}
          onTryAgain={c.handleTryAgain}
          onTryHarder={c.onTryHarder}
          onDismiss={c.closeSummary}
        />
      )}
    </div>
  );
}
