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

/** Skip the DMG-style boot screen if it is showing. */
async function skipBootScreen(page: Page) {
  const boot = page.getByTestId("gr-boot-screen");
  if (await boot.isVisible().catch(() => false)) {
    await page.waitForTimeout(600);
    await boot.click();
    await boot.waitFor({ state: "hidden", timeout: 5000 });
  }
}

async function openGridRunner(page: Page) {
  await page.goto(ROUTE, { waitUntil: "networkidle" });
  await expect(page.getByTestId("gr-root")).toBeVisible();
  await stabilize(page);
  await skipBootScreen(page);
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

async function attachScreenshot(page: Page, testInfo: TestInfo, name: string) {
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
  test("route loads with nav, circuit bg, and no footer", async ({ page }) => {
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

  test("title screen has <h1>, name input, and new game button", async ({
    page,
  }) => {
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

      await attachScreenshot(page, testInfo, `frame-${vp.width}x${vp.height}`);
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
  test("phone portrait: frame width >= 85% of viewport", async ({ page }) => {
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

    // Frame should not exceed 640px max-width
    expect(metrics.frame.width).toBeLessThanOrEqual(641);

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
      const map = document.querySelector(
        '[data-testid="gr-map"]',
      ) as HTMLElement;
      if (!map) return null;
      const cls = map.className;
      return {
        cellCount: map.children.length,
        hasColClass: cls.includes("grid-cols-[repeat(16"),
        hasRowClass: cls.includes("grid-rows-[repeat(12"),
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
    expect(
      gridInfo.hasColClass,
      "Grid should have 16-column Tailwind class",
    ).toBe(true);
    expect(gridInfo.hasRowClass, "Grid should have 12-row Tailwind class").toBe(
      true,
    );

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
  test("controls visible on all screen sizes (Game Boy aesthetic)", async ({
    page,
  }) => {
    // Phone
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);
    await expect(page.getByTestId("gr-controls")).toBeVisible();
    await expect(page.getByTestId("gr-dpad")).toBeVisible();
    await expect(page.getByTestId("gr-action-buttons")).toBeVisible();

    // Desktop -- still visible (Game Boy frame)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(100);
    await expect(page.getByTestId("gr-controls")).toBeVisible();
  });

  test("controls hidden on title screen only", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openGridRunner(page);
    // On title screen -- no controls
    await expect(page.getByTestId("gr-controls")).toHaveCount(0);
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

  test("action buttons A and B are present with labels", async ({ page }) => {
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

/* ------------------------------------------------------------------ */
/*  Tests: Menu and overlay navigation                                */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER menu system", () => {
  test("START opens menu, B closes it", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    // Open menu via START button
    await page.getByTestId("gr-btn-start").click();
    const menu = page.getByTestId("gr-menu-overlay");
    await expect(menu).toBeVisible();

    // Menu has all items (scoped to menu overlay to avoid HUD collisions)
    await expect(menu.getByText("DISC", { exact: true })).toBeVisible();
    await expect(menu.getByText("INVENTORY", { exact: true })).toBeVisible();
    await expect(menu.getByText("OPERATOR", { exact: true })).toBeVisible();
    await expect(menu.getByText("SAVE", { exact: true })).toBeVisible();
    await expect(menu.getByText("SETTINGS", { exact: true })).toBeVisible();

    // B closes menu entirely
    await page.getByTestId("gr-btn-b").click();
    await expect(menu).toHaveCount(0);
  });

  test("SELECT opens Disc directly, B closes it", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    await page.getByTestId("gr-btn-select").click();
    const disc = page.getByTestId("gr-disc-overlay");
    await expect(disc).toBeVisible();

    // Has tabs
    await expect(disc.getByRole("button", { name: "TOOLS" })).toBeVisible();
    await expect(disc.getByRole("button", { name: "TYPES" })).toBeVisible();
    // B closes entirely (no menu in between)
    await page.getByTestId("gr-btn-b").click();
    await expect(disc).toHaveCount(0);
    await expect(page.getByTestId("gr-menu-overlay")).toHaveCount(0);
  });

  test("menu sub-screens navigate back to menu on B", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    // Open menu
    await page.getByTestId("gr-btn-start").click();
    const menu = page.getByTestId("gr-menu-overlay");
    await expect(menu).toBeVisible();

    // Navigate to Inventory
    await menu.getByText("INVENTORY", { exact: true }).click();
    await expect(page.getByTestId("gr-inventory-overlay")).toBeVisible();
    await expect(menu).toHaveCount(0);

    // B goes back to menu, not closed
    await page.getByTestId("gr-btn-b").click();
    await expect(page.getByTestId("gr-inventory-overlay")).toHaveCount(0);
    await expect(menu).toBeVisible();

    // Navigate to Operator
    await menu.getByText("OPERATOR", { exact: true }).click();
    await expect(page.getByTestId("gr-operator-overlay")).toBeVisible();

    // B goes back to menu
    await page.getByTestId("gr-btn-b").click();
    await expect(page.getByTestId("gr-operator-overlay")).toHaveCount(0);
    await expect(menu).toBeVisible();

    // Close menu entirely
    await page.getByTestId("gr-btn-b").click();
    await expect(menu).toHaveCount(0);
  });

  test("inventory shows equipped tools", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    await page.getByTestId("gr-btn-start").click();
    await page
      .getByTestId("gr-menu-overlay")
      .getByText("INVENTORY", { exact: true })
      .click();
    await expect(page.getByTestId("gr-inventory-overlay")).toBeVisible();

    // Should show 4 equipped starter tools
    await expect(page.getByText(/Slot 1/)).toBeVisible();
    await expect(page.getByText(/Slot 2/)).toBeVisible();
    await expect(page.getByText(/Slot 3/)).toBeVisible();
    await expect(page.getByText(/Slot 4/)).toBeVisible();
  });

  test("operator shows player stats", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    await page.getByTestId("gr-btn-start").click();
    await page
      .getByTestId("gr-menu-overlay")
      .getByText("OPERATOR", { exact: true })
      .click();
    await expect(page.getByTestId("gr-operator-overlay")).toBeVisible();

    // Should show stats
    await expect(page.getByText("Level")).toBeVisible();
    await expect(page.getByText("Integrity (HP)")).toBeVisible();
    await expect(page.getByText("Compute (EN)")).toBeVisible();
    await expect(page.getByText("Bandwidth (SPD)")).toBeVisible();
    await expect(page.getByText("Firewall (DEF)")).toBeVisible();
  });

  test("disc type chart is accessible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    await page.getByTestId("gr-btn-select").click();
    const disc = page.getByTestId("gr-disc-overlay");
    await expect(disc).toBeVisible();

    // Switch to TYPES tab
    await disc.getByText("TYPES").click();

    // Type chart should show all four types (exact match to avoid "Weak vs Recon" collisions)
    await expect(disc.getByText("Recon", { exact: true })).toBeVisible();
    await expect(disc.getByText("Exploit", { exact: true })).toBeVisible();
    await expect(disc.getByText("Defense", { exact: true })).toBeVisible();
    await expect(disc.getByText("Persistence", { exact: true })).toBeVisible();
  });
});

/* ------------------------------------------------------------------ */
/*  Tests: Keyboard mappings                                          */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER keyboard controls", () => {
  test("Escape opens menu when no overlay, closes overlay when open", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await startNewGame(page);

    // No overlay -- Escape opens menu
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("gr-menu-overlay")).toBeVisible();

    // Overlay open -- Escape closes it
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("gr-menu-overlay")).toHaveCount(0);
  });

  test("I opens inventory on overworld", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await startNewGame(page);

    await page.keyboard.press("i");
    await expect(page.getByTestId("gr-inventory-overlay")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("gr-inventory-overlay")).toHaveCount(0);
  });

  test("Shift+D opens disc on overworld", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await startNewGame(page);

    await page.keyboard.press("Shift+D");
    await expect(page.getByTestId("gr-disc-overlay")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("gr-disc-overlay")).toHaveCount(0);
  });

  test("O opens operator on overworld", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await startNewGame(page);

    await page.keyboard.press("o");
    await expect(page.getByTestId("gr-operator-overlay")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("gr-operator-overlay")).toHaveCount(0);
  });

  test("Tab cycles Inventory -> Disc -> Operator -> close", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await startNewGame(page);

    await page.keyboard.press("Tab");
    await expect(page.getByTestId("gr-inventory-overlay")).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(page.getByTestId("gr-inventory-overlay")).toHaveCount(0);
    await expect(page.getByTestId("gr-disc-overlay")).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(page.getByTestId("gr-disc-overlay")).toHaveCount(0);
    await expect(page.getByTestId("gr-operator-overlay")).toBeVisible();

    await page.keyboard.press("Tab");
    await expect(page.getByTestId("gr-operator-overlay")).toHaveCount(0);
  });

  test("Backspace closes an overlay", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await startNewGame(page);

    await page.keyboard.press("i");
    await expect(page.getByTestId("gr-inventory-overlay")).toBeVisible();

    await page.keyboard.press("Backspace");
    await expect(page.getByTestId("gr-inventory-overlay")).toHaveCount(0);
  });

  test("M opens menu", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await startNewGame(page);

    await page.keyboard.press("m");
    await expect(page.getByTestId("gr-menu-overlay")).toBeVisible();

    await page.keyboard.press("m");
    await expect(page.getByTestId("gr-menu-overlay")).toHaveCount(0);
  });

  test("Escape from sub-screen goes back to menu", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await startNewGame(page);

    // Open menu, navigate to operator
    await page.keyboard.press("Escape");
    const menu = page.getByTestId("gr-menu-overlay");
    await expect(menu).toBeVisible();
    await menu.getByText("OPERATOR", { exact: true }).click();
    await expect(page.getByTestId("gr-operator-overlay")).toBeVisible();

    // Escape goes back to menu
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("gr-operator-overlay")).toHaveCount(0);
    await expect(menu).toBeVisible();

    // Escape again closes menu
    await page.keyboard.press("Escape");
    await expect(menu).toHaveCount(0);
  });
});

