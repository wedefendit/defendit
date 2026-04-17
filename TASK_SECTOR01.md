# TASK: Sector 01 Overworld Overhaul

**Priority:** Next sprint
**Scope:** Multiple commits

---

## Overview

The current overworld shows 14 buildings (2 accessible, 12 locked). It's cluttered, misleading, and creates no sense of progression. Replace it with a focused Sector 01 map: Arcade, Bank, Crypto Exchange (locked), and Digital Sea encounter zones filling the open space. Beat Lazarus → narrative popup → Crypto Exchange unlocks → optional mini-boss. Battle transitions added.

---

## Commit 1: Strip Overworld + Add Digital Sea

### data/maps/overworld.ts

Redesign the 16x12 overworld. Three buildings, Digital Sea fills open space.

**Tile types needed:**
- `grid` -- safe path tiles (no encounters, existing)
- `sea` -- Digital Sea tiles (encounter zone, new). Visually distinct: darker cyan, pulsing/ripple animation. Walking on these triggers encounter RNG (25-35% per step, same as building interiors).
- `building` -- building entrance tiles (existing)
- `void` -- empty border (existing)
- `gate` -- locked passage to Sector 02 (new). Shows as a sealed wall/barrier. Opens after Lazarus defeat + narrative.

**Layout concept:**
```
Row 0:  V  V  V  V  V  V  V  V  V  V  V  V  V  V  V  V
Row 1:  V  G  G  G  S  S  S  S  S  S  G  G  G  G  G  V
Row 2:  V  G  A  G  S  S  S  S  S  S  G  G  B  G  G  V
Row 3:  V  G  G  G  S  S  S  S  S  S  G  G  G  G  G  V
Row 4:  V  G  G  S  S  S  S  S  S  S  S  G  G  G  G  V
Row 5:  V  G  G  S  S  S  S  S  S  S  S  G  G  G  G  V
Row 6:  V  G  G  S  S  S  S  S  S  S  S  G  G  G  G  V
Row 7:  V  G  G  S  S  S  S  S  S  S  S  G  G  G  G  V
Row 8:  V  G  G  G  S  S  S  S  S  S  G  G  X  G  G  V
Row 9:  V  G  G  G  S  S  S  S  S  S  G  G  G  G  G  V
Row10:  V  G  G  G  G  G  G  G  G  G  G  G  G  G  T  V
Row11:  V  V  V  V  V  V  V  V  V  V  V  V  V  V  V  V

A = Arcade entrance
B = Bank entrance
X = Crypto Exchange entrance (locked, shows "LOCKED")
T = Gate to Sector 02 (sealed, shows "SEALED" or nothing until post-Lazarus)
G = Grid path (safe)
S = Digital Sea (encounter zone)
V = Void
```

Arcade top-left area, Bank top-right, Digital Sea fills the middle as a large body players can walk through or go around on grid paths. Crypto Exchange bottom-right-ish. Sector 02 gate far right edge.

**This layout is a starting point.** The exact arrangement may shift during implementation as long as the structure holds: three buildings, sea in the middle, gate at the edge.

### Digital Sea encounter pool

Per GDD 4.1: Script Kiddies, Cryptominers, Ransomware Bots. Not zone-specific. Generic ambient threats.

Add to `engine/enemies.ts` if not already present:
- Script Kiddie (already exists)
- Ransomware Bot (already exists)
- Cryptominer (new, same spec as TASK_ZONES_V2.md)

### Digital Sea tile rendering

In `ui/screens/OverworldScreen.tsx`:
- Sea tiles get a distinct visual treatment. Darker cyan base (`#0a2a3a`), subtle CSS animation for ripple/pulse effect. Use Tailwind `animate-pulse` or a custom keyframe. Must be clearly different from grid paths.
- Keep it simple for V1. A color shift + slow pulse is enough.

**Note:** OverworldScreen is listed as locked. This change is permitted because it's adding rendering for a new tile type, not changing the existing tile rendering, viewport, or fitGrid logic. The map renderer needs to know how to draw sea tiles.

### Zone label

Change "CYBERSPACE -- SECTOR 01" to "THE GRID" in `data/zones.ts` ZONE_NAMES for the overworld key.

### Tests

Playwright:
- Overworld renders with only 3 building entrances (Arcade, Bank, Crypto Exchange)
- No "LOCKED" labels except on Crypto Exchange
- Walking on Digital Sea tile can trigger encounter
- Walking on grid path does not trigger encounter
- Digital Sea tiles visually distinct from grid paths

