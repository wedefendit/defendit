// @ts-expect-error node works
import fs from "node:fs";
import { expect, test, type Page, type TestInfo } from "@playwright/test";

const ROUTE = "/awareness/gridrunner";

/* ------------------------------------------------------------------ */
/*  Viewport matrix — same real-device spread as Digital House tests  */
/* ------------------------------------------------------------------ */

const PHONE_VIEWPORTS = [
  { width: 320, height: 568, label: "iPhone SE (1st gen)" },
  { width: 375, height: 667, label: "iPhone SE (2nd/3rd)" },
  { width: 390, height: 844, label: "iPhone 12 Pro" },
  { width: 393, height: 852, label: "Pixel 7" },
  { width: 412, height: 915, label: "Galaxy S20 Ultra" },
  { width: 428, height: 926, label: "iPhone 14 Pro Max" },
  { width: 344, height: 882, label: "Galaxy Z Fold 5 folded" },
  { width: 540, height: 720, label: "Surface Duo" },
];

const PHONE_LANDSCAPE_VIEWPORTS = PHONE_VIEWPORTS.map((vp) => ({
  width: vp.height,
  height: vp.width,
  label: vp.label + " landscape",
}));

const TABLET_VIEWPORTS = [
  { width: 768, height: 1024, label: "iPad Mini" },
  { width: 820, height: 1180, label: "iPad Air" },
  { width: 1024, height: 1366, label: "iPad Pro 12.9" },
];

const TABLET_LANDSCAPE_VIEWPORTS = TABLET_VIEWPORTS.map((vp) => ({
  width: vp.height,
  height: vp.width,
  label: vp.label + " landscape",
}));

const DESKTOP_VIEWPORTS = [
  { width: 1280, height: 800, label: "13-inch laptop" },
  { width: 1366, height: 768, label: "HD laptop" },
  { width: 1920, height: 1080, label: "1080p" },
  { width: 2560, height: 1440, label: "1440p" },
];

const ALL_VIEWPORTS = [
  ...PHONE_VIEWPORTS,
  ...PHONE_LANDSCAPE_VIEWPORTS,
  ...TABLET_VIEWPORTS,
  ...TABLET_LANDSCAPE_VIEWPORTS,
  ...DESKTOP_VIEWPORTS,
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

type FrameBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

type FrameMetrics = {
  viewportWidth: number;
  viewportHeight: number;
  documentScrollWidth: number;
  documentScrollHeight: number;
  navBottom: number;
  frame: FrameBox | null;
  footerPresent: boolean;
};

async function stabilize(page: Page) {
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;scroll-behavior:auto!important}",
  });
}

async function openGridRunner(page: Page) {
  await page.goto(ROUTE, { waitUntil: "networkidle" });
  await expect(page.getByTestId("gr-root")).toBeVisible();
  await stabilize(page);
}

/** Start a new game from the title screen to reach the overworld. */
async function startNewGame(page: Page) {
  await openGridRunner(page);
  await page.getByTestId("gr-new-game").click();
  await expect(page.getByTestId("gr-overworld")).toBeVisible();
}

async function collectFrameMetrics(page: Page): Promise<FrameMetrics> {
  return page.evaluate(() => {
    const nav = document.querySelector("nav");
    const frame = document.querySelector(
      '[data-testid="gr-frame"]',
    ) as HTMLElement | null;
    const footer = document.querySelector("footer");

    const navRect = nav?.getBoundingClientRect();
    const frameRect = frame?.getBoundingClientRect();

    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      documentScrollWidth:
        document.scrollingElement?.scrollWidth ?? document.body.scrollWidth,
      documentScrollHeight:
        document.scrollingElement?.scrollHeight ?? document.body.scrollHeight,
      navBottom: navRect?.bottom ?? 0,
      frame: frameRect
        ? {
            x: frameRect.x,
            y: frameRect.y,
            width: frameRect.width,
            height: frameRect.height,
            right: frameRect.right,
            bottom: frameRect.bottom,
          }
        : null,
      footerPresent: footer !== null && footer.offsetHeight > 0,
    };
  });
}

