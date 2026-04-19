/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

/**
 * Tile renderer for the overworld canvas.
 *
 * Pure painter. Given a 2D rendering context, map data, camera state, and a
 * tile pixel size, paints the current frame. Zero React imports. Zero module-
 * level mutable state. Same inputs always produce the same pixels.
 *
 * The wireframe palette mirrors the Tailwind classes previously used by the
 * DOM grid (OverworldScreen.tsx's TILE_CLASSES). Hex values are kept in sync
 * with the Tron: Legacy neon aesthetic defined in the GDD.
 */

import type { GameMap, MapTile, TileKind } from "../../engine/types";
import type { Direction } from "../../engine/movement";
import type { CameraState } from "./cameraController";

/* ------------------------------------------------------------------ */
/*  Palette                                                           */
/* ------------------------------------------------------------------ */

type TilePaint = {
  fill: string;
  stroke: string;
  /** Optional inner-edge glow color. Rendered as a radial gradient so the
   *  light bleeds in from the tile perimeter, matching the CSS inset shadow
   *  look the DOM version had via `box-shadow: inset 0 0 Npx`. */
  glow?: string;
  /** If true, the glow alpha breathes on a ~2s sine wave. */
  pulse?: "sea" | "boss";
};

export const TILE_COLORS: Record<TileKind, TilePaint> = {
  // Grid paths are the luminous motherboard traces -- noticeably lighter than
  // the void so the network reads at a glance.
  ground: { fill: "#112240", stroke: "#1a3a5a" },
  // Walls and void both paint as the deepest background. Void (`.` tiles
  // between traces) uses this same palette so traces glow against it.
  wall: { fill: "#0a0e1a", stroke: "#1a2a38" },
  building: { fill: "#111d30", stroke: "#00f0ff", glow: "#00f0ff66" },
  entry: { fill: "#0a1e14", stroke: "#00ff41", glow: "#00ff4155" },
  locked: { fill: "#1a0a12", stroke: "#ff003c", glow: "#ff003c66" },
  spawn: { fill: "#112240", stroke: "#1a3a5a" },
  boss: { fill: "#1a0a10", stroke: "#ff003c", glow: "#ff003c99", pulse: "boss" },
  sea: { fill: "#0a2a3a", stroke: "#2a6a8a", glow: "#00d0ff55", pulse: "sea" },
  gate: { fill: "#14060a", stroke: "#6a0020", glow: "#ff003c55" },
  // Decorative door -- reads as "a door" visually but blocks movement.
  // Dimmer than the bright `entry` palette so the player learns by sight
  // that these aren't enterable. No glow pulse.
  facade: { fill: "#0f1a28", stroke: "#2a4a5a" },
};

const VOID_PAINT: TilePaint = { fill: "#0a0e1a", stroke: "#1a2a38" };

/** Gate paint after the sector boss is defeated. Same geometry as the sealed
 *  gate but with a cyan inner glow and slow sea-style breathing pulse so the
 *  "something changed here" hint reads at a glance. */
const GATE_UNLOCKED_PAINT: TilePaint = {
  fill: "#14060a",
  stroke: "#c9e2ff",
  glow: "#00f0ff55",
  pulse: "sea",
};

const PLAYER_FILL = "#00f0ff";
const PLAYER_GLOW = "#00f0ffcc";
const PLAYER_ARROW = "#0a0e1a";

/* ------------------------------------------------------------------ */
/*  Paint helpers                                                     */
/* ------------------------------------------------------------------ */

/** Sine wave in [0, 1], period 2s -- drives sea/boss pulses. */
function pulse01(timeMs: number): number {
  return 0.5 + 0.5 * Math.sin((timeMs / 1000) * Math.PI);
}

function glowAlpha(paint: TilePaint, timeMs: number): number {
  if (paint.pulse === "sea") return 0.55 + 0.45 * pulse01(timeMs);
  if (paint.pulse === "boss") return 0.7 + 0.3 * pulse01(timeMs);
  return 1;
}

function paintTile(
  ctx: CanvasRenderingContext2D,
  tile: MapTile | null,
  px: number,
  py: number,
  size: number,
  timeMs: number,
  gateUnlocked = false,
): void {
  const paint = tile
    ? tile.kind === "gate" && gateUnlocked
      ? GATE_UNLOCKED_PAINT
      : (TILE_COLORS[tile.kind] ?? VOID_PAINT)
    : VOID_PAINT;

  // Base fill.
  ctx.fillStyle = paint.fill;
  ctx.fillRect(px, py, size, size);

  // Inner-edge glow: radial gradient with a transparent center and the neon
  // color pushed out to the edges. Matches the old CSS `box-shadow: inset`
  // look better than a solid-color inset rect.
  if (paint.glow) {
    const cx = px + size / 2;
    const cy = py + size / 2;
    const grad = ctx.createRadialGradient(
      cx,
      cy,
      size * 0.15,
      cx,
      cy,
      size * 0.72,
    );
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(1, paint.glow);

    const prevAlpha = ctx.globalAlpha;
    ctx.globalAlpha = glowAlpha(paint, timeMs);
    ctx.fillStyle = grad;
    ctx.fillRect(px, py, size, size);
    ctx.globalAlpha = prevAlpha;
  }

  // 1px neon border last so it crisply frames the glow.
  ctx.strokeStyle = paint.stroke;
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);
}