### Commit

```
feat(gridrunner): overhaul sector 01 overworld

Strip 12 locked buildings. Add Digital Sea encounter zone with
Script Kiddie, Ransomware Bot, Cryptominer pool. Three buildings:
Arcade, Bank, Crypto Exchange (locked). Sealed Sector 02 gate.
```

---

## Commit 2: Battle Transition

### CRT glitch effect between map and battle

When an encounter triggers (on Digital Sea step or building interior encounter tile):

1. Screen flashes with a CRT static/glitch effect for ~400ms
2. Battle screen loads

When battle ends:

1. Brief glitch flash ~200ms
2. Map screen resumes

### Implementation

New file: `ui/shared/BattleTransition.tsx` ('use client')

- Full-viewport overlay with CSS animation
- Visual: horizontal scan lines + brief color distortion + noise texture
- Use CSS only (no canvas, no WebGL). Keyframe animation with `mix-blend-mode`, pseudo-elements for scan lines, opacity flash.
- Component renders on top of everything when `transitioning: true`
- Auto-dismisses after animation duration via `onAnimationEnd`

State in `useGridRunner.ts`:
- Add `battleTransition: "entering" | "exiting" | null` to GameState
- When encounter triggers: set `battleTransition = "entering"`, after 400ms timeout start the actual battle
- When battle ends: set `battleTransition = "exiting"`, after 200ms timeout return to map

### Tests

Playwright:
- Encounter trigger shows transition overlay briefly
- Battle screen appears after transition

### Commit

```
feat(gridrunner): add CRT glitch battle transition

400ms entering, 200ms exiting. CSS-only scan lines and color
distortion. Fires on encounter trigger and battle end.
```

---

## Commit 3: Crypto Exchange + The Mixer

### data/maps/exchange.ts

Small interior (12x10). Single open room.

```
Row 0:  W  W  W  W  W  W  W  W  W  W  W  W
Row 1:  W  F  F  F  F  F  F  F  F  F  F  W
Row 2:  W  F  F  S  F  F  F  F  S  F  F  W
Row 3:  W  F  F  F  F  F  F  F  F  F  F  W
Row 4:  W  F  F  F  F  N  F  F  F  F  F  W
Row 5:  W  F  F  S  F  F  F  F  S  F  F  W
Row 6:  W  F  F  F  F  F  F  F  F  F  F  W
Row 7:  W  F  F  F  F  B  F  F  F  F  F  W
Row 8:  W  F  F  F  F  F  F  F  F  F  F  W
Row 9:  W  W  W  W  W  E  W  W  W  W  W  W
```

- Entry: row 9, col 5
- Boss: row 7, col 5 (The Mixer)
- Encounter tiles: 4 (light grind, this is a short zone)
- NPC: row 4, col 5 -- "Lazarus stole the money. This is where they wash it. Billions in crypto, tumbled through mixers until it is untraceable."
- Tileset theme: crypto tickers, wallet addresses, transaction hashes, neon green accents

### Encounter table

Crypto Exchange enemies: Cryptominer (50%), Ransomware Bot (30%), Script Kiddie (20%)

Drop table: Exploit 35%, Persistence 30%, Recon 20%, Defense 15%.

### The Mixer (mini-boss)

Not a nation-state APT. An automated system. Easier than Lazarus.

```ts
{
  id: "the-mixer",
  name: "The Mixer",
  isBoss: true,
  isMiniBoss: true,
  zone: "exchange",
  hp: 150,
  level: 6,
  speed: 15,
  defense: 4,
  weakness: "recon",
  attacks: [
    { name: "Tumble", power: 20, accuracy: 90, type: "persistence", energyDrain: 8 },
    { name: "Wash Cycle", power: 15, accuracy: 95, type: "recon", healSelf: 10 },
    { name: "Gas Fee", power: 25, accuracy: 85, type: "exploit", bitsDrain: 5 },
    { name: "Rugpull", power: 35, accuracy: 70, type: "exploit" }
  ],
  firstKillXp: 150,
  firstKillBits: 75,
  firstKillDrop: { toolId: "hashcat", minRarity: "uncommon" }
}
```

**Mini-boss differences from full bosses:**
- No intel report on defeat (optional content, not main progression)
- No badge
- Lower HP/stats than Lazarus
- Still a guaranteed first-kill drop

