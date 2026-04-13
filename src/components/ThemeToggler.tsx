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
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

type ThemeToggleProps = Readonly<{
  placement?: "fixed" | "inline";
}>;

export function ThemeToggle({ placement = "fixed" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  const applyTheme = (t: Theme) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  };

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme;
    setTheme(stored === "light" || stored === "dark" ? stored : "dark");
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme, mounted]);

  if (!mounted) {
    return placement === "inline" ? (
      <span aria-hidden className="inline-flex h-8 w-8 shrink-0" />
    ) : null;
  }

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const next = theme === "light" ? "dark" : "light";
  const buttonClass =
    placement === "inline"
      ? "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300/70 bg-white/80 p-1.5 text-black shadow-sm transition-colors hover:cursor-pointer hover:border-slate-400 hover:bg-slate-100 hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] dark:border-slate-700 dark:bg-gray-800/80 dark:text-white dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
      : "fixed bottom-1 left-2 z-[150] rounded-full bg-white p-2 text-xl text-black shadow-md transition-colors hover:cursor-pointer hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] lg:bottom-auto lg:left-auto lg:right-4 lg:top-2 lg:z-15 dark:bg-gray-800 dark:text-white dark:hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={buttonClass}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
