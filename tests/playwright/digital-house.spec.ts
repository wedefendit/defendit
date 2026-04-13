import fs from "node:fs";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

const ROUTE = "/awareness/digital-house";
const PHONE_VIEWPORTS = [
  { width: 275, height: 600 },
  { width: 320, height: 828 },
  { width: 360, height: 640 },
  { width: 360, height: 800 },   // Samsung Galaxy A51/71
  { width: 375, height: 667 },   // iPhone SE
  { width: 390, height: 844 },   // iPhone 12 Pro
  { width: 393, height: 852 },   // Pixel 7
  { width: 412, height: 915 },   // Samsung Galaxy S20 Ultra
  { width: 414, height: 896 },   // iPhone XR
  { width: 428, height: 926 },   // iPhone 14 Pro Max
  { width: 540, height: 720 },   // Surface Duo
  { width: 344, height: 882 },   // Galaxy Z Fold 5 (folded)
  { width: 763, height: 768 },
  { width: 768, height: 1024 },  // iPad Mini
];
const DESKTOP_VIEWPORTS = [
  { width: 820, height: 768 },
  { width: 820, height: 1180 },  // iPad Air
  { width: 912, height: 1368 },
  { width: 998, height: 1130 },
  { width: 1022, height: 768 },
  { width: 1024, height: 1366 }, // iPad Pro
  { width: 1114, height: 834 },  // Surface Pro 7
  { width: 1280, height: 800 },  // Asus Zenbook Fold / Nest Hub Max
  { width: 1366, height: 768 },
  { width: 1024, height: 600 },  // Nest Hub
  { width: 1920, height: 1080 },
];
type Difficulty = "easy" | "medium";
type Viewport = { width: number; height: number };
type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  position: string;
} | null;

type Metrics = {
  documentScrollWidth: number;
  documentScrollHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  header: Box;
  house: Box;
  rail: Box;
  status: Box;
  score: Box;
  analysis: Box;
  inventory: Box;
  task: Box;
  tray: Box;
  zoneExterior: Box;
};

async function stabilize(page: Page) {
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;scroll-behavior:auto!important}",
  });
}

async function openGame(page: Page, difficulty: Difficulty) {
  await page.goto(ROUTE, { waitUntil: "networkidle" });
  await expect(page.getByTestId("dh-root")).toBeVisible();
  await stabilize(page);
  const helpModal = page.getByTestId("dh-help-modal");
  await expect(helpModal).toBeVisible();
  await page.getByRole("button", { name: /dismiss/i }).click();
  await expect(helpModal).toHaveCount(0);
  const difficultyPattern =
    difficulty === "medium" ? /med(ium)?/i : new RegExp(difficulty, "i");
  await page.getByRole("radio", { name: difficultyPattern }).click();
  await expect(page.getByTestId("dh-house-panel")).toBeVisible();
  await page.waitForTimeout(120);
}

async function attachScreenshot(
  page: Page,
  testInfo: TestInfo,
  name: string,
  options: { fullPage?: boolean } = {},
) {
  const path = testInfo.outputPath(name + ".png");
  await page.screenshot({ path, fullPage: options.fullPage ?? false });
  await testInfo.attach(name, { path, contentType: "image/png" });
}

async function collectMetrics(page: Page): Promise<Metrics> {
  return page.evaluate(() => {
    const getBox = (selector: string) => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom,
        clientWidth: el.clientWidth,
        clientHeight: el.clientHeight,
        scrollWidth: el.scrollWidth,
        scrollHeight: el.scrollHeight,
        position: getComputedStyle(el).position,
      };
    };
    return {
      documentScrollWidth:
        document.scrollingElement?.scrollWidth ?? document.body.scrollWidth,
      documentScrollHeight:
        document.scrollingElement?.scrollHeight ?? document.body.scrollHeight,
      header: getBox('[data-testid="dh-header"]'),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      house: getBox('[data-testid="dh-house-panel"]'),
      rail: getBox('[data-testid="dh-rail"]'),
      status: getBox("[data-testid=\"dh-status-strip\"]"),
      score: getBox('[data-testid="dh-score-hud"]'),
      analysis: getBox('[data-testid="dh-analysis-card"]'),
      inventory: getBox("[data-testid=\"dh-inventory-panel\"]"),
      task: getBox('[data-testid="dh-task-panel"]'),
      tray: getBox('[data-testid="dh-mobile-tray"]'),
      zoneExterior: getBox('[data-testid="dh-zone-room-entry-exterior"]'),
    };
  });
}