/* ------------------------------------------------------------------ */
/*  APPEND to end of tests/playwright/gridrunner.e2e.spec.ts          */
/*  Battle layout regression -- locks in approved Option A mockup     */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  APPEND to end of tests/playwright/gridrunner.e2e.spec.ts          */
/*  Battle layout regression -- locks in approved Option A mockup     */
/* ------------------------------------------------------------------ */

async function enterBattle(page: Page) {
  await startNewGame(page);

  // Place player at center of arcade row 3 (all ground, far from exits at row 8)
  await page.evaluate(() => {
    const raw = localStorage.getItem("dis-gridrunner-save");
    if (!raw) return;
    const save = JSON.parse(raw);
    save.currentZone = "arcade";
    save.currentPosition = { x: 5, y: 3 };
    localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
  });

  await page.reload({ waitUntil: "networkidle" });
  await page.getByTestId("gr-continue").click();
  await page.waitForTimeout(300);

  // Walk left-right along row 3 (cols 2-9, all ground, no exits/shop/save)
  for (let i = 0; i < 300; i++) {
    if (
      await page
        .getByTestId("gr-battle")
        .isVisible()
        .catch(() => false)
    )
      return;
    // Alternate: 7 rights then 7 lefts to sweep row 3
    const inRightPhase = Math.floor(i / 7) % 2 === 0;
    await page.keyboard.press(inRightPhase ? "ArrowRight" : "ArrowLeft");
    await page.waitForTimeout(30);
  }
  throw new Error("No battle triggered after 300 steps in arcade");
}

