# TASK: Hotkey Audit

**Priority:** Backlog
**Scope:** One commit

---

## Problem

Current hotkey bindings have not been audited. "I" likely opens the Identity Disc but should open Inventory (standard RPG convention). Tab has no function but should cycle overlays.

## Target Bindings

| Key | Action | Context |
|---|---|---|
| I | Open Inventory | Overworld, building (not battle) |
| D | Open Identity Disc | Overworld, building, battle (player turn) |
| O | Open Operator (stats) | Overworld, building |
| Tab | Cycle overlays: Inventory → Disc → Operator → close | Overworld, building |
| ESC | Close any overlay / open menu if none open | Everywhere |
| Enter / Space | A button (confirm, interact, select tool) | Everywhere |
| Backspace | B button (back, cancel, close) | Everywhere |
| WASD / Arrows | Movement | Overworld, building |
| 1-4 | Select tool 1-4 in battle | Battle only |
| 5 | RUN | Battle only |

## Implementation

### hooks/useGridRunner.ts (or wherever keydown listener lives)

1. Grep for all `addEventListener("keydown"` and `onKeyDown` handlers in src/games/gridrunner/
2. Map current bindings
3. Rebind per the table above
4. Tab cycling: track cycle index in a ref, increment on Tab, modulo 3 (inventory/disc/operator), close on wrapping past operator
5. ESC: if overlay is open, close it. If no overlay and on map, open menu.
6. D in battle: only during player turn (not during enemy turn resolution or animation)

### No new UI

Bindings change. No visual changes.

## Tests

**Playwright (write first):**
- Press I on overworld: inventory opens
- Press D on overworld: disc opens
- Press O on overworld: operator opens
- Press Tab three times: cycles inventory → disc → operator
- Press Tab fourth time: closes
- Press ESC with overlay open: closes it
- Press ESC with no overlay: menu opens
- Press Backspace with overlay open: closes it

## Do NOT

- Change any component layout or styling
- Add new UI elements
- Modify BattleScreen layout
- Change WASD/arrow behavior
- Change Enter/Space behavior

## Commit

```
fix(gridrunner): audit and rebind hotkeys

I=Inventory, D=Disc, O=Operator, Tab=cycle overlays,
ESC=close/menu, Backspace=back. Matches RPG conventions.
```