async function attachMetrics(
  page: Page,
  testInfo: TestInfo,
  name: string,
): Promise<Metrics> {
  const metrics = await collectMetrics(page);
  const path = testInfo.outputPath(name + ".json");
  fs.writeFileSync(path, JSON.stringify(metrics, null, 2));
  await testInfo.attach(name, { path, contentType: "application/json" });
  return metrics;
}

async function deviceLabelFits(page: Page, deviceId: string) {
  return page.getByTestId("dh-device-" + deviceId).evaluate((el) => {
    const labels = Array.from(el.querySelectorAll("span"));
    const label = labels[labels.length - 1] as HTMLElement | undefined;
    if (!label) return false;
    return label.clientWidth >= 28 && label.scrollWidth <= label.clientWidth + 1;
  });
}

async function roomHasDevice(page: Page, roomId: string, title: string) {
  return page
    .getByTestId("dh-room-" + roomId)
    .locator("button[title]")
    .evaluateAll(
      (els, wanted) =>
        els.filter(
          (el) =>
            (el.getAttribute("title") ?? "").toLowerCase() ===
            (wanted as string).toLowerCase(),
        ).length,
      title,
    );
}

test.describe("Digital House desktop audit", () => {
  test.use({ hasTouch: false, isMobile: false });

  for (const viewport of DESKTOP_VIEWPORTS) {
    for (const difficulty of ["easy", "medium"] as const) {
      test(`desktop ${difficulty} ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
        await page.setViewportSize(viewport);
        await openGame(page, difficulty);

        const baseName = `desktop-${difficulty}-${viewport.width}x${viewport.height}`;
        await attachScreenshot(page, testInfo, baseName);
        let metrics = await attachMetrics(page, testInfo, baseName + "-metrics");

        // No horizontal overflow
        expect(metrics.documentScrollWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);

        // All key elements exist
        expect(metrics.header).not.toBeNull();
        expect(metrics.house).not.toBeNull();
        expect(metrics.rail).not.toBeNull();
        expect(metrics.score).not.toBeNull();
        expect(metrics.analysis).not.toBeNull();
        expect(metrics.inventory).not.toBeNull();
        await expect(page.getByTestId("dh-inventory-panel")).toBeVisible();

        if (metrics.header && metrics.house && metrics.rail && metrics.score && metrics.analysis && metrics.inventory) {
          // House and rail are side by side below the header
          expect(metrics.house.y).toBeGreaterThanOrEqual(metrics.header.bottom - 2);
          expect(metrics.rail.y).toBeGreaterThanOrEqual(metrics.header.bottom - 2);

          // House is to the LEFT of the rail
          expect(metrics.house.right).toBeLessThanOrEqual(metrics.rail.x + 8);

          // House panel is wider than the rail
          expect(metrics.house.width).toBeGreaterThan(metrics.rail.width - 20);

          // Score, analysis, inventory are all in the rail (right side)
          expect(metrics.score.x).toBeGreaterThanOrEqual(metrics.rail.x - 2);
          expect(metrics.analysis.x).toBeGreaterThanOrEqual(metrics.rail.x - 2);
          expect(metrics.inventory.x).toBeGreaterThanOrEqual(metrics.rail.x - 2);

          // Score is above analysis, analysis is above inventory (stacked in rail)
          expect(metrics.analysis.y).toBeGreaterThanOrEqual(metrics.score.bottom - 4);
          expect(metrics.inventory.y).toBeGreaterThanOrEqual(metrics.analysis.bottom - 4);

          // Nothing overflows the viewport
          expect(metrics.score.right).toBeLessThanOrEqual(metrics.viewportWidth + 1);
          expect(metrics.analysis.right).toBeLessThanOrEqual(metrics.viewportWidth + 1);
          expect(metrics.inventory.right).toBeLessThanOrEqual(metrics.viewportWidth + 1);
          expect(metrics.rail.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 4);

          // Inventory should be content-height, NOT stretched to viewport bottom.
          // If inventory bottom is near rail bottom AND there's big empty space
          // below the last device card, the inventory is wasting vertical space.
          const inventoryUsedHeight = metrics.inventory.scrollHeight;
          const inventoryRenderedHeight = metrics.inventory.height;
          // Allow 40px slack for padding, but inventory height shouldn't be
          // more than 2x its scroll content height.
          expect(inventoryRenderedHeight).toBeLessThan(inventoryUsedHeight * 2 + 40);
        }

        if (viewport.width < 1280 && difficulty === "medium") {
          await expect(page.getByTestId("dh-room-zone-bedroom")).toBeVisible();
          await expect(page.getByTestId("dh-room-zone-entry-exterior")).toBeVisible();
          expect(await deviceLabelFits(page, "work-laptop")).toBeTruthy();
          expect(await deviceLabelFits(page, "guest-phone")).toBeTruthy();
          expect(await deviceLabelFits(page, "doorbell-camera")).toBeTruthy();
        }

        if (viewport.width >= 1280 && difficulty === "medium") {
          await expect(page.getByRole("button", { name: /room zones/i })).toHaveCount(0);
          await expect(page.getByTestId("dh-room-zone-bedroom")).toBeVisible();
          await expect(page.getByTestId("dh-room-zone-entry-exterior")).toBeVisible();
        }
      });
    }
  }

  test("help modal opens on first visit and dont-show-again suppresses future auto-open", async ({ page }, testInfo) => {
    const viewport = { width: 390, height: 844 };
    await page.setViewportSize(viewport);
    await page.goto(ROUTE, { waitUntil: "networkidle" });
    await stabilize(page);

    const helpModal = page.getByTestId("dh-help-modal");
    await expect(helpModal).toBeVisible();
    await page.getByRole("checkbox", { name: /don't show again/i }).check();
    await page.getByRole("button", { name: /dismiss/i }).click();
    await expect(helpModal).toHaveCount(0);

    await page.reload({ waitUntil: "networkidle" });
    await stabilize(page);
    await expect(page.getByTestId("dh-help-modal")).toHaveCount(0);

    await attachScreenshot(page, testInfo, "help-modal-dont-show-again");
  });

  test("desktop drag between rooms still works", async ({ page }, testInfo) => {
    const viewport = { width: 1366, height: 768 };
    await page.setViewportSize(viewport);
    await openGame(page, "easy");

    await page.getByTestId("dh-device-work-laptop").dragTo(page.getByTestId("dh-room-office"));
    await expect(page.getByTestId("dh-analysis-card")).not.toContainText("Pick a device to begin.");

    const officeChip = page
      .getByTestId("dh-room-office")
      .getByRole("button", { name: /^work laptop/i });
    await officeChip.dragTo(page.getByTestId("dh-room-kitchen"));

    expect(await roomHasDevice(page, "office", "Work laptop")).toBe(0);
    expect(await roomHasDevice(page, "kitchen", "Work laptop")).toBe(1);

    await attachScreenshot(page, testInfo, "desktop-drag-between-rooms");
    await attachMetrics(page, testInfo, "desktop-drag-between-rooms-metrics");
  });
});

test.describe("Digital House phone audit", () => {
  test.use({ hasTouch: true, isMobile: true });

  for (const viewport of PHONE_VIEWPORTS) {
    test(`phone medium ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await openGame(page, "medium");

      const baseName = `phone-medium-${viewport.width}x${viewport.height}`;
      await attachScreenshot(page, testInfo, baseName);
      const metrics = await attachMetrics(page, testInfo, baseName + "-metrics");

      expect(metrics.score).not.toBeNull();
      expect(metrics.house).not.toBeNull();
      expect(metrics.tray).not.toBeNull();
      expect(metrics.analysis).not.toBeNull();

      if (metrics.score && metrics.house && metrics.header && metrics.tray && metrics.analysis) {
        expect(metrics.score.y).toBeGreaterThanOrEqual(metrics.header.bottom - 2);
        expect(metrics.score.bottom).toBeLessThanOrEqual(metrics.house.y + 10);
        expect(metrics.house.right).toBeLessThanOrEqual(metrics.viewportWidth + 1);
        expect(metrics.score.right).toBeLessThanOrEqual(metrics.viewportWidth + 1);
        expect(metrics.analysis.right).toBeLessThanOrEqual(metrics.viewportWidth + 1);
        expect(metrics.tray.position).toBe("fixed");
        expect(metrics.tray.right).toBeLessThanOrEqual(metrics.viewportWidth + 1);
        expect(metrics.tray.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);

        // House must NOT push analysis so far down that the user has to
        // scroll endlessly. On phone the content area scrolls, so analysis
        // CAN be below the tray — but not by more than ~40% of viewport
        // height (that would mean the house is hogging too much space).
        const trayTop = metrics.tray.y;
        const analysisBottom = metrics.analysis.bottom;
        const maxScroll = metrics.viewportHeight * 0.4;
        expect(analysisBottom).toBeLessThan(trayTop + maxScroll);
      }

      const canScroll = await page.evaluate(() => {
        const scrollHeight =
          document.scrollingElement?.scrollHeight ?? document.body.scrollHeight;
        return scrollHeight > window.innerHeight + 4;
      });
      const startScroll = await page.evaluate(() => window.scrollY);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(100);
      const endScroll = await page.evaluate(() => window.scrollY);
      if (canScroll) expect(endScroll).toBeGreaterThan(startScroll);

      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);

      await page.getByTestId("dh-room-zone-bedroom").click();
      await expect(page.getByTestId("dh-room-zone-popover-bedroom")).toBeVisible();
      await page.getByTestId("dh-room-zone-option-bedroom-main").click();
      await expect(page.getByTestId("dh-room-zone-popover-bedroom")).toHaveCount(0);

      await page.getByTestId("dh-device-personal-phone").click();
      await page.getByTestId("dh-room-bedroom").click();
      await expect(page.getByTestId("dh-analysis-card")).not.toContainText("Pick a device to begin.");
      expect(await roomHasDevice(page, "bedroom", "Personal phone")).toBe(1);

      await page.getByTestId("dh-device-personal-phone").click();
      await page.getByTestId("dh-room-office").click();
      expect(await roomHasDevice(page, "bedroom", "Personal phone")).toBe(0);
      expect(await roomHasDevice(page, "office", "Personal phone")).toBe(1);
    });
  }

  test("help modal dismisses with touch tap on phone", async ({ page }, testInfo) => {
    const viewport = { width: 390, height: 844 };
    await page.setViewportSize(viewport);
    await page.goto(ROUTE, { waitUntil: "networkidle" });
    await stabilize(page);

    const helpModal = page.getByTestId("dh-help-modal");
    await expect(helpModal).toBeVisible();
    await page.getByRole("button", { name: /dismiss/i }).tap();
    await expect(helpModal).toHaveCount(0);

    await attachScreenshot(page, testInfo, "help-modal-touch-dismiss");
  });
  test("theme toggle updates Digital House chrome", async ({ page }, testInfo) => {
    const viewport = { width: 390, height: 844 };
    await page.setViewportSize(viewport);
    await openGame(page, "medium");

    await page.getByRole("button", { name: /how to play/i }).click();
    const helpModal = page.getByTestId("dh-help-modal");
    await expect(helpModal).toBeVisible();
    const helpBefore = await helpModal.evaluate((el) => getComputedStyle(el).backgroundColor);
    await page.keyboard.press("Escape");

    const scoreBefore = await page.getByTestId("dh-score-hud").evaluate((el) => getComputedStyle(el).backgroundColor);
    const trayBefore = await page.getByTestId("dh-mobile-tray").evaluate((el) => getComputedStyle(el).backgroundColor);

    await page.getByRole("button", { name: /switch to light mode/i }).click();
    await page.waitForTimeout(120);

    const scoreAfter = await page.getByTestId("dh-score-hud").evaluate((el) => getComputedStyle(el).backgroundColor);
    const trayAfter = await page.getByTestId("dh-mobile-tray").evaluate((el) => getComputedStyle(el).backgroundColor);

    await page.getByRole("button", { name: /how to play/i }).click();
    const helpAfter = await page.getByTestId("dh-help-modal").evaluate((el) => getComputedStyle(el).backgroundColor);


    expect(scoreAfter).not.toBe(scoreBefore);
    expect(trayAfter).not.toBe(trayBefore);
    expect(helpAfter).not.toBe(helpBefore);

    await attachScreenshot(page, testInfo, "theme-light-mobile");
    await attachMetrics(page, testInfo, "theme-light-mobile-metrics");
  });
});
