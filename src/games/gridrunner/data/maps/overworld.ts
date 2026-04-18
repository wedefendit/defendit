/*
Copyright © 2026 Defend I.T. Solutions LLC. All Rights Reserved.
*/

import type { GameMap, MapTile, TileKind } from "../../engine/types";
import SECTOR_01_MAP from "./sector01.map.json";

/**
 * Sector 01 -- The Outer Grid.
 *
 * The map data lives in `sector01.map.json` as an array of 40 strings, each
 * exactly 60 characters. That file is the single source of truth; update it
 * to change the map. The JSON mirrors the spec in
 * `docs/gridrunner/sectors/sector-01/overworld.md` -- keep them in sync when
 * the spec changes.
 *
 * Character encoding per the spec legend:
 *
 *   `#`  wall (boundary)
 *   `.`  void (non-walkable empty space between traces)
 *   `g`  grid path trunk (walkable, no encounter)
 *   `~`  Digital Sea tile (walkable, rolls encounter)
 *   `S`  player spawn
 *   `G`  Sector 02 gate (blocks movement, no label -- looks like a dead end)
 *   `A`  Arcade body tile (non-walkable)
 *   `a`  Arcade entry door (walkable, auto-enters arcade zone)
 *   `B`  Bank body tile
 *   `b`  Bank entry door
 *   `X`  Crypto Exchange body tile
 *   `x`  Crypto Exchange locked door (blocks until `defeatedBosses` includes "lazarus")
 *   `D`  decorative building body (non-walkable)
 *   `d`  decorative door -- visual only, non-walkable (`facade` TileKind)
 *
 * The grid is 60 wide x 40 tall, indexed [y][x] so tiles[0] is the top row.
 */

const WIDTH = 60;
const HEIGHT = 40;

/** Map an ASCII char to the base TileKind it represents. */
function kindFor(ch: string): TileKind {
  switch (ch) {
    case "#":
    case ".":
      // `.` is void (empty space between traces). Non-walkable, visually dark
      // like the boundary wall -- they share `wall` kind for rendering.
      return "wall";
    case "g":
      return "ground";
    case "~":
      return "sea";
    case "S":
      return "spawn";
    case "G":
      return "gate";
    case "A":
    case "B":
    case "X":
    case "D":
      return "building";
    case "a":
    case "b":
      return "entry";
    case "x":
      return "locked";
    case "d":
      return "facade";
    default:
      throw new Error(`Unknown map character: "${ch}"`);
  }
}

function isDecor(ch: string): boolean {
  return ch === "D" || ch === "d";
}

/**
 * Flood-fill to assign a shared `buildingId` to every contiguous run of
 * decorative tiles ({D, d}). Components are numbered in row-major discovery
 * order as `decor-01`, `decor-02`, ... (zero-padded for stable sorting).
 */
function assignDecorIds(grid: string[][]): string[][] {
  const ids: string[][] = Array.from({ length: HEIGHT }, () =>
    new Array<string>(WIDTH).fill(""),
  );
  let counter = 0;

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (!isDecor(grid[y][x]) || ids[y][x] !== "") continue;

      counter++;
      const id = `decor-${String(counter).padStart(2, "0")}`;
      const queue: [number, number][] = [[x, y]];
      ids[y][x] = id;
      while (queue.length > 0) {
        const [cx, cy] = queue.shift() as [number, number];
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || nx >= WIDTH || ny < 0 || ny >= HEIGHT) continue;
          if (!isDecor(grid[ny][nx]) || ids[ny][nx] !== "") continue;
          ids[ny][nx] = id;
          queue.push([nx, ny]);
        }
      }
    }
  }

  return ids;
}

/**
 * Convert a character plus its decor id into a fully-populated MapTile.
 * Gate tiles intentionally have no label per the Sector 02 gate contract
 * (looks like a dead-end trace until the M4 unlock ships).
 */
function buildTile(ch: string, decorId: string): MapTile {
  const kind = kindFor(ch);
  switch (ch) {
    case "A":
      return { kind, walkable: false, buildingId: "arcade" };
    case "a":
      return { kind, walkable: true, buildingId: "arcade", label: "Arcade" };
    case "B":
      return { kind, walkable: false, buildingId: "bank" };
    case "b":
      return { kind, walkable: true, buildingId: "bank", label: "Bank" };
    case "X":
      return { kind, walkable: false, buildingId: "exchange" };
    case "x":
      return {
        kind,
        walkable: false,
        buildingId: "exchange",
        label: "Crypto Exchange",
      };
    case "D":
    case "d":
      return { kind, walkable: false, buildingId: decorId };
    case "G":
      return { kind, walkable: false };
    case "#":
    case ".":
      // `.` is void (non-walkable, same kind as boundary wall).
      return { kind, walkable: false };
    case "g":
    case "~":
    case "S":
      return { kind, walkable: true };
    default:
      throw new Error(`Unknown map character: "${ch}"`);
  }
}

/** Parse the imported JSON rows into a MapTile[][]. */
function parseMap(rows: readonly string[]): MapTile[][] {
  if (rows.length !== HEIGHT) {
    throw new Error(
      `Sector 01 map has ${rows.length} rows, expected ${HEIGHT}`,
    );
  }
  const grid: string[][] = rows.map((r) => {
    if (r.length !== WIDTH) {
      throw new Error(
        `Sector 01 map row has ${r.length} cols, expected ${WIDTH}: "${r}"`,
      );
    }
    return Array.from(r);
  });

  const decorIds = assignDecorIds(grid);
  const tiles: MapTile[][] = [];
  for (let y = 0; y < HEIGHT; y++) {
    const row: MapTile[] = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push(buildTile(grid[y][x], decorIds[y][x]));
    }
    tiles.push(row);
  }
  return tiles;
}

export const overworldMap: GameMap = {
  id: "overworld",
  width: WIDTH,
  height: HEIGHT,
  tiles: parseMap(SECTOR_01_MAP as readonly string[]),
  spawn: { x: 14, y: 10 },
};