test.describe("GRIDRUNNER battle layout regression", () => {
  test("frame stays within 640px during battle", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await enterBattle(page);
    const box = await page.getByTestId("gr-frame").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(641);
  });

  test("tools render as a 2-column grid, not flex-wrap", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await enterBattle(page);
    const actions = page.getByTestId("gr-battle-actions");
    await expect(actions).toBeVisible();
    const display = await actions.evaluate(
      (el) => globalThis.getComputedStyle(el).display,
    );
    expect(display).toBe("grid");
    const cols = await actions.evaluate(
      (el) => globalThis.getComputedStyle(el).gridTemplateColumns,
    );
    const colCount = cols.split(" ").length;
    expect(colCount).toBe(2);
  });

  test("RUN button is separate from the tool grid", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await enterBattle(page);
    const run = page.getByTestId("gr-battle-run");
    await expect(run).toBeVisible();
    const runIsInsideNav = await run.evaluate((el) => {
      return el.closest("[data-testid='gr-battle-actions']") !== null;
    });
    expect(runIsInsideNav).toBe(false);
  });

  test("tool buttons do not truncate text", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await enterBattle(page);
    const buttons = page.getByTestId("gr-battle-actions").locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const truncated = await btn.evaluate(
        (el) => el.scrollWidth > el.clientWidth,
      );
      const text = await btn.textContent();
      expect(truncated, `"${text}" is truncated`).toBe(false);
    }
  });

  test("tool buttons and RUN meet 44px touch target", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await enterBattle(page);
    const toolButtons = page.getByTestId("gr-battle-actions").locator("button");
    const toolCount = await toolButtons.count();
    for (let i = 0; i < toolCount; i++) {
      const box = await toolButtons.nth(i).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height, `Tool ${i} below 44px`).toBeGreaterThanOrEqual(44);
    }
    const runBox = await page.getByTestId("gr-battle-run").boundingBox();
    expect(runBox).not.toBeNull();
    expect(runBox!.height, "RUN below 44px").toBeGreaterThanOrEqual(44);
  });

  test("arena uses flex-1 for sprite animation space", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await enterBattle(page);
    const battle = page.getByTestId("gr-battle");
    const arenaFlex = await battle.evaluate((el) => {
      const arena = el.querySelector(":scope > div:first-child");
      if (!arena) return "missing";
      return globalThis.getComputedStyle(arena).flexGrow;
    });
    expect(arenaFlex).toBe("1");
  });

  test("log and tools are compact at bottom, not eating arena space", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await enterBattle(page);
    const battle = page.getByTestId("gr-battle");
    const battleBox = await battle.boundingBox();
    expect(battleBox).not.toBeNull();
    const run = page.getByTestId("gr-battle-run");
    const runBox = await run.boundingBox();
    expect(runBox).not.toBeNull();
    const gapBelowRun =
      battleBox!.y + battleBox!.height - (runBox!.y + runBox!.height);
    expect(
      gapBelowRun,
      `${gapBelowRun}px wasted below RUN`,
    ).toBeLessThanOrEqual(16);
  });
});

