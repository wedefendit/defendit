"use client";

/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

type BattleTransitionProps = Readonly<{
  phase: "entering" | "exiting";
  onEnd: () => void;
}>;

const KEYFRAMES = `
@keyframes gr-bt-enter {
  0%   { opacity: 0; }
  20%  { opacity: 1; }
  100% { opacity: 1; }
}
@keyframes gr-bt-exit {
  0%   { opacity: 1; }
  60%  { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes gr-bt-shear-fast {
  0%   { transform: translate3d(0, 0, 0); }
  20%  { transform: translate3d(-4px, 0, 0); }
  40%  { transform: translate3d(3px, 1px, 0); }
  60%  { transform: translate3d(-2px, -1px, 0); }
  80%  { transform: translate3d(2px, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
`;

const ENTER_OUTER =
  "animate-[gr-bt-enter_400ms_steps(6,end)_forwards] " +
  "[&_.gr-bt-scan]:animate-[gr-bt-shear-fast_400ms_steps(6,end)] " +
  "[&_.gr-bt-shear]:animate-[gr-bt-shear-fast_400ms_steps(5,end)]";

const EXIT_OUTER =
  "animate-[gr-bt-exit_200ms_steps(4,end)_forwards] " +
  "[&_.gr-bt-scan]:animate-[gr-bt-shear-fast_200ms_steps(4,end)] " +
  "[&_.gr-bt-shear]:animate-[gr-bt-shear-fast_200ms_steps(3,end)]";

export function BattleTransition({ phase, onEnd }: BattleTransitionProps) {
  const animClasses = phase === "entering" ? ENTER_OUTER : EXIT_OUTER;
  return (
    <div
      data-testid="gr-battle-transition"
      data-phase={phase}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-40 overflow-hidden bg-[#0a0e1a] ${animClasses}`}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onEnd();
      }}
    >
      <style>{KEYFRAMES}</style>
      <div className="gr-bt-scan absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_3px,#00f0ff22_3px,#00f0ff22_4px)]" />
      <div className="gr-bt-shear absolute inset-0 mix-blend-screen bg-[linear-gradient(90deg,#ff003c33_0%,transparent_40%,transparent_60%,#00f0ff44_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#000000cc_100%)]" />
    </div>
  );
}