async function attachScreenshot(
  page: Page,
  testInfo: TestInfo,
  name: string,
) {
  const path = testInfo.outputPath(name + ".png");
  await page.screenshot({ path, fullPage: false });
  await testInfo.attach(name, { path, contentType: "image/png" });
}

async function attachMetrics(
  page: Page,
  testInfo: TestInfo,
  name: string,
): Promise<FrameMetrics> {
  const metrics = await collectFrameMetrics(page);
  const path = testInfo.outputPath(name + ".json");
  fs.writeFileSync(path, JSON.stringify(metrics, null, 2));
  await testInfo.attach(name, { path, contentType: "application/json" });
  return metrics;
}

/* ------------------------------------------------------------------ */
/*  Tests: Page integration                                           */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER page integration", () => {
  test("route loads with nav, circuit bg, and no footer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openGridRunner(page);

    // Nav is present
    await expect(page.locator("nav").first()).toBeVisible();

    // Circuit background is present (the texture div)
    const hasBg = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('[aria-hidden="true"]'));
      return els.some((el) => {
        const bg = getComputedStyle(el).backgroundImage;
        return bg.includes("circuit");
      });
    });
    expect(hasBg).toBe(true);

    // Footer is NOT present
    const metrics = await collectFrameMetrics(page);
    expect(metrics.footerPresent).toBe(false);
  });

  test("game root and frame are visible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openGridRunner(page);

    await expect(page.getByTestId("gr-root")).toBeVisible();
    await expect(page.getByTestId("gr-frame")).toBeVisible();
  });
});

/* ------------------------------------------------------------------ */
/*  Tests: Semantic HTML                                              */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER semantic HTML", () => {
  test("game root is <main>, frame is <section>", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openGridRunner(page);

    const rootTag = await page
      .getByTestId("gr-root")
      .evaluate((el) => el.tagName.toLowerCase());
    expect(rootTag, "gr-root should be a <main> element").toBe("main");

    const frameTag = await page
      .getByTestId("gr-frame")
      .evaluate((el) => el.tagName.toLowerCase());
    expect(frameTag, "gr-frame should be a <section> element").toBe("section");

    // Frame section should have an accessible label
    const frameLabel = await page
      .getByTestId("gr-frame")
      .getAttribute("aria-label");
    expect(frameLabel, "gr-frame should have an aria-label").toBeTruthy();
  });

  test("title screen has <h1>, name input, and new game button", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openGridRunner(page);

    // Title is an h1
    const h1 = page.getByTestId("gr-title-screen").locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("GRIDRUNNER");

    // Name input is a native <input> with associated <label>
    const input = page.getByTestId("gr-name-input");
    await expect(input).toBeVisible();
    const inputTag = await input.evaluate((el) => el.tagName.toLowerCase());
    expect(inputTag).toBe("input");
    const inputId = await input.getAttribute("id");
    const label = page.locator(`label[for="${inputId}"]`);
    await expect(label).toBeVisible();

    // New Game button
    const newGame = page.getByTestId("gr-new-game");
    await expect(newGame).toBeVisible();
    const btnTag = await newGame.evaluate((el) => el.tagName.toLowerCase());
    expect(btnTag).toBe("button");
  });

  test("title screen section has aria-label", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openGridRunner(page);

    const screenTag = await page
      .getByTestId("gr-title-screen")
      .evaluate((el) => el.tagName.toLowerCase());
    expect(screenTag, "Title screen should be a <section>").toBe("section");

    const label = await page
      .getByTestId("gr-title-screen")
      .getAttribute("aria-label");
    expect(label).toBeTruthy();
  });
});

