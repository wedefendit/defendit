/*
Copyright © 2025 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameMap, MapTile, Position, TileKind } from "../../engine/types";
import type { Direction } from "../../engine/movement";

/** Fixed viewport resolution -- every map renders into this grid */
const VP_W = 16;
const VP_H = 12;

type OverworldScreenProps = Readonly<{
  map: GameMap;
  playerPos: Position;
  facing: Direction;
  zoneName?: string;
}>;

/* ------------------------------------------------------------------ */
/*  Tile colors                                                       */
/* ------------------------------------------------------------------ */

const TILE_BG: Record<TileKind | "void", string> = {
  ground: "#0a0e1a",
  wall: "#0d1520",
  building: "#111d30",
  entry: "#0a1225",
  locked: "#100d18",
  spawn: "#0a0e1a",
  void: "#06080f",
};

const TILE_BORDER: Record<TileKind | "void", string> = {
  ground: "#1a3a4a",
  wall: "#1a2a38",
  building: "#00f0ff",
  entry: "#00ff41",
  locked: "#ff003c",
  spawn: "#1a3a4a",
  void: "#0c1018",
};

const FACING_ARROW: Record<Direction, string> = {
  up: "\u25B2",
  down: "\u25BC",
  left: "\u25C0",
  right: "\u25B6",
};

/* ------------------------------------------------------------------ */
/*  Camera                                                            */
/* ------------------------------------------------------------------ */

/**
 * Compute the camera offset for maps larger than the viewport.
 * Centers on the player, clamped to map edges.
 */
function cameraOffset(
  playerPos: Position,
  mapW: number,
  mapH: number,
): Position {
  let cx = playerPos.x - Math.floor(VP_W / 2);
  let cy = playerPos.y - Math.floor(VP_H / 2);
  cx = Math.max(0, Math.min(cx, mapW - VP_W));
  cy = Math.max(0, Math.min(cy, mapH - VP_H));
  return { x: cx, y: cy };
}

/**
 * Build the VP_W x VP_H grid of tiles to render.
 * - Maps smaller than viewport: centered with void fill.
 * - Maps equal to viewport: rendered 1:1.
 * - Maps larger than viewport: panned via camera offset.
 */
function buildViewport(
  map: GameMap,
  playerPos: Position,
): { tile: MapTile | null; mapX: number; mapY: number }[][] {
  const rows: { tile: MapTile | null; mapX: number; mapY: number }[][] = [];

  if (map.width <= VP_W && map.height <= VP_H) {
    // Center the map, fill void around it
    const offsetX = Math.floor((VP_W - map.width) / 2);
    const offsetY = Math.floor((VP_H - map.height) / 2);

    for (let vy = 0; vy < VP_H; vy++) {
      const row: { tile: MapTile | null; mapX: number; mapY: number }[] = [];
      for (let vx = 0; vx < VP_W; vx++) {
        const mx = vx - offsetX;
        const my = vy - offsetY;
        if (mx >= 0 && mx < map.width && my >= 0 && my < map.height) {
          row.push({ tile: map.tiles[my][mx], mapX: mx, mapY: my });
        } else {
          row.push({ tile: null, mapX: -1, mapY: -1 });
        }
      }
      rows.push(row);
    }
  } else {
    // Pan camera
    const cam = cameraOffset(playerPos, map.width, map.height);
    for (let vy = 0; vy < VP_H; vy++) {
      const row: { tile: MapTile | null; mapX: number; mapY: number }[] = [];
      for (let vx = 0; vx < VP_W; vx++) {
        const mx = cam.x + vx;
        const my = cam.y + vy;
        if (mx >= 0 && mx < map.width && my >= 0 && my < map.height) {
          row.push({ tile: map.tiles[my][mx], mapX: mx, mapY: my });
        } else {
          row.push({ tile: null, mapX: -1, mapY: -1 });
        }
      }
      rows.push(row);
    }
  }

  return rows;
}

/* ------------------------------------------------------------------ */
/*  Components                                                        */
/* ------------------------------------------------------------------ */

