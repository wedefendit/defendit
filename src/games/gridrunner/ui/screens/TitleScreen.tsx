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

import { useEffect, useState } from "react";

/**
 * Placeholder title screen. Will be replaced with name input,
 * new game / continue, and the full Tron aesthetic. For now it
 * proves the frame shell renders content correctly and shows
 * a loading state with a native <progress> element.
 */
export function TitleScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Randomized increment for an organic feel
        return Math.min(prev + Math.random() * 8 + 2, 100);
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      data-testid="gr-title-screen"
      aria-label="GRIDRUNNER title"
      className="flex flex-1 flex-col items-center justify-center gap-6 px-6"
      style={{ backgroundColor: "#0a0e1a" }}
    >
      <header className="flex flex-col items-center gap-2">
        <h1
          className="text-center font-mono text-2xl font-bold tracking-widest sm:text-4xl"
          style={{ color: "#00f0ff" }}
        >
          GRIDRUNNER
        </h1>
      </header>

      <div className="flex w-full max-w-xs flex-col items-center gap-2">
        <label
          htmlFor="gr-init-progress"
          className="font-mono text-xs tracking-wide sm:text-sm"
          style={{ color: "#00f0ff", opacity: 0.6 }}
        >
          {progress < 100 ? "INITIALIZING..." : "READY"}
        </label>
        <progress
          id="gr-init-progress"
          data-testid="gr-init-progress"
          value={progress}
          max={100}
          className="gr-progress h-2 w-full"
        >
          {Math.round(progress)}%
        </progress>
      </div>

      {/* Progress bar styling — uses native <progress> with
          vendor pseudo-elements for cross-browser Tron aesthetic */}
      <style>{`
        .gr-progress {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          border: 1px solid #1a3a4a;
          border-radius: 2px;
          background: #0a0e1a;
          overflow: hidden;
        }
        .gr-progress::-webkit-progress-bar {
          background: #0a0e1a;
          border-radius: 2px;
        }
        .gr-progress::-webkit-progress-value {
          background: #00f0ff;
          box-shadow: 0 0 8px #00f0ff, 0 0 2px #00f0ff;
          border-radius: 2px;
          transition: width 0.12s ease-out;
        }
        .gr-progress::-moz-progress-bar {
          background: #00f0ff;
          box-shadow: 0 0 8px #00f0ff, 0 0 2px #00f0ff;
          border-radius: 2px;
        }
      `}</style>
    </section>
  );
}