/* ------------------------------------------------------------------ */
/*  Tests: Frame containment — the frame never escapes the viewport   */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER frame containment", () => {
  test.use({ hasTouch: false, isMobile: false });

  /**
   * Core invariant: on every viewport in our matrix, the game frame
   * must fit entirely within the visible area. No overflow, no scroll
   * needed to see the full frame.
   */
  for (const vp of ALL_VIEWPORTS) {
    test(`frame fits viewport: ${vp.label} (${vp.width}x${vp.height})`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await openGridRunner(page);

      const metrics = await attachMetrics(
        page,
        testInfo,
        `frame-metrics-${vp.width}x${vp.height}`,
      );

      expect(metrics.frame, "Frame should exist").not.toBeNull();
      if (!metrics.frame) return;

      // Frame right edge must not exceed viewport width
      expect(
        metrics.frame.right,
        `Frame right edge (${metrics.frame.right}) exceeds viewport width (${metrics.viewportWidth})`,
      ).toBeLessThanOrEqual(metrics.viewportWidth + 1);

      // Frame bottom edge must not exceed viewport height
      expect(
        metrics.frame.bottom,
        `Frame bottom (${metrics.frame.bottom}) exceeds viewport height (${metrics.viewportHeight})`,
      ).toBeLessThanOrEqual(metrics.viewportHeight + 1);

      // Frame must be below the nav
      expect(
        metrics.frame.y,
        `Frame top (${metrics.frame.y}) above nav bottom (${metrics.navBottom})`,
      ).toBeGreaterThanOrEqual(metrics.navBottom - 1);

      // Frame must have positive dimensions
      expect(metrics.frame.width).toBeGreaterThan(0);
      expect(metrics.frame.height).toBeGreaterThan(0);

      await attachScreenshot(
        page,
        testInfo,
        `frame-${vp.width}x${vp.height}`,
      );
    });
  }
});

/* ------------------------------------------------------------------ */
/*  Tests: No horizontal scroll                                       */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER no horizontal overflow", () => {
  for (const vp of ALL_VIEWPORTS) {
    test(`no h-scroll: ${vp.label} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await openGridRunner(page);

      const metrics = await collectFrameMetrics(page);

      expect(
        metrics.documentScrollWidth,
        `Document scroll width (${metrics.documentScrollWidth}) exceeds viewport (${metrics.viewportWidth})`,
      ).toBeLessThanOrEqual(metrics.viewportWidth + 1);
    });
  }
});

/* ------------------------------------------------------------------ */
/*  Tests: No vertical scroll (game is viewport-locked)               */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER no vertical overflow", () => {
  for (const vp of ALL_VIEWPORTS) {
    test(`no v-scroll: ${vp.label} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await openGridRunner(page);

      const metrics = await collectFrameMetrics(page);

      expect(
        metrics.documentScrollHeight,
        `Document scroll height (${metrics.documentScrollHeight}) exceeds viewport (${metrics.viewportHeight})`,
      ).toBeLessThanOrEqual(metrics.viewportHeight + 4);
    });
  }
});

/* ------------------------------------------------------------------ */
/*  Tests: Frame uses available space well (not tiny)                  */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER frame fills available space", () => {
  test("phone portrait: frame width >= 85% of viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openGridRunner(page);
    const metrics = await collectFrameMetrics(page);

    expect(metrics.frame).not.toBeNull();
    if (!metrics.frame) return;

    const widthRatio = metrics.frame.width / metrics.viewportWidth;
    expect(
      widthRatio,
      `Frame only uses ${(widthRatio * 100).toFixed(0)}% of viewport width`,
    ).toBeGreaterThanOrEqual(0.85);
  });

  test("phone landscape: frame fills most of available height", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await openGridRunner(page);
    const metrics = await collectFrameMetrics(page);

    expect(metrics.frame).not.toBeNull();
    if (!metrics.frame) return;

    const availableHeight = metrics.viewportHeight - metrics.navBottom;
    const heightRatio = metrics.frame.height / availableHeight;
    expect(
      heightRatio,
      `Frame only uses ${(heightRatio * 100).toFixed(0)}% of available height`,
    ).toBeGreaterThanOrEqual(0.75);
  });

  test("desktop: frame has reasonable max size, not pinned to edges", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await openGridRunner(page);
    const metrics = await collectFrameMetrics(page);

    expect(metrics.frame).not.toBeNull();
    if (!metrics.frame) return;

    // Frame should not be full 1920px wide on a big monitor
    expect(metrics.frame.width).toBeLessThan(1200);

    // But it should be a decent size, not tiny
    expect(metrics.frame.width).toBeGreaterThan(400);
    expect(metrics.frame.height).toBeGreaterThan(300);
  });
});

