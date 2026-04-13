export type ViewportBand = "phone" | "narrow" | "wide" | "ultra";

export function widthToBand(width: number): ViewportBand {
  if (width < 820) return "phone";
  if (width < 1280) return "narrow";
  if (width < 1536) return "wide";
  return "ultra";
}

export function isCompactDesktopLayout(width: number): boolean {
  return width >= 820 && width < 1100;
}

export function inventoryColumnsForRail(width: number, railWidth: number): 2 | 3 | 4 {
  if (isCompactDesktopLayout(width)) return 2;
  const band = widthToBand(width);
  if (band === "ultra" && railWidth >= 760) return 4;
  if ((band === "wide" || band === "ultra") && railWidth >= 520) return 3;
  return 2;
}
