import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  clearGamePreference,
  getGamePreference,
  setGamePreference,
  STORAGE_KEY_NAME,
} from "./storage";

type LocalStorageStub = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

function createLocalStorageStub(): LocalStorageStub {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe("shared storage game preferences", () => {
  const originalWindow = globalThis.window;
  let localStorageStub: LocalStorageStub;

  beforeEach(() => {
    localStorageStub = createLocalStorageStub();
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: localStorageStub,
      },
    });
  });

  afterEach(() => {
    if (originalWindow === undefined) {
      Reflect.deleteProperty(globalThis, "window");
    } else {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: originalWindow,
      });
    }
  });

  it("stores a Digital House help preference inside the shared namespace", () => {
    setGamePreference("digital-house", "hide-help-modal", true);

    expect(
      getGamePreference<boolean>("digital-house", "hide-help-modal"),
    ).toBe(true);

    const raw = localStorageStub.getItem(STORAGE_KEY_NAME);
    expect(raw).toContain("digital-house");
    expect(raw).toContain("hide-help-modal");
  });

  it("clears a stored game preference without removing unrelated state", () => {
    setGamePreference("digital-house", "hide-help-modal", true);
    setGamePreference("another-game", "other-flag", "keep");

    clearGamePreference("digital-house", "hide-help-modal");

    expect(
      getGamePreference<boolean>("digital-house", "hide-help-modal"),
    ).toBeUndefined();
    expect(getGamePreference("another-game", "other-flag")).toBe("keep");
  });
});