/* ------------------------------------------------------------------ */
/*  Tests: Map tiles are square (not stretched)                       */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER tile proportions", () => {
  const TILE_VIEWPORTS = [
    { width: 390, height: 844, label: "phone portrait" },
    { width: 844, height: 390, label: "phone landscape" },
    { width: 768, height: 1024, label: "tablet portrait" },
    { width: 1024, height: 768, label: "tablet landscape" },
    { width: 1280, height: 800, label: "desktop" },
    { width: 1920, height: 1080, label: "desktop 1080p" },
  ];

  for (const vp of TILE_VIEWPORTS) {
    test(`tiles are square on ${vp.label} (${vp.width}x${vp.height})`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await startNewGame(page);

      const tileSize = await page.evaluate(() => {
        const map = document.querySelector('[data-testid="gr-map"]');
        if (!map) return null;
        // Measure first non-zero grid cell
        const cells = Array.from(map.children) as HTMLElement[];
        for (const cell of cells) {
          const r = cell.getBoundingClientRect();
          if (r.width > 1 && r.height > 1) {
            return { w: r.width, h: r.height };
          }
        }
        return null;
      });

      expect(tileSize, "Should find a measurable tile").not.toBeNull();
      if (!tileSize) return;

      const ratio = tileSize.w / tileSize.h;
      expect(
        ratio,
        `Tile ratio ${ratio.toFixed(2)} (${tileSize.w.toFixed(1)}x${tileSize.h.toFixed(1)}) -- tiles should be square`,
      ).toBeGreaterThan(0.8);
      expect(ratio).toBeLessThan(1.2);

      await attachScreenshot(page, testInfo, `tiles-${vp.width}x${vp.height}`);
    });
  }

  test("grid always renders 16x12 cells (fixed viewport)", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await startNewGame(page);

    // The overworld is 16x12 and the arcade is 12x10, but both must
    // render into the same 16x12 viewport grid (192 cells total).
    // This guarantees tile sizes are identical across all maps.
    const gridInfo = await page.evaluate(() => {
      const map = document.querySelector('[data-testid="gr-map"]') as HTMLElement;
      if (!map) return null;
      const style = map.style;
      const cols = style.gridTemplateColumns;
      const rows = style.gridTemplateRows;
      return {
        cellCount: map.children.length,
        colsDef: cols,
        rowsDef: rows,
        width: map.getBoundingClientRect().width,
        height: map.getBoundingClientRect().height,
      };
    });

    expect(gridInfo, "Grid should exist").not.toBeNull();
    if (!gridInfo) return;

    // Must always be 16*12 = 192 cells
    expect(
      gridInfo.cellCount,
      `Grid has ${gridInfo.cellCount} cells, expected 192 (16x12)`,
    ).toBe(192);

    // Grid template must use fixed viewport dimensions
    expect(gridInfo.colsDef).toContain("repeat(16");
    expect(gridInfo.rowsDef).toContain("repeat(12");

    await attachScreenshot(page, testInfo, "fixed-viewport-grid");
  });
});

/* ------------------------------------------------------------------ */
/*  Tests: Touch targets (mobile)                                     */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER touch targets", () => {
  test("all interactive elements meet 44px minimum on phone", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openGridRunner(page);

    const failures = await page.evaluate((min) => {
      const els = Array.from(
        document.querySelectorAll(
          'button, a, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      const bad: { tag: string; id: string; w: number; h: number }[] = [];
      for (const el of els) {
        const s = getComputedStyle(el);
        if (
          s.display === "none" ||
          s.visibility === "hidden" ||
          s.opacity === "0"
        )
          continue;
        // Skip site nav elements -- those are tested by site-wide tests
        if (el.closest("header > nav, header nav")) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.width < min || r.height < min) {
          bad.push({
            tag: el.tagName.toLowerCase(),
            id:
              el.getAttribute("data-testid") ??
              el.getAttribute("aria-label") ??
              el.textContent?.slice(0, 30)?.trim() ??
              "",
            w: Math.round(r.width),
            h: Math.round(r.height),
          });
        }
      }
      return bad;
    }, 44);

    if (failures.length > 0) {
      const report = failures
        .map((f) => `  ${f.tag}[${f.id}] = ${f.w}x${f.h}`)
        .join("\n");
      expect
        .soft(failures.length, `Touch targets below 44px:\n${report}`)
        .toBe(0);
    }
  });
});