/* ------------------------------------------------------------------ */
/*  Public paint API                                                  */
/* ------------------------------------------------------------------ */

/**
 * Paint every tile visible in the viewport for the current camera position.
 *
 * When the map is smaller than the viewport, paints the map centered in the
 * viewport (camera stays at origin), filling surrounding space with void.
 * This matches the pre-canvas `buildViewport` small-map centering branch.
 */
export type PaintFrameState = Readonly<{
  timeMs: number;
  /** When true, any `gate` tile paints with the unlocked (cyan-glow) variant. */
  gateUnlocked?: boolean;
}>;

export function paintTiles(
  ctx: CanvasRenderingContext2D,
  map: GameMap,
  camera: CameraState,
  tileSize: number,
  vpW: number,
  vpH: number,
  frame: PaintFrameState,
): void {
  const { timeMs, gateUnlocked = false } = frame;
  const smallMap = map.width <= vpW && map.height <= vpH;

  if (smallMap) {
    const offsetX = Math.floor((vpW - map.width) / 2);
    const offsetY = Math.floor((vpH - map.height) / 2);
    for (let vy = 0; vy < vpH; vy++) {
      for (let vx = 0; vx < vpW; vx++) {
        const mx = vx - offsetX;
        const my = vy - offsetY;
        const tile =
          mx >= 0 && mx < map.width && my >= 0 && my < map.height
            ? map.tiles[my][mx]
            : null;
        paintTile(
          ctx,
          tile,
          vx * tileSize,
          vy * tileSize,
          tileSize,
          timeMs,
          gateUnlocked,
        );
      }
    }
    return;
  }

  // Large-map branch: paint a 2-tile buffer beyond the viewport so camera
  // lerp never reveals an un-painted seam at the edge. Extras get clipped by
  // the canvas bounds.
  const BUFFER = 2;
  const startX = Math.max(0, Math.floor(camera.x) - BUFFER);
  const startY = Math.max(0, Math.floor(camera.y) - BUFFER);
  const endX = Math.min(map.width, Math.ceil(camera.x + vpW) + BUFFER);
  const endY = Math.min(map.height, Math.ceil(camera.y + vpH) + BUFFER);

  for (let my = startY; my < endY; my++) {
    for (let mx = startX; mx < endX; mx++) {
      const tile = map.tiles[my][mx];
      const px = Math.round((mx - camera.x) * tileSize);
      const py = Math.round((my - camera.y) * tileSize);
      paintTile(ctx, tile, px, py, tileSize, timeMs, gateUnlocked);
    }
  }
}

/**
 * Paint the player avatar as a neon square with a facing chevron.
 *
 * On a small map, the map is centered with the same offset used in paintTiles,
 * so the player sits on its logical tile regardless of the surrounding void.
 */
export function paintPlayer(
  ctx: CanvasRenderingContext2D,
  playerX: number,
  playerY: number,
  facing: Direction,
  map: GameMap,
  camera: CameraState,
  tileSize: number,
  vpW: number,
  vpH: number,
): void {
  const smallMap = map.width <= vpW && map.height <= vpH;
  const offsetX = smallMap ? Math.floor((vpW - map.width) / 2) : 0;
  const offsetY = smallMap ? Math.floor((vpH - map.height) / 2) : 0;

  const px = smallMap
    ? (playerX + offsetX) * tileSize
    : Math.round((playerX - camera.x) * tileSize);
  const py = smallMap
    ? (playerY + offsetY) * tileSize
    : Math.round((playerY - camera.y) * tileSize);

  // Avatar body: 70% tile size, centered, with a soft outer glow.
  const pad = Math.floor(tileSize * 0.15);
  const size = tileSize - pad * 2;

  ctx.save();
  ctx.shadowColor = PLAYER_GLOW;
  ctx.shadowBlur = Math.max(4, Math.floor(tileSize * 0.25));
  ctx.fillStyle = PLAYER_FILL;
  ctx.fillRect(px + pad, py + pad, size, size);
  ctx.restore();

  // Facing chevron, a filled triangle inside the avatar body.
  const cx = px + tileSize / 2;
  const cy = py + tileSize / 2;
  const half = size * 0.28;

  ctx.fillStyle = PLAYER_ARROW;
  ctx.beginPath();
  switch (facing) {
    case "up":
      ctx.moveTo(cx, cy - half);
      ctx.lineTo(cx - half, cy + half);
      ctx.lineTo(cx + half, cy + half);
      break;
    case "down":
      ctx.moveTo(cx, cy + half);
      ctx.lineTo(cx - half, cy - half);
      ctx.lineTo(cx + half, cy - half);
      break;
    case "left":
      ctx.moveTo(cx - half, cy);
      ctx.lineTo(cx + half, cy - half);
      ctx.lineTo(cx + half, cy + half);
      break;
    case "right":
      ctx.moveTo(cx + half, cy);
      ctx.lineTo(cx - half, cy - half);
      ctx.lineTo(cx - half, cy + half);
      break;
  }
  ctx.closePath();
  ctx.fill();
}
