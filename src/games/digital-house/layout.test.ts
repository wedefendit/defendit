import { describe, expect, it } from "vitest";
import { inventoryColumnsForRail, isCompactDesktopLayout, widthToBand } from "./layout";

describe("digital house layout helpers", () => {
  it("maps widths into the locked viewport bands", () => {
    expect(widthToBand(275)).toBe("phone");
    expect(widthToBand(819)).toBe("phone");
    expect(widthToBand(820)).toBe("narrow");
    expect(widthToBand(1279)).toBe("narrow");
    expect(widthToBand(1280)).toBe("wide");
    expect(widthToBand(1536)).toBe("ultra");
  });

  it("activates compact desktop only in the tablet band", () => {
    expect(isCompactDesktopLayout(819)).toBe(false);
    expect(isCompactDesktopLayout(820)).toBe(true);
    expect(isCompactDesktopLayout(998)).toBe(true);
    expect(isCompactDesktopLayout(1099)).toBe(true);
    expect(isCompactDesktopLayout(1100)).toBe(false);
  });

  it("keeps inventory at two columns until the rail can really support more", () => {
    expect(inventoryColumnsForRail(998, 640)).toBe(2);
    expect(inventoryColumnsForRail(1280, 460)).toBe(2);
    expect(inventoryColumnsForRail(1280, 560)).toBe(3);
    expect(inventoryColumnsForRail(1536, 760)).toBe(4);
  });
});
