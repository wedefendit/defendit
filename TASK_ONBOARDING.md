# TASK: Progressive Onboarding

**Priority:** Backlog
**Scope:** One commit
**Depends on:** Hotkey audit (player needs to know what key opens Inventory/Disc)

---

## Problem

After the tutorial battle, every other system is unguided. First loot drop, first shop visit, first Disc entry -- the player has no context for what just happened or what to do.

## Design

Reuse the existing `TutorialPrompt.tsx` component (cyan border, orange TUTORIAL label, dismiss with A). Same look, different triggers and copy. Each prompt fires once, sets a save flag, never repeats.

## Onboarding Steps

| Trigger | Save Flag | Copy |
|---|---|---|
| First loot drop after battle win | `onboarding.loot` | "You found a new tool! Open your Inventory (press I) to equip it. Better tools mean more damage." |
| First shop tile interaction | `onboarding.shop` | "Welcome to the shop. Spend Bits to buy new tools. Higher-level tools unlock as you level up." |
| First Identity Disc entry unlocked | `onboarding.disc` | "Your Identity Disc just updated. Press D to open it anytime. It records everything you learn." |
| First boss tile approach | `onboarding.boss` | "Warning: boss ahead. Make sure your tools are equipped and your HP is full before stepping on that tile." |

## Implementation

### engine/types.ts

Add to `GridRunnerSave`:
```ts
onboarding: {
  loot: boolean;
  shop: boolean;
  disc: boolean;
  boss: boolean;
};
```

Default all `false` in `createNewSave`. Save migration: v2 → v3, backfill `onboarding: { loot: false, shop: false, disc: false, boss: false }`.

### hooks/useGridRunner.ts

New `DISMISS_ONBOARDING` action with a `key` payload (`"loot" | "shop" | "disc" | "boss"`). Sets `save.onboarding[key] = true`, clears the active onboarding prompt.

Add `activeOnboarding: string | null` to GameState.

Trigger points:
- **Loot:** In BATTLE_END, when loot drops and `!save.onboarding.loot`, set `activeOnboarding = "loot"`
- **Shop:** In INTERACT when `buildingId === "shop"` and `!save.onboarding.shop`, set `activeOnboarding = "shop"` before opening shop overlay
- **Disc:** When a new Disc entry is unlocked and `!save.onboarding.disc`, set `activeOnboarding = "disc"`
- **Boss:** In MOVE when player is adjacent to boss tile and `!save.onboarding.boss`, set `activeOnboarding = "boss"`

### UI rendering

In GridRunner.tsx: when `activeOnboarding` is set, render TutorialPrompt with the matching copy. Dismiss clears it and proceeds to the normal flow (e.g., shop opens after dismissing the shop onboarding prompt).

### TutorialPrompt.tsx

No changes needed if it already accepts arbitrary `children` or a `message` string prop. If it currently has hardcoded step text, refactor to accept a `message: string` prop. The `step` prop becomes optional (only used for the battle tutorial).

## Tests

**Playwright (write first):**
- First loot drop: onboarding prompt appears, dismiss, second drop: no prompt
- First shop visit: onboarding prompt appears, dismiss, shop opens, second visit: no prompt
- Boss approach: onboarding prompt appears, dismiss, second approach: no prompt

**Vitest:**
- DISMISS_ONBOARDING sets the correct flag and clears activeOnboarding
- Trigger logic: loot onboarding fires only when flag is false

## Do NOT

- Change BattleScreen layout
- Change TutorialPrompt visual styling (reuse as-is)
- Add new components beyond what's needed
- Show multiple onboarding prompts at once (queue if two triggers overlap)

## Commit

```
feat(gridrunner): add progressive onboarding prompts

First-time guidance for loot drops, shop, Identity Disc, and boss
approach. Reuses TutorialPrompt component. Each fires once per save.
Save version bumped to 3 with v2 migration.
```
