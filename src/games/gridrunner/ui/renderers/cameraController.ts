/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

/**
 * Camera controller for the overworld canvas.
 *
 * Pure module. Zero React. Zero DOM. Zero state ownership -- the caller owns
 * a CameraState (typically in useRef) and hands it to these functions each
 * frame. Outputs depend only on inputs, so same inputs always produce same
 * outputs.
 *
 * Coordinate system: camera position is expressed in tile units (fractional).
 * A camera at (4.3, 2.0) means the viewport top-left is painted as though the
 * map tile at (4.3, 2.0) were at pixel (0, 0). The renderer multiplies camera
 * offsets by tile pixel size to translate to pixel space.
 */

export type CameraState = {
  /** Current fractional camera position, in tiles. */
  x: number;
  y: number;
  /** Where the camera is lerping toward. */
  targetX: number;
  targetY: number;
};

/**
 * Default exponential-lerp speed. Exponential lerp asymptotes rather than
 * terminating; at speed=20 the camera reaches 95% of the remaining distance
 * in ~150ms (the GDD's "smooth ~150ms pan" target) and 99.3% in 250ms.
 */
const DEFAULT_LERP_SPEED = 20;

/** Below this tile-space delta, snap current to target to avoid infinite creep. */
const SNAP_EPSILON = 0.001;

/**
 * Return `val` clamped into `[min, max]`. When `max < min` (map smaller than
 * viewport), return `min` so the camera pins to origin.
 */
function clamp(val: number, min: number, max: number): number {
  if (max < min) return min;
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

/**
 * Compute the clamped camera target that centers the player in the viewport.
 */
function computeTarget(
  playerX: number,
  playerY: number,
  mapW: number,
  mapH: number,
  vpW: number,
  vpH: number,
): { x: number; y: number } {
  const rawX = playerX - vpW / 2;
  const rawY = playerY - vpH / 2;
  return {
    x: clamp(rawX, 0, mapW - vpW),
    y: clamp(rawY, 0, mapH - vpH),
  };
}

/**
 * Create initial camera state centered on the player, with current already at
 * target (no initial lerp on spawn / fresh map load).
 */
export function createCamera(
  playerX: number,
  playerY: number,
  mapW: number,
  mapH: number,
  vpW: number,
  vpH: number,
): CameraState {
  const t = computeTarget(playerX, playerY, mapW, mapH, vpW, vpH);
  return { x: t.x, y: t.y, targetX: t.x, targetY: t.y };
}

/**
 * Update the camera target to center the player. Current x/y are preserved so
 * the camera will lerp toward the new target on subsequent ticks.
 */
export function setCameraTarget(
  cam: CameraState,
  playerX: number,
  playerY: number,
  mapW: number,
  mapH: number,
  vpW: number,
  vpH: number,
): CameraState {
  const t = computeTarget(playerX, playerY, mapW, mapH, vpW, vpH);
  return { x: cam.x, y: cam.y, targetX: t.x, targetY: t.y };
}

/**
 * Snap both current and target to the clamped player-centered position.
 * Used on zone transitions so the camera does not lerp across map boundaries.
 */
export function snapCamera(
  _cam: CameraState,
  playerX: number,
  playerY: number,
  mapW: number,
  mapH: number,
  vpW: number,
  vpH: number,
): CameraState {
  // _cam is accepted for signature symmetry with setCameraTarget/tickCamera;
  // snapping fully replaces current and target, so prev state is discarded.
  const t = computeTarget(playerX, playerY, mapW, mapH, vpW, vpH);
  return { x: t.x, y: t.y, targetX: t.x, targetY: t.y };
}

/**
 * Advance the camera one frame. Exponential lerp: framerate-independent, so
 * the camera settles in the same wall-clock time regardless of FPS.
 *
 *   newX = x + (targetX - x) * (1 - e^(-speed * dt))
 *
 * When the remaining distance drops below SNAP_EPSILON, current is pinned to
 * target so we do not accumulate floating-point drift.
 */
export function tickCamera(
  cam: CameraState,
  dt: number,
  lerpSpeed: number = DEFAULT_LERP_SPEED,
): CameraState {
  const dx = cam.targetX - cam.x;
  const dy = cam.targetY - cam.y;

  if (Math.abs(dx) < SNAP_EPSILON && Math.abs(dy) < SNAP_EPSILON) {
    // Already at target within epsilon -- collapse to the exact target value.
    if (cam.x === cam.targetX && cam.y === cam.targetY) return cam;
    return { x: cam.targetX, y: cam.targetY, targetX: cam.targetX, targetY: cam.targetY };
  }

  const t = 1 - Math.exp(-lerpSpeed * dt);
  let nextX = cam.x + dx * t;
  let nextY = cam.y + dy * t;

  if (Math.abs(cam.targetX - nextX) < SNAP_EPSILON) nextX = cam.targetX;
  if (Math.abs(cam.targetY - nextY) < SNAP_EPSILON) nextY = cam.targetY;

  return { x: nextX, y: nextY, targetX: cam.targetX, targetY: cam.targetY };
}