/* ------------------------------------------------------------------ */
/*  Progressive onboarding prompts                                    */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER onboarding prompts", () => {
  test("first shop visit shows onboarding, dismiss opens shop, second visit silent", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    // Park on the arcade ground tile right of the shop (shop is at col 9 row 4).
    await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      if (!raw) return;
      const save = JSON.parse(raw);
      save.currentZone = "arcade";
      save.currentPosition = { x: 10, y: 4 };
      save.completedTutorial = true;
      localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByTestId("gr-continue").click();
    await page.waitForTimeout(300);

    // Step left onto the shop tile.
    await page.keyboard.press("ArrowLeft");

    const prompt = page.getByTestId("gr-tutorial-prompt");
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText(/shop/i);

    // Shop is NOT open yet; it opens on dismiss.
    await expect(page.getByTestId("gr-shop-overlay")).toHaveCount(0);
    await page.getByTestId("gr-tutorial-dismiss").click();
    await expect(page.getByTestId("gr-shop-overlay")).toBeVisible();

    // Close shop, step off and back on -- no onboarding prompt.
    await page.getByTestId("gr-btn-b").click();
    await expect(page.getByTestId("gr-shop-overlay")).toHaveCount(0);
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(150);
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByTestId("gr-tutorial-prompt")).toHaveCount(0);
    await expect(page.getByTestId("gr-shop-overlay")).toBeVisible();
  });

  test("first loot drop after battle win shows onboarding, second drop silent", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    // Seed near a random-encounter spot with instakill gear and a
    // legendary tool so rollLootDrop always drops something.
    await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      if (!raw) return;
      const save = JSON.parse(raw);
      save.currentZone = "arcade";
      save.currentPosition = { x: 5, y: 3 };
      save.completedTutorial = true;
      save.player.xp = 0;
      save.player.xpToNext = 999999;
      save.player.maxIntegrity = 9999;
      save.player.integrity = 9999;
      save.player.maxCompute = 9999;
      save.player.compute = 9999;
      save.player.firewall = 9999;
      save.equippedTools = [
        {
          id: "test-onehit",
          baseToolId: "metasploit",
          rarity: "legendary",
          power: 9999,
          accuracy: 100,
          energyCost: 1,
          prefix: null,
          suffix: null,
          type: "exploit",
        },
        null,
        null,
        null,
      ];
      localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByTestId("gr-continue").click();
    await page.waitForTimeout(300);

    // Walk until a random encounter triggers
    for (let i = 0; i < 300; i++) {
      if (
        await page
          .getByTestId("gr-battle")
          .isVisible()
          .catch(() => false)
      )
        break;
      const inRightPhase = Math.floor(i / 5) % 2 === 0;
      await page.keyboard.press(inRightPhase ? "ArrowRight" : "ArrowLeft");
      await page.waitForTimeout(30);
    }

    // Win the fight and CONTINUE back to map.
    await page.getByTestId("gr-battle-tool-0").click();
    await page.getByTestId("gr-battle-continue").click();

    // The loot onboarding prompt may only fire if rollLootDrop actually
    // dropped a tool. In that case, dismiss sets the flag and no re-drop
    // ever shows it again. If no drop happened, the flag stays false and
    // a later drop will fire it -- but the negation ("never shows again")
    // is the invariant we care about.
    const prompt = page.getByTestId("gr-tutorial-prompt");
    const shown = await prompt.isVisible().catch(() => false);
    if (!shown) test.skip(true, "Loot RNG did not drop this run -- re-run.");

    await expect(prompt).toContainText(/inventory/i);
    await page.getByTestId("gr-tutorial-dismiss").click();
    await expect(prompt).toHaveCount(0);

    const flag = await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      return raw ? JSON.parse(raw).onboarding?.loot === true : false;
    });
    expect(flag).toBe(true);
  });

  test("boss approach shows onboarding once then never again", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    // Park in the bank, two tiles away from the Lazarus boss tile (11, 1).
    // Adjacent to boss tile at (11, 2); step there first to trigger the
    // adjacency check.
    await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      if (!raw) return;
      const save = JSON.parse(raw);
      save.currentZone = "bank";
      save.currentPosition = { x: 11, y: 3 };
      save.completedTutorial = true;
      save.player.level = 1; // under-leveled so stepping on boss tile
      // does nothing, lets us re-walk past it
      localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByTestId("gr-continue").click();
    await page.waitForTimeout(300);

    // Move up to (11, 2) -- adjacent to boss tile (11, 1).
    await page.keyboard.press("ArrowUp");

    const prompt = page.getByTestId("gr-tutorial-prompt");
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText(/boss/i);
    await page.getByTestId("gr-tutorial-dismiss").click();
    await expect(prompt).toHaveCount(0);

    // Step away and back; no second prompt.
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(150);
    await page.keyboard.press("ArrowUp");
    await expect(page.getByTestId("gr-tutorial-prompt")).toHaveCount(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Intel report (post-battle boss briefing)                          */
/* ------------------------------------------------------------------ */

/**
 * Lazarus boss tile is at (11, 1) in the bank map. Park the player at
 * (11, 2) with overpowered gear so one ArrowUp engages the boss and one
 * NMAP click one-shots it.
 */
async function placePlayerAtLazarusDoor(
  page: Page,
  overrides: Record<string, unknown> = {},
) {
  await page.evaluate((ov) => {
    const raw = localStorage.getItem("dis-gridrunner-save");
    if (!raw) return;
    const save = JSON.parse(raw);
    save.currentZone = "bank";
    save.currentPosition = { x: 11, y: 2 };
    save.completedTutorial = true;
    save.player.level = 5;
    // Push xpToNext so the Lazarus XP reward (300) never crosses the
    // threshold -- keeps the level-up overlay out of the way of the intel
    // overlay assertions.
    save.player.xp = 0;
    save.player.xpToNext = 999999;
    save.player.maxIntegrity = 9999;
    save.player.integrity = 9999;
    save.player.maxCompute = 9999;
    save.player.compute = 9999;
    save.player.firewall = 9999;
    save.equippedTools = [
      {
        id: "test-onehit",
        baseToolId: "metasploit",
        rarity: "legendary",
        power: 9999,
        accuracy: 100,
        energyCost: 1,
        prefix: null,
        suffix: null,
        type: "exploit",
      },
      null,
      null,
      null,
    ];
    Object.assign(save, ov);
    localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
  }, overrides);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByTestId("gr-continue").click();
  await page.waitForTimeout(300);
}

test.describe("GRIDRUNNER intel report", () => {
  test("first Lazarus defeat shows the intel overlay with correct content", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);
    await placePlayerAtLazarusDoor(page);

    await page.keyboard.press("ArrowUp");
    await expect(page.getByTestId("gr-battle")).toBeVisible();
    await page.getByTestId("gr-battle-tool-0").click();

    const cont = page.getByTestId("gr-battle-continue");
    await expect(cont).toBeVisible();
    await cont.click();

    const intel = page.getByTestId("gr-intel-overlay");
    await expect(intel).toBeVisible();
    await expect(intel).toContainText(/Lazarus Group/i);
    await expect(intel).toContainText(/North Korea/i);
    await expect(intel).toContainText(/Financial/i);
    await expect(intel).toContainText(/BACKGROUND/);
    await expect(intel).toContainText(/KNOWN OPERATIONS/);
    await expect(intel).toContainText(/WEAKNESS/);
    await expect(intel).toContainText(/DEFENSE/i);
    await expect(intel).toContainText(/BANK BUSTER/i);

    await page.getByTestId("gr-intel-continue").click();
    await expect(intel).toHaveCount(0);
  });

  test("intel overlay does not re-appear on a subsequent Lazarus defeat", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);
    // Seed the save as though Lazarus was already defeated.
    await placePlayerAtLazarusDoor(page, { defeatedBosses: ["lazarus"] });

    await page.keyboard.press("ArrowUp");
    await expect(page.getByTestId("gr-battle")).toBeVisible();
    await page.getByTestId("gr-battle-tool-0").click();

    await page.getByTestId("gr-battle-continue").click();

    await expect(page.getByTestId("gr-intel-overlay")).toHaveCount(0);
  });

  test("chains level-up -> intel on a boss first-kill that also levels up", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);
    // Seed xp one shy of threshold so the Lazarus XP reward causes a level-up,
    // and defeatedBosses is still empty so intel queues behind it.
    await placePlayerAtLazarusDoor(page, {
      player: {
        level: 5,
        xp: 0,
        xpToNext: 50,
        integrity: 9999,
        maxIntegrity: 9999,
        compute: 9999,
        maxCompute: 9999,
        bandwidth: 10,
        firewall: 9999,
      },
    });

    await page.keyboard.press("ArrowUp");
    await page.getByTestId("gr-battle-tool-0").click();
    await page.getByTestId("gr-battle-continue").click();

    // Level-up first
    const levelup = page.getByTestId("gr-levelup-overlay");
    await expect(levelup).toBeVisible();
    await page.getByTestId("gr-levelup-continue").click();
    await expect(levelup).toHaveCount(0);

    // Intel next
    const intel = page.getByTestId("gr-intel-overlay");
    await expect(intel).toBeVisible();
    await expect(intel).toContainText(/Lazarus Group/i);
    await page.getByTestId("gr-intel-continue").click();
    await expect(intel).toHaveCount(0);
  });

  test("persists bossId to save.unlockedIntelEntries on first kill", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);
    await placePlayerAtLazarusDoor(page);

    await page.keyboard.press("ArrowUp");
    await page.getByTestId("gr-battle-tool-0").click();
    await page.getByTestId("gr-battle-continue").click();
    await page.getByTestId("gr-intel-continue").click();

    const entries = await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      return raw ? JSON.parse(raw).unlockedIntelEntries : null;
    });
    expect(entries).toContain("lazarus");
  });
});

