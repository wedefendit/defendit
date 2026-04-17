"use client";

/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import type { SaveSummary } from "../../engine/types";
import { ZONE_LABELS } from "../../data/zones";
import DefendItShieldLogo from "../../../../components/Icons/Logo/defendit-shield-logo";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type BootPhase = "black" | "logo" | "copyright" | "hold" | "done";

type BootScreenProps = Readonly<{
  saveSummary: SaveSummary | null;
  onBootDone: () => void;
  onDeleteSave: () => void;
  onPlayChime: () => void;
}>;

/* ------------------------------------------------------------------ */
/*  Keyframes (referenced via Tailwind arbitrary animate-[...])       */
/* ------------------------------------------------------------------ */

const BOOT_KEYFRAMES = `
@keyframes gr-logo-drop {
  0% { transform: translateY(-48px); opacity: 0; }
  60% { transform: translateY(4px); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes gr-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes gr-scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
`;

/* ------------------------------------------------------------------ */
/*  Boot screen                                                       */
/* ------------------------------------------------------------------ */

export function BootScreen({
  saveSummary,
  onBootDone,
  onDeleteSave,
  onPlayChime,
}: BootScreenProps) {
  const [phase, setPhase] = useState<BootPhase>("black");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const bootDoneRef = useRef(onBootDone);
  const playChimeRef = useRef(onPlayChime);
  bootDoneRef.current = onBootDone;
  playChimeRef.current = onPlayChime;

  const skip = useCallback(() => {
    if (phase === "done") return;
    setPhase("done");
    bootDoneRef.current();
  }, [phase]);

  /* ---- Animation timeline ---- */
  useEffect(() => {
    const timers: ReturnType<typeof globalThis.setTimeout>[] = [];

    timers.push(globalThis.setTimeout(() => setPhase("logo"), 500));
    timers.push(
      globalThis.setTimeout(() => {
        setPhase("copyright");
        playChimeRef.current();
      }, 1300),
    );
    timers.push(globalThis.setTimeout(() => setPhase("hold"), 1800));
    timers.push(
      globalThis.setTimeout(() => {
        setPhase("done");
        bootDoneRef.current();
      }, 4300),
    );

    return () => timers.forEach((t) => globalThis.clearTimeout(t));
  }, []);

  /* ---- Skip on any key ---- */
  useEffect(() => {
    if (phase === "black" || phase === "done") return;

    function handleKey(e: KeyboardEvent) {
      e.preventDefault();
      skip();
    }

    globalThis.addEventListener("keydown", handleKey);
    return () => globalThis.removeEventListener("keydown", handleKey);
  }, [phase, skip]);

  if (phase === "done") return null;

  const showLogo =
    phase === "logo" || phase === "copyright" || phase === "hold";
  const showCopyright = phase === "copyright" || phase === "hold";

  return (
    <section
      data-testid="gr-boot-screen"
      aria-label="Boot sequence"
      className="flex flex-1 flex-col bg-black"
      onClick={phase !== "black" ? skip : undefined}
    >
      <style>{BOOT_KEYFRAMES}</style>

      {/* CRT scan line effect */}
      {showLogo && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-[0.03] animate-[gr-scan-line_2s_linear_infinite]"
        >
          <div className="h-1 w-full bg-[#00f0ff]" />
        </div>
      )}

      {/* Centered logo + copyright */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        {showLogo && (
          <div className="text-[#00f0ff] drop-shadow-[0_0_24px_rgba(0,240,255,0.25)] animate-[gr-logo-drop_0.8s_ease-out_forwards]">
            <DefendItShieldLogo
              className="h-20 w-auto sm:h-28"
              aria-label="Defend I.T. Solutions"
            />
          </div>
        )}

        {showCopyright && (
          <p className="gr-font-mono text-center text-[10px] tracking-[0.2em] text-[#aabbcc]/70 sm:text-xs animate-[gr-fade-in_0.5s_ease-out_forwards]">
            &copy; 2026 Defend I.T. Solutions LLC
          </p>
        )}
      </div>

      {/* Bottom bar: save slot info */}
      <footer
        data-testid="gr-boot-footer"
        className="flex shrink-0 items-center justify-between border-t border-[#1a3a4a]/20 px-4 py-2.5"
      >
        {saveSummary ? (
          <div className="flex items-center gap-2">
            <div className="gr-font-mono flex flex-col leading-tight">
              <span className="text-sm font-bold text-[#00f0ff] drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]">
                {saveSummary.playerName}
                <span className="ml-1.5 font-normal text-[#aabbcc]">
                  Lv.{saveSummary.level}
                </span>
              </span>
              <span className="text-[10px] text-[#4a5568]">
                {ZONE_LABELS[saveSummary.zone] ??
                  saveSummary.zone.toUpperCase()}
              </span>
            </div>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSave();
                    setConfirmDelete(false);
                  }}
                  className="gr-font-mono rounded-sm border border-[#ff003c] bg-[#1a0a10] px-2 py-0.5 text-[10px] font-bold text-[#ff003c] active:brightness-150"
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(false);
                  }}
                  className="gr-font-mono rounded-sm border border-[#1a3a4a] bg-[#0f1b2d] px-2 py-0.5 text-[10px] text-[#aabbcc] active:brightness-150"
                >
                  NO
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                aria-label="Delete save data"
                className="gr-font-mono rounded-sm border border-[#ff003c]/30 px-1.5 py-0.5 text-[10px] text-[#ff003c]/60 active:brightness-150"
              >
                DEL
              </button>
            )}
          </div>
        ) : (
          <span className="gr-font-mono text-[10px] text-[#4a5568]">
            No save data
          </span>
        )}
      </footer>
    </section>
  );
}
