"use client";

/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
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
/*  Tile class maps                                                   */
/* ------------------------------------------------------------------ */

const TILE_CLASSES: Record<TileKind | "void", string> = {
  ground: "bg-[#0a0e1a] border-[#1a3a4a]",
  wall: "bg-[#0d1520] border-[#1a2a38]",
  building: "bg-[#111d30] border-[#00f0ff] shadow-[inset_0_0_6px_#00f0ff22]",
  entry: "bg-[#0a1225] border-[#00ff41]",
  locked: "bg-[#100d18] border-[#ff003c] shadow-[inset_0_0_6px_#ff003c22]",
  spawn: "bg-[#0a0e1a] border-[#1a3a4a]",
  boss: "bg-[#1a0a10] border-[#ff003c] shadow-[inset_0_0_10px_#ff003c44,0_0_8px_#ff003c33] animate-[boss-pulse_2s_ease-in-out_infinite]",
  sea: "bg-[#0a2a3a] border-[#164a66] shadow-[inset_0_0_4px_#00d0ff22] animate-pulse",
  gate: "bg-[#14060a] border-[#4a001a] shadow-[inset_0_0_6px_#ff003c33]",
  void: "bg-[#06080f] border-[#0c1018]",
};

const LABEL_COLORS: Record<string, string> = {
  entry: "text-[#00ff41]",
  locked: "text-[#ff003c]",
  gate: "text-[#ff6680]",
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

function buildViewport(
  map: GameMap,
  playerPos: Position,
): { tile: MapTile | null; mapX: number; mapY: number }[][] {
  const rows: { tile: MapTile | null; mapX: number; mapY: number }[][] = [];

  if (map.width <= VP_W && map.height <= VP_H) {
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

function gateLabel(kind: TileKind): string {
  if (kind === "locked") return "LOCKED";
  if (kind === "gate") return "SEALED";
  return "ENTER";
}

function TileCell({ tile }: { tile: MapTile | null }) {
  const kind = tile?.kind ?? "void";
  const tileClasses =
    TILE_CLASSES[kind as keyof typeof TILE_CLASSES] ?? TILE_CLASSES.void;
  const showLabel =
    tile?.label &&
    (tile.kind === "entry" ||
      tile.kind === "locked" ||
      tile.kind === "gate");
  const labelColor = tile ? (LABEL_COLORS[tile.kind] ?? "") : "";

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center border ${tileClasses}`}
    >
      {showLabel && (
        <span
          className={`gr-font-mono text-center text-[clamp(8px,1.5vw,12px)] leading-none opacity-70 ${labelColor}`}
        >
          {gateLabel(tile!.kind)}
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
      <div className="flex h-[70%] w-[70%] items-center justify-center rounded-sm bg-[#00f0ff] text-[clamp(8px,1.5vw,12px)] font-bold text-[#0a0e1a] shadow-[0_0_8px_#00f0ff,0_0_3px_#00f0ff]">
        {FACING_ARROW[facing]}
      </div>
    </div>
  );
}

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

export function OverworldScreen({
  map,
  playerPos,
  facing,
  zoneName,
}: OverworldScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState<{ w: number; h: number } | null>(
    null,
  );

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
      className="flex flex-1 flex-col overflow-hidden bg-[#06080f]"
    >
      <div className="gr-font-mono shrink-0 px-2 py-1 text-center text-xs tracking-[0.15em] text-[#00f0ff]/50">
        {zoneName ?? "CYBERSPACE"}
      </div>

      <div
        ref={containerRef}
        className="flex flex-1 min-h-0 items-center justify-center overflow-hidden"
      >
        {gridSize && (
          <div
            data-testid="gr-map"
            className="grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(12,1fr)]"
            style={{ width: gridSize.w, height: gridSize.h }}
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