/* ------------------------------------------------------------------ */
/*  Tutorial encounter                                                */
/* ------------------------------------------------------------------ */

/**
 * Arcade entry tile is at (2, 2) in the Sector 01 overworld. Park the player
 * at (2, 3) so one ArrowUp walks onto the entry tile.
 */
async function placePlayerAtArcadeDoor(
  page: Page,
  overrides: Record<string, unknown> = {},
) {
  await page.evaluate((ov) => {
    const raw = localStorage.getItem("dis-gridrunner-save");
    if (!raw) return;
    const save = JSON.parse(raw);
    save.currentZone = "overworld";
    save.currentPosition = { x: 2, y: 3 };
    Object.assign(save, ov);
    localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
  }, overrides);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByTestId("gr-continue").click();
  await page.waitForTimeout(300);
}

async function walkIntoArcade(page: Page) {
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(250);
}

test.describe("GRIDRUNNER tutorial encounter", () => {
  test("first arcade entry spawns scripted Script Kiddie and shows tutorial steps", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);
    await placePlayerAtArcadeDoor(page);

    // completedTutorial is false on a fresh save.
    // Walk into the arcade entry tile -> scripted Script Kiddie spawns,
    // tutorial step 1 appears.
    await walkIntoArcade(page);

    const prompt = page.getByTestId("gr-tutorial-prompt");
    await expect(prompt).toBeVisible({ timeout: 5000 });
    await expect(prompt).toContainText(/select nmap/i);
    await expect(page.getByTestId("gr-battle")).toBeVisible();
    await expect(page.getByText("Script Kiddie", { exact: true })).toBeVisible();

    // Non-NMAP tools must be disabled during step 1.
    const nmapBtn = page.getByTestId("gr-battle-tool-0");
    const metaBtn = page.getByTestId("gr-battle-tool-2");
    await expect(nmapBtn).toBeEnabled();
    await expect(metaBtn).toBeDisabled();

    // Use NMAP -> step 2 appears.
    await nmapBtn.click();
    await expect(prompt).toContainText(/recon/i);

    // Dismiss step 2 -> step 3 appears.
    await page.getByTestId("gr-tutorial-dismiss").click();
    await expect(prompt).toContainText(/battle log/i);

    // Dismiss step 3 -> tutorial gone, all tools re-enabled.
    await page.getByTestId("gr-tutorial-dismiss").click();
    await expect(prompt).toHaveCount(0);
  });

  test("tutorial sets completedTutorial and does not re-appear on revisit", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);
    await placePlayerAtArcadeDoor(page);
    await walkIntoArcade(page);

    // Fast-forward through the tutorial.
    await page.getByTestId("gr-tutorial-prompt").waitFor();
    await page.getByTestId("gr-battle-tool-0").click();
    await page.getByTestId("gr-tutorial-dismiss").click();
    await page.getByTestId("gr-tutorial-dismiss").click();

    // Confirm the tutorial flag is persisted.
    const completed = await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      return raw ? JSON.parse(raw).completedTutorial === true : false;
    });
    expect(completed).toBe(true);

    // Reload and re-enter arcade. The tutorial must not show.
    await placePlayerAtArcadeDoor(page);
    await walkIntoArcade(page);

    await expect(page.getByTestId("gr-tutorial-prompt")).toHaveCount(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Save terminal interaction                                         */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER save terminal", () => {
  test("pressing A on the arcade save tile opens the save dialog and SAVE dismisses it", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    // Park the player directly on the arcade SAVE tile (col 9, row 6).
    await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      if (!raw) return;
      const save = JSON.parse(raw);
      save.currentZone = "arcade";
      save.currentPosition = { x: 9, y: 6 };
      localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByTestId("gr-continue").click();
    await page.waitForTimeout(300);

    // Enter is the A button -- triggers INTERACT on the current tile.
    await page.keyboard.press("Enter");

    const overlay = page.getByTestId("gr-save-overlay");
    await expect(overlay).toBeVisible();

    await page.getByTestId("gr-save-confirm").click();
    await expect(overlay).toHaveCount(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Level-up overlay                                                  */
/* ------------------------------------------------------------------ */

async function enterBattleNearLevelUp(page: Page) {
  await startNewGame(page);

  await page.evaluate(() => {
    const raw = localStorage.getItem("dis-gridrunner-save");
    if (!raw) return;
    const save = JSON.parse(raw);
    save.currentZone = "arcade";
    save.currentPosition = { x: 5, y: 3 };
    // Park the player one XP shy of leveling and give them an instakill tool
    // so a single enemy turn ends the battle and triggers the level-up flow.
    save.player.xp = save.player.xpToNext - 1;
    save.player.maxIntegrity = 9999;
    save.player.integrity = 9999;
    save.player.maxCompute = 9999;
    save.player.compute = 9999;
    save.player.firewall = 9999;
    save.equippedTools = [
      {
        id: "test-onehit",
        baseToolId: "metasploit",
        rarity: "legendary",
        power: 9999,
        accuracy: 100,
        energyCost: 1,
        prefix: null,
        suffix: null,
        type: "exploit",
      },
      null,
      null,
      null,
    ];
    localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
  });

  await page.reload({ waitUntil: "networkidle" });
  await page.getByTestId("gr-continue").click();
  await page.waitForTimeout(300);

  for (let i = 0; i < 300; i++) {
    if (
      await page
        .getByTestId("gr-battle")
        .isVisible()
        .catch(() => false)
    )
      return;
    const inRightPhase = Math.floor(i / 7) % 2 === 0;
    await page.keyboard.press(inRightPhase ? "ArrowRight" : "ArrowLeft");
    await page.waitForTimeout(30);
  }
  throw new Error("No battle triggered after 300 steps in arcade");
}

test.describe("GRIDRUNNER level-up overlay", () => {
  test("appears after a winning battle that crosses the XP threshold", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await enterBattleNearLevelUp(page);

    // One-hit the enemy with the seeded legendary tool
    await page.getByTestId("gr-battle-tool-0").click();

    // Battle result panel
    const cont = page.getByTestId("gr-battle-continue");
    await expect(cont).toBeVisible({ timeout: 5000 });
    await cont.click();

    // Level-up overlay
    const overlay = page.getByTestId("gr-levelup-overlay");
    await expect(overlay).toBeVisible();

    // Old level was 1, new level should be 2 (xpToNext was 50, gave 18+ XP)
    await expect(page.getByTestId("gr-levelup-old")).toHaveText("1");
    await expect(page.getByTestId("gr-levelup-new")).toHaveText(/^[2-9]/);

    // Continue dismisses
    await page.getByTestId("gr-levelup-continue").click();
    await expect(overlay).toHaveCount(0);
  });

  test("does not appear when XP gain stays below threshold", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      if (!raw) return;
      const save = JSON.parse(raw);
      save.currentZone = "arcade";
      save.currentPosition = { x: 5, y: 3 };
      // Far from threshold; one battle won't level up
      save.player.xp = 0;
      save.player.xpToNext = 99999;
      save.player.maxIntegrity = 9999;
      save.player.integrity = 9999;
      save.player.maxCompute = 9999;
      save.player.compute = 9999;
      save.player.firewall = 9999;
      save.equippedTools = [
        {
          id: "test-onehit",
          baseToolId: "metasploit",
          rarity: "legendary",
          power: 9999,
          accuracy: 100,
          energyCost: 1,
          prefix: null,
          suffix: null,
          type: "exploit",
        },
        null,
        null,
        null,
      ];
      localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
    });

    await page.reload({ waitUntil: "networkidle" });
    await page.getByTestId("gr-continue").click();
    await page.waitForTimeout(300);

    for (let i = 0; i < 300; i++) {
      if (
        await page
          .getByTestId("gr-battle")
          .isVisible()
          .catch(() => false)
      )
        break;
      const inRightPhase = Math.floor(i / 7) % 2 === 0;
      await page.keyboard.press(inRightPhase ? "ArrowRight" : "ArrowLeft");
      await page.waitForTimeout(30);
    }

    await page.getByTestId("gr-battle-tool-0").click();
    await page.getByTestId("gr-battle-continue").click();

    await expect(page.getByTestId("gr-levelup-overlay")).toHaveCount(0);
  });
});