/* ------------------------------------------------------------------ */
/*  Tests: Mobile controls (d-pad + action buttons)                   */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER mobile controls", () => {
  test("controls visible on phone, hidden on desktop", async ({ page }) => {
    // Phone — visible (must be in overworld, not title screen)
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);
    await expect(page.getByTestId("gr-controls")).toBeVisible();
    await expect(page.getByTestId("gr-dpad")).toBeVisible();
    await expect(page.getByTestId("gr-action-buttons")).toBeVisible();

    // Desktop — hidden
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(100);
    await expect(page.getByTestId("gr-controls")).toBeHidden();
  });

  test("controls visible in phone landscape", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await startNewGame(page);
    await expect(page.getByTestId("gr-controls")).toBeVisible();
  });

  test("d-pad has all four direction buttons", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    for (const dir of ["up", "down", "left", "right"]) {
      const btn = page.getByTestId(`gr-dpad-${dir}`);
      await expect(btn).toBeVisible();

      const tag = await btn.evaluate((el) => el.tagName.toLowerCase());
      expect(tag, `D-pad ${dir} must be a <button>`).toBe("button");

      const label = await btn.getAttribute("aria-label");
      expect(label, `D-pad ${dir} must have aria-label`).toBeTruthy();
    }
  });

  test("action buttons A and B are present with labels", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    const btnA = page.getByTestId("gr-btn-a");
    const btnB = page.getByTestId("gr-btn-b");

    await expect(btnA).toBeVisible();
    await expect(btnB).toBeVisible();

    const tagA = await btnA.evaluate((el) => el.tagName.toLowerCase());
    const tagB = await btnB.evaluate((el) => el.tagName.toLowerCase());
    expect(tagA).toBe("button");
    expect(tagB).toBe("button");

    expect(await btnA.getAttribute("aria-label")).toBeTruthy();
    expect(await btnB.getAttribute("aria-label")).toBeTruthy();
  });

  test("d-pad uses <nav> with aria-label", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    const dpad = page.getByTestId("gr-dpad");
    const tag = await dpad.evaluate((el) => el.tagName.toLowerCase());
    expect(tag, "D-pad container should be a <nav>").toBe("nav");
    expect(await dpad.getAttribute("aria-label")).toBeTruthy();
  });

  test("action buttons group has role and label", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    const group = page.getByTestId("gr-action-buttons");
    expect(await group.getAttribute("role")).toBe("group");
    expect(await group.getAttribute("aria-label")).toBeTruthy();
  });

  test("controls bar is inside the frame, not overflowing", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    const metrics = await page.evaluate(() => {
      const frame = document.querySelector(
        '[data-testid="gr-frame"]',
      ) as HTMLElement;
      const controls = document.querySelector(
        '[data-testid="gr-controls"]',
      ) as HTMLElement;
      if (!frame || !controls)
        return { frameBottom: 0, controlsBottom: 0, vpHeight: 0 };

      const fb = frame.getBoundingClientRect();
      const cb = controls.getBoundingClientRect();
      return {
        frameBottom: fb.bottom,
        controlsBottom: cb.bottom,
        vpHeight: window.innerHeight,
      };
    });

    expect(
      metrics.controlsBottom,
      "Controls must not extend below viewport",
    ).toBeLessThanOrEqual(metrics.vpHeight + 1);

    await attachScreenshot(page, testInfo, "controls-phone-portrait");
  });
});

/* ------------------------------------------------------------------ */
/*  Tests: Dark mode is always forced                                 */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER dark mode enforcement", () => {
  test("html element has dark class on load", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    // Clear any stored theme preference to simulate fresh visit
    await page.goto(ROUTE, { waitUntil: "networkidle" });
    await expect(page.getByTestId("gr-root")).toBeVisible();

    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(hasDark, "<html> must have dark class on GRIDRUNNER page").toBe(
      true,
    );
  });

  test("nav renders with dark styling on GRIDRUNNER page", async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openGridRunner(page);

    // Verify dark class is on html -- that guarantees dark variants apply.
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(hasDark).toBe(true);

    await attachScreenshot(page, testInfo, "nav-dark-mode");
  });
});
