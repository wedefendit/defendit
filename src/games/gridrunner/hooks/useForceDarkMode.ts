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

import { useEffect } from "react";

/**
 * Forces dark mode on `<html>` for the lifetime of the calling component.
 * On unmount, restores whatever theme the user had stored in localStorage.
 *
 * Used by GRIDRUNNER (and any future dark-only game) so the site chrome
 * (nav, etc.) renders in dark mode to match the game aesthetic.
 */
export function useForceDarkMode() {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");

    // Force dark
    root.classList.add("dark");

    return () => {
      // Restore previous state on unmount
      const stored = localStorage.getItem("theme");
      if (stored === "light" || !hadDark) {
        root.classList.remove("dark");
      }
    };
  }, []);
}