function TileCell({ tile }: { tile: MapTile | null }) {
  const kind = tile?.kind ?? "void";
  const bg = TILE_BG[kind as keyof typeof TILE_BG] ?? TILE_BG.void;
  const border = TILE_BORDER[kind as keyof typeof TILE_BORDER] ?? TILE_BORDER.void;

  const showLabel =
    tile?.label && (tile.kind === "entry" || tile.kind === "locked");

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        ...(tile && (tile.kind === "building" || tile.kind === "locked")
          ? { boxShadow: `inset 0 0 6px ${border}22` }
          : {}),
      }}
    >
      {showLabel && (
        <span
          className="text-center leading-none"
          style={{
            fontSize: "clamp(5px, 1.2vw, 8px)",
            color: border,
            opacity: 0.7,
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          {tile!.kind === "locked" ? "LOCKED" : "ENTER"}
        </span>
      )}
    </div>
  );
}

function PlayerAvatar({ facing }: { facing: Direction }) {
  return (
    <div
      data-testid="gr-player"
      className="absolute inset-0 z-10 flex items-center justify-center"
    >
      <div
        className="flex items-center justify-center rounded-sm"
        style={{
          width: "70%",
          height: "70%",
          backgroundColor: "#00f0ff",
          boxShadow: "0 0 8px #00f0ff, 0 0 3px #00f0ff",
          color: "#0a0e1a",
          fontSize: "clamp(6px, 1.5vw, 12px)",
          fontWeight: "bold",
        }}
      >
        {FACING_ARROW[facing]}
      </div>
    </div>
  );
}

/**
 * Fit the largest VP_W:VP_H rectangle inside a container.
 */
function fitGrid(cw: number, ch: number) {
  const ratio = VP_W / VP_H;
  const containerRatio = cw / ch;

  if (containerRatio > ratio) {
    const h = ch;
    const w = h * ratio;
    return { w: Math.floor(w), h: Math.floor(h) };
  } else {
    const w = cw;
    const h = w / ratio;
    return { w: Math.floor(w), h: Math.floor(h) };
  }
}

/**
 * Map renderer. Always renders a fixed VP_W x VP_H grid.
 * Small maps are centered with void tiles. Large maps pan with the player.
 * Tile size is always consistent.
 */
export function OverworldScreen({ map, playerPos, facing, zoneName }: OverworldScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState<{ w: number; h: number } | null>(null);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { clientWidth, clientHeight } = el;
    if (clientWidth > 0 && clientHeight > 0) {
      setGridSize(fitGrid(clientWidth, clientHeight));
    }
  }, []);

  useEffect(() => {
    measure();
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const viewport = buildViewport(map, playerPos);

  return (
    <section
      data-testid="gr-overworld"
      aria-label={zoneName ?? "Map"}
      className="flex flex-1 flex-col overflow-hidden"
      style={{ backgroundColor: "#06080f" }}
    >
      {/* Map label */}
      <div
        className="shrink-0 px-2 py-1 text-center"
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "clamp(8px, 1.5vw, 11px)",
          color: "#00f0ff",
          opacity: 0.5,
          letterSpacing: "0.15em",
        }}
      >
        {zoneName ?? "CYBERSPACE"}
      </div>

      {/* Fixed-size viewport grid */}
      <div
        ref={containerRef}
        className="flex flex-1 min-h-0 items-center justify-center overflow-hidden"
      >
        {gridSize && (
          <div
            data-testid="gr-map"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${VP_W}, 1fr)`,
              gridTemplateRows: `repeat(${VP_H}, 1fr)`,
              width: gridSize.w,
              height: gridSize.h,
            }}
          >
            {viewport.flatMap((row, vy) =>
              row.map((cell, vx) => (
                <div key={`${vx}-${vy}`} className="relative min-h-0 min-w-0">
                  <TileCell tile={cell.tile} />
                  {cell.mapX === playerPos.x && cell.mapY === playerPos.y && (
                    <PlayerAvatar facing={facing} />
                  )}
                </div>
              )),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
