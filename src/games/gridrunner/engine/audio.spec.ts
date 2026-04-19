/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { describe, expect, it } from "vitest";
import {
  pickRandom,
  resolveTrackName,
  computeEffectiveGain,
  getMusicSlot,
  SFX_MANIFEST,
  MUSIC_MANIFEST,
  DEFAULT_AUDIO_SETTINGS,
} from "./audio";
import type { SfxId, MusicSlot } from "./audio";

/* ------------------------------------------------------------------ */
/*  pickRandom                                                        */
/* ------------------------------------------------------------------ */

describe("pickRandom", () => {
  it("returns an item from the pool", () => {
    const pool = ["a", "b", "c"];
    const result = pickRandom(pool);
    expect(pool).toContain(result);
  });

  it("returns the only item in a single-item pool", () => {
    expect(pickRandom(["only"])).toBe("only");
  });

  it("throws on empty pool", () => {
    expect(() => pickRandom([])).toThrow();
  });
});

/* ------------------------------------------------------------------ */
/*  resolveTrackName                                                  */
/* ------------------------------------------------------------------ */

describe("resolveTrackName", () => {
  it("extracts track name from Karl Casey filename", () => {
    expect(
      resolveTrackName("/audio/music/title/Karl Casey - Malibu Moon.mp3"),
    ).toBe("Malibu Moon");
  });

  it("strips file extension", () => {
    expect(
      resolveTrackName("/audio/music/battle/Karl Casey - Burnt Circuit.mp3"),
    ).toBe("Burnt Circuit");
  });

  it("handles filenames without artist prefix", () => {
    expect(resolveTrackName("/audio/music/boss/SomeTrack.mp3")).toBe(
      "SomeTrack",
    );
  });

  it("handles deeply nested paths", () => {
    expect(resolveTrackName("/a/b/c/d/Karl Casey - Chrome Cobra.mp3")).toBe(
      "Chrome Cobra",
    );
  });
});

/* ------------------------------------------------------------------ */
/*  computeEffectiveGain                                              */
/* ------------------------------------------------------------------ */

describe("computeEffectiveGain", () => {
  it("returns 0 when muted", () => {
    expect(computeEffectiveGain(100, 100, true)).toBe(0);
  });

  it("returns 0 when master is 0", () => {
    expect(computeEffectiveGain(0, 80, false)).toBe(0);
  });

  it("returns 0 when channel is 0", () => {
    expect(computeEffectiveGain(80, 0, false)).toBe(0);
  });

  it("returns product of normalized values at full volume", () => {
    expect(computeEffectiveGain(100, 100, false)).toBe(1);
  });

  it("scales correctly at 50% master 50% channel", () => {
    // toGain squares the normalized value: (0.5)^2 * (0.5)^2 = 0.0625
    expect(computeEffectiveGain(50, 50, false)).toBeCloseTo(0.0625);
  });

  it("clamps values above 100", () => {
    expect(computeEffectiveGain(150, 100, false)).toBe(1);
  });
});

/* ------------------------------------------------------------------ */
/*  getMusicSlot                                                      */
/* ------------------------------------------------------------------ */

describe("getMusicSlot", () => {
  it("returns title for title screen", () => {
    expect(getMusicSlot("title", "sector-01", false)).toBe("title");
  });

  it("returns overworld for overworld screen", () => {
    expect(getMusicSlot("overworld", "sector-01", false)).toBe("overworld");
  });

  it("returns interior-safe for arcade building", () => {
    expect(getMusicSlot("building", "arcade", false)).toBe("interior-safe");
  });

  it("returns interior-deep for bank building", () => {
    expect(getMusicSlot("building", "bank", false)).toBe("interior-deep");
  });

  it("returns battle for non-boss battle", () => {
    expect(getMusicSlot("battle", "bank", false)).toBe("battle");
  });

  it("returns boss for boss battle in normal zone", () => {
    expect(getMusicSlot("battle", "bank", true)).toBe("boss");
  });

  it("returns null for intel screen", () => {
    //@ts-expect-error intel is not supported
    expect(getMusicSlot("intel", "bank", false)).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Manifests                                                         */
/* ------------------------------------------------------------------ */

describe("SFX_MANIFEST", () => {
  const requiredCategories: SfxId[] = [
    "step",
    "menu-open",
    "menu-close",
    "bits",
    "level-up",
    "loot-drop",
    "encounter",
    "hit",
    "miss",
    "critical",
    "tool-recon",
    "tool-exploit",
    "tool-defense",
    "tool-persistence",
  ];

  it("has all required categories", () => {
    for (const cat of requiredCategories) {
      expect(SFX_MANIFEST[cat]).toBeDefined();
      expect(SFX_MANIFEST[cat].length).toBeGreaterThan(0);
    }
  });

  it("all paths start with /audio/sfx/", () => {
    for (const paths of Object.values(SFX_MANIFEST)) {
      for (const p of paths) {
        expect(p).toMatch(/^\/audio\/sfx\//);
      }
    }
  });
});

describe("MUSIC_MANIFEST", () => {
  const requiredSlots: MusicSlot[] = [
    "title",
    "overworld",
    "interior-safe",
    "interior-deep",
    "battle",
    "boss",
    "final",
  ];

  it("has all required slots", () => {
    for (const slot of requiredSlots) {
      expect(MUSIC_MANIFEST[slot]).toBeDefined();
      expect(MUSIC_MANIFEST[slot].length).toBeGreaterThan(0);
    }
  });

  it("all paths start with /audio/music/", () => {
    for (const paths of Object.values(MUSIC_MANIFEST)) {
      for (const p of paths) {
        expect(p).toMatch(/^\/audio\/music\//);
      }
    }
  });
});

/* ------------------------------------------------------------------ */
/*  DEFAULT_AUDIO_SETTINGS                                            */
/* ------------------------------------------------------------------ */

describe("DEFAULT_AUDIO_SETTINGS", () => {
  it("has expected defaults", () => {
    expect(DEFAULT_AUDIO_SETTINGS.masterVolume).toBe(78);
    expect(DEFAULT_AUDIO_SETTINGS.musicVolume).toBe(45);
    expect(DEFAULT_AUDIO_SETTINGS.sfxVolume).toBe(42);
    expect(DEFAULT_AUDIO_SETTINGS.muted).toBe(false);
  });
});
