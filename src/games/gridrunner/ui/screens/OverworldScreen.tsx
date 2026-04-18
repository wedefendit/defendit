"use client";

/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { useEffect, useRef } from "react";
import type { GameMap, Position } from "../../engine/types";
import type { Direction } from "../../engine/movement";
import {
  createCamera,
  setCameraTarget,
  snapCamera,
  tickCamera,
  type CameraState,
} from "../renderers/cameraController";
import { paintPlayer, paintTiles } from "../renderers/tileRenderer";

/** Fixed viewport resolution -- every map paints into this tile grid. */
const VP_W = 16;
const VP_H = 12;

type OverworldScreenProps = Readonly<{
  map: GameMap;
  playerPos: Position;
  facing: Direction;
  zoneName?: string;
}>;

export function OverworldScreen({
  map,
  playerPos,
  facing,
  zoneName,
}: OverworldScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Camera state lives in useRef per the GDD canvas boundary rules --
  // it changes every frame and must not trigger React re-renders.
  const cameraRef = useRef<CameraState>(
    createCamera(playerPos.x, playerPos.y, map.width, map.height, VP_W, VP_H),
  );
  const prevMapIdRef = useRef<string>(map.id);

  // RAF loop reads the latest props through these refs instead of redeclaring
  // the frame callback when props change. The effect runs once on mount.
  const mapRef = useRef<GameMap>(map);
  const playerPosRef = useRef<Position>(playerPos);
  const facingRef = useRef<Direction>(facing);

  // Tile pixel size after device-pixel-ratio scaling. 0 until first resize.
  const tileSizePxRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  /* ---------------- Keep prop-backed refs fresh ---------------- */

  useEffect(() => {
    mapRef.current = map;
  }, [map]);
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);
  useEffect(() => {
    facingRef.current = facing;
  }, [facing]);

  /* ---------------- Camera target / zone snap ---------------- */

  useEffect(() => {
    const sameZone = prevMapIdRef.current === map.id;
    if (sameZone) {
      // Same map: update target; tickCamera will lerp toward it.
      cameraRef.current = setCameraTarget(
        cameraRef.current,
        playerPos.x,
        playerPos.y,
        map.width,
        map.height,
        VP_W,
        VP_H,
      );
    } else {
      // Zone transition: snap, do not lerp across map boundaries.
      cameraRef.current = snapCamera(
        cameraRef.current,
        playerPos.x,
        playerPos.y,
        map.width,
        map.height,
        VP_W,
        VP_H,
      );
      prevMapIdRef.current = map.id;
    }
  }, [map, playerPos.x, playerPos.y]);

  /* ---------------- Canvas sizing / ResizeObserver ---------------- */

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Debounce resize to one rAF per burst so rapid ResizeObserver ticks
    // collapse into a single canvas reconfiguration.
    let pendingRaf: number | null = null;

    const apply = () => {
      pendingRaf = null;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw <= 0 || ch <= 0) return;

      const tileCssPx = Math.floor(Math.min(cw / VP_W, ch / VP_H));
      if (tileCssPx <= 0) return;

      const dpr = globalThis.devicePixelRatio || 1;
      const cssW = tileCssPx * VP_W;
      const cssH = tileCssPx * VP_H;

      // Backing buffer sized for the physical display; CSS size matches the
      // integer tile grid so there is never sub-pixel scaling in the browser.
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      tileSizePxRef.current = tileCssPx * dpr;
    };

    const schedule = () => {
      if (pendingRaf !== null) return;
      pendingRaf = requestAnimationFrame(apply);
    };

    apply();
    const ro = new ResizeObserver(schedule);
    ro.observe(container);

    return () => {
      ro.disconnect();
      if (pendingRaf !== null) cancelAnimationFrame(pendingRaf);
    };
  }, []);

  /* ---------------- RAF paint loop ---------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;

    const frame = (timestamp: number) => {
      const last = lastFrameRef.current || timestamp;
      const dt = Math.max(0, (timestamp - last) / 1000);
      lastFrameRef.current = timestamp;

      cameraRef.current = tickCamera(cameraRef.current, dt);

      // Expose live camera position for tests (camera-pan contract). Two
      // string assignments per frame -- negligible overhead, zero effect on
      // gameplay, reads nicely via canvas.dataset.cx / dataset.cy.
      canvas.dataset.cx = cameraRef.current.x.toFixed(3);
      canvas.dataset.cy = cameraRef.current.y.toFixed(3);

      const tileSize = tileSizePxRef.current;
      if (tileSize > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paintTiles(
          ctx,
          mapRef.current,
          cameraRef.current,
          tileSize,
          VP_W,
          VP_H,
          timestamp,
        );
        paintPlayer(
          ctx,
          playerPosRef.current.x,
          playerPosRef.current.y,
          facingRef.current,
          mapRef.current,
          cameraRef.current,
          tileSize,
          VP_W,
          VP_H,
        );
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      lastFrameRef.current = 0;
    };
  }, []);

  /* ---------------- Render ---------------- */

  return (
    <section
      data-testid="gr-overworld"
      aria-label={zoneName ?? "Map"}
      className="flex flex-1 flex-col overflow-hidden bg-[#06080f]"
    >
      <div className="gr-font-mono shrink-0 px-2 py-1 text-center text-xs tracking-[0.15em] text-[#00f0ff]/50">
        {zoneName ?? "CYBERSPACE"}
      </div>

      <div
        ref={containerRef}
        className="flex flex-1 min-h-0 items-center justify-center overflow-hidden"
      >
        <canvas ref={canvasRef} className="block" />
      </div>
    </section>
  );
}