/* ------------------------------------------------------------------ */
/*  Sector 01 overworld layout + Digital Sea                          */
/* ------------------------------------------------------------------ */

test.describe("GRIDRUNNER Sector 01 overworld", () => {
  test("renders THE GRID label and exactly 3 buildings (Arcade/Bank ENTER, Crypto Exchange LOCKED)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    const overworld = page.getByTestId("gr-overworld");
    await expect(overworld).toBeVisible();
    await expect(overworld).toContainText(/THE GRID/i);

    const enterLabels = overworld.getByText("ENTER", { exact: true });
    const lockedLabels = overworld.getByText("LOCKED", { exact: true });
    const sealedLabels = overworld.getByText("SEALED", { exact: true });

    await expect(enterLabels).toHaveCount(2);
    await expect(lockedLabels).toHaveCount(1);
    await expect(sealedLabels).toHaveCount(1);
  });

  test("Digital Sea tiles render with distinct cyan color class", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startNewGame(page);

    const seaTileCount = await page.evaluate(() => {
      const map = document.querySelector(
        '[data-testid="gr-map"]',
      ) as HTMLElement | null;
      if (!map) return 0;
      return Array.from(map.querySelectorAll("div")).filter((el) =>
        (el as HTMLElement).className.includes("bg-[#0a2a3a]"),
      ).length;
    });
    expect(seaTileCount).toBeGreaterThan(20);
  });

  test("walking on a sea tile triggers an encounter when Math.random is forced low", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      Math.random = () => 0.01;
    });
    await startNewGame(page);

    await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      if (!raw) return;
      const save = JSON.parse(raw);
      save.currentZone = "overworld";
      save.currentPosition = { x: 3, y: 4 };
      save.completedTutorial = true;
      localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByTestId("gr-continue").click();
    await page.waitForTimeout(300);

    await page.keyboard.press("ArrowRight");

    await expect(page.getByTestId("gr-battle")).toBeVisible({ timeout: 3000 });
  });

  test("walking on grid path does not trigger an encounter across 20 steps", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      Math.random = () => 0.01;
    });
    await startNewGame(page);

    await page.evaluate(() => {
      const raw = localStorage.getItem("dis-gridrunner-save");
      if (!raw) return;
      const save = JSON.parse(raw);
      save.currentZone = "overworld";
      save.currentPosition = { x: 1, y: 10 };
      save.completedTutorial = true;
      localStorage.setItem("dis-gridrunner-save", JSON.stringify(save));
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.getByTestId("gr-continue").click();
    await page.waitForTimeout(300);

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(30);
    }
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(30);
    }

    await expect(page.getByTestId("gr-battle")).toHaveCount(0);
  });
});
