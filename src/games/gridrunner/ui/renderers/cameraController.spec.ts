/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { describe, it, expect } from "vitest";
import {
  createCamera,
  setCameraTarget,
  snapCamera,
  tickCamera,
  type CameraState,
} from "./cameraController";

const VP_W = 16;
const VP_H = 12;

describe("createCamera", () => {
  it("centers the camera on the player on a large map", () => {
    // 60x40 map, player at (30, 20): target is (30 - 8, 20 - 6) = (22, 14)
    const cam = createCamera(30, 20, 60, 40, VP_W, VP_H);
    expect(cam.x).toBeCloseTo(22);
    expect(cam.y).toBeCloseTo(14);
    expect(cam.targetX).toBeCloseTo(22);
    expect(cam.targetY).toBeCloseTo(14);
  });

  it("clamps at top-left when player is near origin", () => {
    const cam = createCamera(0, 0, 60, 40, VP_W, VP_H);
    expect(cam.x).toBe(0);
    expect(cam.y).toBe(0);
    expect(cam.targetX).toBe(0);
    expect(cam.targetY).toBe(0);
  });

  it("clamps at bottom-right when player is near far corner", () => {
    // map 60x40, vp 16x12 -> max camera = (44, 28)
    const cam = createCamera(59, 39, 60, 40, VP_W, VP_H);
    expect(cam.x).toBe(44);
    expect(cam.y).toBe(28);
  });

  it("stays at (0, 0) when the map fits entirely inside the viewport", () => {
    // Current 16x12 overworld: map equals viewport, camera pinned to origin
    const cam = createCamera(7, 10, 16, 12, VP_W, VP_H);
    expect(cam.x).toBe(0);
    expect(cam.y).toBe(0);
    expect(cam.targetX).toBe(0);
    expect(cam.targetY).toBe(0);
  });

  it("stays at (0, 0) when the map is smaller than the viewport", () => {
    const cam = createCamera(5, 5, 12, 10, VP_W, VP_H);
    expect(cam.x).toBe(0);
    expect(cam.y).toBe(0);
  });
});

describe("setCameraTarget", () => {
  it("updates targetX/targetY but does not move current x/y", () => {
    const start: CameraState = { x: 10, y: 5, targetX: 10, targetY: 5 };
    const next = setCameraTarget(start, 25, 20, 60, 40, VP_W, VP_H);
    expect(next.x).toBe(10);
    expect(next.y).toBe(5);
    expect(next.targetX).toBeCloseTo(17); // 25 - 8
    expect(next.targetY).toBeCloseTo(14); // 20 - 6
  });

  it("clamps the target at map edges", () => {
    const start: CameraState = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const next = setCameraTarget(start, 59, 39, 60, 40, VP_W, VP_H);
    expect(next.targetX).toBe(44);
    expect(next.targetY).toBe(28);
  });

  it("pins target to origin when the map fits inside the viewport", () => {
    const start: CameraState = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const next = setCameraTarget(start, 7, 10, 16, 12, VP_W, VP_H);
    expect(next.targetX).toBe(0);
    expect(next.targetY).toBe(0);
  });
});

describe("tickCamera", () => {
  it("moves current x/y toward target", () => {
    const start: CameraState = { x: 0, y: 0, targetX: 10, targetY: 8 };
    const next = tickCamera(start, 1 / 60);
    expect(next.x).toBeGreaterThan(0);
    expect(next.x).toBeLessThan(10);
    expect(next.y).toBeGreaterThan(0);
    expect(next.y).toBeLessThan(8);
    expect(next.targetX).toBe(10);
    expect(next.targetY).toBe(8);
  });

  it("does not overshoot the target", () => {
    const start: CameraState = { x: 0, y: 0, targetX: 10, targetY: 8 };
    // Huge dt should not push past the target; exponential lerp saturates at target.
    const next = tickCamera(start, 100);
    expect(next.x).toBeLessThanOrEqual(10);
    expect(next.y).toBeLessThanOrEqual(8);
    expect(next.x).toBeCloseTo(10, 3);
    expect(next.y).toBeCloseTo(8, 3);
  });

  it("is a no-op when already at target (within epsilon)", () => {
    const start: CameraState = { x: 5, y: 3, targetX: 5, targetY: 3 };
    const next = tickCamera(start, 1 / 60);
    expect(next.x).toBe(5);
    expect(next.y).toBe(3);
  });

  it("snaps to target when remaining delta is smaller than epsilon", () => {
    const start: CameraState = {
      x: 5 - 0.0001,
      y: 3 - 0.0001,
      targetX: 5,
      targetY: 3,
    };
    const next = tickCamera(start, 1 / 60);
    expect(next.x).toBe(5);
    expect(next.y).toBe(3);
  });

  it("crosses 95% of a 10-tile jump by ~150ms at default speed (60fps ticks)", () => {
    // Exponential lerp asymptotes rather than terminating. At the default
    // lerp speed, 9 frames at 60fps (~150ms) should cover >= 95% of the gap.
    let cam: CameraState = { x: 0, y: 0, targetX: 10, targetY: 0 };
    for (let i = 0; i < 9; i++) {
      cam = tickCamera(cam, 1 / 60);
    }
    expect(cam.x).toBeGreaterThan(9.5);
    expect(cam.x).toBeLessThanOrEqual(10);
  });

  it("is framerate-independent: same total dt yields similar result whether 1 tick or many", () => {
    const start: CameraState = { x: 0, y: 0, targetX: 10, targetY: 0 };
    const oneBig = tickCamera(start, 1 / 6); // single 167ms tick
    let many = start;
    for (let i = 0; i < 10; i++) {
      many = tickCamera(many, 1 / 60); // ten 16.7ms ticks = 167ms
    }
    // Exponential lerp is exactly framerate-independent; tolerate tiny floating-point drift.
    expect(many.x).toBeCloseTo(oneBig.x, 6);
  });
});

describe("snapCamera", () => {
  it("sets both current and target to the clamped player-centered position (no lerp)", () => {
    const start: CameraState = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const snapped = snapCamera(start, 30, 20, 60, 40, VP_W, VP_H);
    expect(snapped.x).toBeCloseTo(22);
    expect(snapped.y).toBeCloseTo(14);
    expect(snapped.targetX).toBe(snapped.x);
    expect(snapped.targetY).toBe(snapped.y);
  });

  it("pins to origin on zone transition into a map that fits the viewport", () => {
    const start: CameraState = { x: 5.3, y: 4.1, targetX: 7, targetY: 6 };
    const snapped = snapCamera(start, 7, 10, 16, 12, VP_W, VP_H);
    expect(snapped.x).toBe(0);
    expect(snapped.y).toBe(0);
    expect(snapped.targetX).toBe(0);
    expect(snapped.targetY).toBe(0);
  });
});