**Special mechanics:**

- `bitsDrain`: On hit, player loses N Bits. "The Mixer siphoned 5 Bits!" Implementation: `save.bits = Math.max(0, save.bits - N)`.
- `healSelf`: Already implemented for APT33 (if defense tools task ran first). Mixer heals 10 on Wash Cycle.

### Unlock gate

Crypto Exchange accessible only when `save.defeatedBosses.includes("lazarus")`.

### Tests (write first)

Vitest:
- The Mixer Tumble drains 8 energy
- The Mixer Gas Fee drains 5 Bits
- The Mixer Wash Cycle heals 10 HP
- Crypto Exchange locked without lazarus defeated
- Crypto Exchange accessible with lazarus defeated

Playwright:
- Before Lazarus: Crypto Exchange shows LOCKED
- After Lazarus: enter Crypto Exchange, encounter enemies, fight The Mixer
- Defeat The Mixer: no intel report, get Hashcat drop

### Commit

```
feat(gridrunner): add crypto exchange with The Mixer mini-boss

Unlocks after Lazarus defeat. The Mixer is an energy/bits drain
fight. Drops Hashcat on first kill. No intel report (optional
content). Cryptominer-heavy encounter table.
```

---

## Commit 4: Post-Lazarus Narrative + Sector 02 Gate Tease

### Narrative popup

After defeating Lazarus for the first time, after the intel report dismisses, a narrative overlay appears.

New file: `ui/screens/NarrativeOverlay.tsx` ('use client')

Uses OverlayShell fullscreen variant. Simple text screen.

**Copy:**

```
INCOMING TRANSMISSION

Operator, you have done well. Lazarus Group has been neutralized
in this sector. But this is only the beginning.

The grid spans the entire world. Nation-state actors are targeting
every sector: healthcare, energy, government, telecommunications,
research. Each one more sophisticated than the last.

Your next deployment: Sector 02. An APT group called Elfin has
infiltrated a hospital network. Medical systems are going dark.

Prepare your tools. The real work starts now.

[ CONTINUE ]
```

### Sector 02 gate

After the narrative dismisses:
- The sealed gate tile on the overworld changes from "SEALED" to an open passage visual
- Save flag: `sector02Unlocked: true`
- Walking onto the gate tile shows: "Sector 02 is under construction. Check back soon." (for now, until Sector 02 is actually built)

### Crypto Exchange unlock

Also fires after Lazarus defeat:
- Crypto Exchange "LOCKED" label changes to "ENTER"
- Already handled by the `defeatedBosses.includes("lazarus")` check

### Flow after first Lazarus kill

Battle win → level-up overlay (if applicable) → intel report → narrative overlay → return to map (Crypto Exchange now open, Sector 02 gate now open)

### Tests

Playwright:
- First Lazarus defeat: narrative overlay appears after intel report
- Narrative CONTINUE dismisses, returns to map
- Sector 02 gate tile shows "under construction" message on interaction
- Crypto Exchange now shows ENTER instead of LOCKED

### Commit

```
feat(gridrunner): add post-lazarus narrative and sector 02 gate tease

Narrative transmission explains the bigger world after first boss
defeat. Sector 02 gate opens visually but shows "under construction"
placeholder. Crypto Exchange unlocks simultaneously.
```

---

## Execution Order

1. Overworld strip + Digital Sea + zone label fix
2. Battle transition
3. Crypto Exchange map + The Mixer mini-boss
4. Post-Lazarus narrative + Sector 02 gate

## New Tile Types Introduced

| Type | Visual | Encounter | First Used |
|---|---|---|---|
| `sea` | Dark cyan, pulsing animation | Yes (25-35% per step) | Sector 01 overworld |
| `gate` | Sealed barrier / open passage | No | Sector 01 edge |

## New Battle Mechanics Introduced

| Mechanic | First Used By | Implementation |
|---|---|---|
| `bitsDrain` | The Mixer Gas Fee | Player loses N Bits on hit |
| `healSelf` | The Mixer Wash Cycle | Boss heals N HP on hit (reusable for APT33 later) |

## Files That Must Not Change

Shell, HUD, audio, BattleScreen layout -- all locked per CLAUDE.md.

OverworldScreen gets a new tile type renderer for sea tiles only. No changes to viewport, fitGrid, camera, or existing tile rendering.
