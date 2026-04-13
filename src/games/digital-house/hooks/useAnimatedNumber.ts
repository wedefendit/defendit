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

import { useEffect, useRef, useState } from "react";

/**
 * Smoothly interpolates a displayed value toward a target whenever `target`
 * changes. Cleans up its requestAnimationFrame on unmount or re-target.
 *
 * Easing: ease-out cubic so big score swings feel snappy at the start and
 * settle softly.
 */
export function useAnimatedNumber(target: number, durationMs = 400): number {
  const [displayed, setDisplayed] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = displayed;
    startRef.current = null;

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (target - fromRef.current) * eased;
      setDisplayed(next);
      if (t < 1) {
        rafRef.current = globalThis.requestAnimationFrame(tick);
      }
    };

    rafRef.current = globalThis.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        globalThis.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    // displayed must be omitted — we only want to restart the animation when
    // the target changes, not on every frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return displayed;
}
