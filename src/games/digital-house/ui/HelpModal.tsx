import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, HelpCircle, X } from "lucide-react";

export type HelpModalProps = Readonly<{
  onDismiss: (dontShowAgain: boolean) => void;
}>;

export function HelpModal({ onDismiss }: HelpModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    const el = dialogRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 12;
    setCanScroll(!atBottom && el.scrollHeight > el.clientHeight);
  }, []);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

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
      className="fixed inset-0 z-95 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur-md min-[768px]:p-8"
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
        ref={dialogRef}
        role="dialog"
        data-testid="dh-help-modal"
        aria-modal="true"
        aria-label="How to play"
        style={{
          animation: "dh-modalRise 0.5s cubic-bezier(0.22,1.2,0.36,1)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(148,163,184,0.3) transparent",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
        className="relative z-10 max-h-[calc(100dvh-48px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/96 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_58%)] p-4 text-slate-900 shadow-[0_30px_80px_rgba(15,23,42,0.18)] ring-1 ring-white/90 min-[768px]:max-w-xl min-[768px]:p-8 min-[1024px]:max-w-2xl sm:p-6 dark:border-sky-400/25 dark:bg-slate-900/96 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_58%)] dark:text-slate-100 dark:shadow-[0_30px_80px_rgba(2,6,23,0.6)] dark:ring-white/5"
      >
        <button
          type="button"
          onClick={() => onDismiss(false)}
          aria-label="Close"
          className="absolute right-4 top-4 touch-manipulation rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          style={{ touchAction: "manipulation" }}
        >
          <X size={18} />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/40 bg-sky-50/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-sky-700 dark:border-sky-400/25 dark:bg-slate-900/70 dark:text-sky-300">
            <HelpCircle size={13} /> How to Play
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-950 min-[1024px]:text-3xl dark:text-white">
            The Digital House
          </h2>
        </div>

        <div className="space-y-3 text-[15px] leading-relaxed text-slate-700 min-[768px]:text-base min-[1024px]:text-[17px] dark:text-slate-200">
          <p>
            Drag a device into a room to place it. On touch, you can also select
            a device and then select a room. The board updates in real time so
            you can see how trust, exposure, and recovery shift.
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            On Medium and Hard, use the room chips to set{" "}
            <strong style={{ color: "#38bdf8" }}>Main</strong>,{" "}
            <strong style={{ color: "#fbbf24" }}>Guest</strong>, or{" "}
            <strong style={{ color: "#a78bfa" }}>IoT</strong>. Locked chips stay
            fixed. Drag a placed device to another room, or select it again to
            move it on touch.
          </p>
        </div>

        <div className="mt-6">
          <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
            Network Zones
          </div>
          <ul className="space-y-2.5 text-[15px] text-slate-700 min-[768px]:text-base min-[1024px]:text-[17px] dark:text-slate-200">
            <li className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1.5 inline-block h-3 w-3 shrink-0 rounded-sm"
                style={{ background: "#38bdf8" }}
              />
              <span>
                <strong style={{ color: "#38bdf8" }}>Main</strong> is for your
                trusted everyday devices.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1.5 inline-block h-3 w-3 shrink-0 rounded-sm"
                style={{ background: "#fbbf24" }}
              />
              <span>
                <strong style={{ color: "#fbbf24" }}>Guest</strong> is for
                visitors and short-term devices.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1.5 inline-block h-3 w-3 shrink-0 rounded-sm"
                style={{ background: "#a78bfa" }}
              />
              <span>
                <strong style={{ color: "#a78bfa" }}>IoT</strong> is for smart
                devices that should stay contained.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700/70">
          <label className="flex items-center gap-2 text-[13px] font-medium text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) =>
                setDontShowAgain(event.currentTarget.checked)
              }
              className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400"
            />
            <span>Don&apos;t show again</span>
          </label>
          <button
            type="button"
            onClick={() => onDismiss(dontShowAgain)}
            className="inline-flex touch-manipulation items-center justify-center rounded-xl border border-sky-400/40 bg-sky-500/12 px-5 py-2.5 text-[15px] font-bold text-sky-700 transition-colors hover:bg-sky-500/18 dark:border-sky-400/25 dark:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-sky-500/20"
            style={{ touchAction: "manipulation" }}
          >
            Dismiss
          </button>
        </div>

        {/* Scroll hint -- fades out when user reaches bottom */}
        {canScroll && (
          <div
            aria-hidden
            className="pointer-events-none sticky -bottom-4 left-0 right-0 flex justify-center pb-1 sm:-bottom-6"
          >
            <div className="absolute inset-x-0 bottom-0 h-12 rounded-b-2xl bg-gradient-to-t from-white/95 via-white/60 to-transparent dark:from-slate-900/95 dark:via-slate-900/60" />
            <div
              className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300/60 bg-white/90 text-slate-500 shadow-sm dark:border-slate-600/60 dark:bg-slate-800/90 dark:text-slate-400"
              style={{ animation: "dh-hintPulse 2s ease infinite" }}
            >
              <ChevronDown size={14} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
