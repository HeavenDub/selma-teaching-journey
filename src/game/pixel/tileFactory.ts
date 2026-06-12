import type Phaser from "phaser";

/**
 * Procedural 32px tileset. Each map cell is one ASCII character; this module
 * draws the artwork for every character and reports which ones collide.
 * Phaser is imported as a type only, so this module is safe to load in Node
 * (the world integrity tests exercise it without a browser).
 */

export const TILE_SIZE = 32;

type DrawFn = (ctx: CanvasRenderingContext2D, x: number, y: number) => void;

/** Deterministic per-tile noise so the world looks hand-textured but stable. */
function hash(x: number, y: number, salt: number): number {
  let h = (x * 374761393 + y * 668265263 + salt * 2147483647) | 0;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function base(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
}

function speckle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  count: number,
  salt: number,
) {
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const px = Math.floor(hash(x + i, y, salt) * (TILE_SIZE - 4)) + 2;
    const py = Math.floor(hash(x, y + i, salt + 7) * (TILE_SIZE - 4)) + 2;
    ctx.fillRect(x + px, y + py, 2, 2);
  }
}

const grass: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#7fae6a");
  // Soft two-tone mottling plus little grass tufts.
  ctx.fillStyle = "#76a661";
  for (let i = 0; i < 4; i++) {
    const px = Math.floor(hash(x + i, y, 21) * 24);
    const py = Math.floor(hash(x, y + i, 22) * 24);
    ctx.fillRect(x + px, y + py, 8, 8);
  }
  speckle(ctx, x, y, "#6d9c59", 6, 1);
  speckle(ctx, x, y, "#93c47c", 5, 2);
  ctx.fillStyle = "#5d8c4c";
  for (let i = 0; i < 3; i++) {
    const px = 3 + Math.floor(hash(x + i, y, 23) * 25);
    const py = 4 + Math.floor(hash(x, y + i, 24) * 23);
    ctx.fillRect(x + px, y + py, 1, 3);
    ctx.fillRect(x + px + 2, y + py + 1, 1, 2);
  }
};

const flowers: DrawFn = (ctx, x, y) => {
  grass(ctx, x, y);
  speckle(ctx, x, y, "#e76f51", 3, 3);
  speckle(ctx, x, y, "#f0d488", 3, 4);
  speckle(ctx, x, y, "#f3e6c8", 2, 5);
};

const path: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#d9c08f");
  // Worn flagstones with cracks.
  ctx.fillStyle = "#cdb27e";
  ctx.fillRect(x + 1, y + 1, 14, 14);
  ctx.fillRect(x + 17, y + 1, 14, 14);
  ctx.fillRect(x + 1, y + 17, 14, 14);
  ctx.fillRect(x + 17, y + 17, 14, 14);
  speckle(ctx, x, y, "#bfa26c", 6, 6);
  speckle(ctx, x, y, "#e7d2a6", 5, 7);
  ctx.fillStyle = "#b3955f";
  const cx = Math.floor(hash(x, y, 25) * 20) + 6;
  ctx.fillRect(x + cx, y + 4, 1, 6);
  ctx.fillRect(x + cx - 1, y + 9, 1, 4);
};

const plaza: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#d8e8e4");
  // Zellige: alternating teal diamonds with a gold star heart.
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const cx = x + 8 + i * 16;
      const cy = y + 8 + j * 16;
      ctx.fillStyle = (i + j) % 2 === 0 ? "#7fc8bd" : "#5bb3a6";
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);
      ctx.lineTo(cx + 7, cy);
      ctx.lineTo(cx, cy + 7);
      ctx.lineTo(cx - 7, cy);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = (i + j) % 2 === 0 ? "#2a9d8f" : "#1d6e64";
      ctx.fillRect(cx - 2, cy - 2, 4, 4);
    }
  }
  ctx.fillStyle = "#e9c46a";
  ctx.fillRect(x + 15, y + 15, 2, 2);
  ctx.strokeStyle = "#b9d2cc";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
};

const water: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#3f7fb4");
  // Depth gradient bands + crests + sun glints.
  ctx.fillStyle = "#4f8fc4";
  ctx.fillRect(x, y, TILE_SIZE, 20);
  ctx.fillStyle = "#5d9bce";
  ctx.fillRect(x, y, TILE_SIZE, 10);
  ctx.fillStyle = "#7ab3dc";
  for (let i = 0; i < 3; i++) {
    const wy = 4 + i * 10 + Math.floor(hash(x, y, 8 + i) * 4);
    const wx = Math.floor(hash(x, y, 12 + i) * 10);
    ctx.fillRect(x + 2 + wx, y + wy, 13, 2);
    ctx.fillRect(x + 4 + wx, y + wy - 1, 7, 1);
  }
  ctx.fillStyle = "#cfe6f4";
  ctx.fillRect(x + Math.floor(hash(x, y, 31) * 26) + 2, y + Math.floor(hash(x, y, 32) * 26) + 2, 3, 1);
};

const sand: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#ecd9a8");
  speckle(ctx, x, y, "#dcc488", 8, 9);
};

const wall: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#d8a26a");
  // Sun-lit top, shaded base, mortar lines and brick joints.
  ctx.fillStyle = "#e4b27c";
  ctx.fillRect(x, y, TILE_SIZE, 4);
  ctx.fillStyle = "#c08a52";
  for (let j = 0; j < 4; j++) {
    ctx.fillRect(x, y + j * 8 + 6, TILE_SIZE, 2);
    const off = j % 2 === 0 ? 8 : 18;
    ctx.fillRect(x + off, y + j * 8, 2, 8);
  }
  ctx.fillStyle = "#a8743f";
  ctx.fillRect(x, y + 28, TILE_SIZE, 4);
  speckle(ctx, x, y, "#cf9a5e", 4, 33);
};

const wallWindow: DrawFn = (ctx, x, y) => {
  wall(ctx, x, y);
  // Arched window with teal shutters and a warm lit pane.
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(x + 9, y + 7, 14, 18);
  ctx.fillStyle = "#2a9d8f";
  ctx.fillRect(x + 9, y + 9, 3, 16);
  ctx.fillRect(x + 20, y + 9, 3, 16);
  ctx.fillStyle = "#f6d98a";
  ctx.fillRect(x + 13, y + 10, 6, 13);
  ctx.fillStyle = "#e3b35c";
  ctx.fillRect(x + 13, y + 17, 6, 1);
  ctx.fillRect(x + 15, y + 10, 1, 13);
  ctx.fillStyle = "#f0d488";
  ctx.fillRect(x + 11, y + 6, 10, 2);
};

const roof: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#b35438");
  ctx.fillStyle = "#9a4029";
  for (let j = 0; j < 4; j++) ctx.fillRect(x, y + j * 8, TILE_SIZE, 3);
  ctx.fillStyle = "#c66a4a";
  for (let j = 0; j < 4; j++) ctx.fillRect(x, y + j * 8 + 4, TILE_SIZE, 1);
};

const door: DrawFn = (ctx, x, y) => {
  wall(ctx, x, y);
  ctx.fillStyle = "#6b4c26";
  ctx.fillRect(x + 7, y + 4, 18, 28);
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(x + 9, y + 6, 14, 24);
  // Horseshoe arch
  ctx.fillStyle = "#f0d488";
  ctx.fillRect(x + 7, y + 2, 18, 3);
  ctx.fillStyle = "#e9c46a";
  ctx.fillRect(x + 20, y + 17, 2, 4);
};

const tree: DrawFn = (ctx, x, y) => {
  grass(ctx, x, y);
  // Ground shadow, trunk with bark, layered three-tone canopy.
  ctx.fillStyle = "rgba(58, 47, 36, 0.25)";
  ctx.fillRect(x + 7, y + 26, 18, 4);
  ctx.fillStyle = "#6b4c26";
  ctx.fillRect(x + 13, y + 17, 6, 12);
  ctx.fillStyle = "#7d5a33";
  ctx.fillRect(x + 14, y + 17, 2, 12);
  ctx.fillStyle = "#3e6334";
  ctx.fillRect(x + 4, y + 4, 24, 16);
  ctx.fillRect(x + 8, y + 1, 16, 4);
  ctx.fillStyle = "#54874a";
  ctx.fillRect(x + 6, y + 3, 18, 13);
  ctx.fillRect(x + 10, y + 1, 12, 3);
  ctx.fillStyle = "#6fa75c";
  ctx.fillRect(x + 8, y + 3, 11, 8);
  ctx.fillStyle = "#8fc478";
  ctx.fillRect(x + 9, y + 4, 5, 3);
  speckle(ctx, x, y, "#2f5128", 4, 10);
};

const palm: DrawFn = (ctx, x, y) => {
  sand(ctx, x, y);
  ctx.fillStyle = "#8a6a3a";
  ctx.fillRect(x + 14, y + 10, 4, 20);
  ctx.fillStyle = "#5e9450";
  ctx.fillRect(x + 4, y + 6, 10, 4);
  ctx.fillRect(x + 18, y + 6, 10, 4);
  ctx.fillRect(x + 8, y + 2, 16, 4);
  ctx.fillRect(x + 12, y + 9, 8, 3);
};

const fence: DrawFn = (ctx, x, y) => {
  grass(ctx, x, y);
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(x, y + 12, TILE_SIZE, 4);
  ctx.fillRect(x + 4, y + 6, 4, 18);
  ctx.fillRect(x + 24, y + 6, 4, 18);
};

const stall: DrawFn = (ctx, x, y) => {
  path(ctx, x, y);
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(x + 3, y + 12, 26, 14);
  ctx.fillStyle = "#e76f51";
  ctx.fillRect(x + 1, y + 4, 30, 6);
  ctx.fillStyle = "#f3e6c8";
  for (let i = 0; i < 4; i++) ctx.fillRect(x + 1 + i * 8, y + 4, 4, 6);
  speckle(ctx, x, y + 8, "#e9c46a", 4, 11);
};

const fountain: DrawFn = (ctx, x, y) => {
  plaza(ctx, x, y);
  ctx.fillStyle = "#2a9d8f";
  ctx.fillRect(x + 4, y + 4, 24, 24);
  ctx.fillStyle = "#6aa7d6";
  ctx.fillRect(x + 7, y + 7, 18, 18);
  ctx.fillStyle = "#bfe3dd";
  ctx.fillRect(x + 13, y + 10, 6, 6);
};

const field: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#a8915c");
  ctx.fillStyle = "#8f7a48";
  for (let j = 0; j < 4; j++) ctx.fillRect(x, y + j * 8 + 2, TILE_SIZE, 3);
  speckle(ctx, x, y, "#cdb56f", 6, 12);
};

const kiln: DrawFn = (ctx, x, y) => {
  path(ctx, x, y);
  ctx.fillStyle = "#b35438";
  ctx.fillRect(x + 6, y + 8, 20, 20);
  ctx.fillStyle = "#9a4029";
  ctx.fillRect(x + 10, y + 16, 12, 12);
  ctx.fillStyle = "#2c2030";
  ctx.fillRect(x + 13, y + 20, 6, 8);
  ctx.fillStyle = "#e9c46a";
  ctx.fillRect(x + 12, y + 4, 8, 4);
};

const mural: DrawFn = (ctx, x, y) => {
  wall(ctx, x, y);
  ctx.fillStyle = "#7fc8bd";
  ctx.fillRect(x + 4, y + 6, 24, 20);
  ctx.fillStyle = "#e76f51";
  ctx.fillRect(x + 8, y + 10, 7, 12);
  ctx.fillStyle = "#f0d488";
  ctx.fillRect(x + 17, y + 9, 8, 8);
  ctx.fillStyle = "#4d5fa8";
  ctx.fillRect(x + 15, y + 19, 10, 5);
};

const floor: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#caa468");
  ctx.fillStyle = "#b8925a";
  for (let j = 0; j < 2; j++) ctx.fillRect(x, y + j * 16 + 14, TILE_SIZE, 2);
  ctx.fillRect(x + (Math.floor(hash(x, y, 13) * 2) === 0 ? 8 : 20), y, 2, 16);
};

const carpet: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#b34a3e");
  ctx.fillStyle = "#9a3a30";
  ctx.fillRect(x + 2, y + 2, 28, 28);
  ctx.fillStyle = "#e9c46a";
  ctx.fillRect(x + 6, y + 6, 20, 20);
  ctx.fillStyle = "#b34a3e";
  ctx.fillRect(x + 10, y + 10, 12, 12);
  ctx.fillStyle = "#2a9d8f";
  ctx.fillRect(x + 14, y + 14, 4, 4);
};

const desk: DrawFn = (ctx, x, y) => {
  floor(ctx, x, y);
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(x + 2, y + 8, 28, 16);
  ctx.fillStyle = "#a06c40";
  ctx.fillRect(x + 4, y + 10, 24, 10);
  ctx.fillStyle = "#f8f4ea";
  ctx.fillRect(x + 8, y + 12, 8, 6);
  ctx.fillStyle = "#4d5fa8";
  ctx.fillRect(x + 20, y + 13, 5, 4);
};

const board: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#e3d3b5");
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(x + 1, y + 4, 30, 22);
  ctx.fillStyle = "#2e5a4e";
  ctx.fillRect(x + 3, y + 6, 26, 18);
  ctx.fillStyle = "#f8f4ea";
  ctx.fillRect(x + 6, y + 10, 12, 2);
  ctx.fillRect(x + 6, y + 15, 18, 2);
};

const interiorWall: DrawFn = (ctx, x, y) => {
  base(ctx, x, y, "#e3d3b5");
  ctx.fillStyle = "#d4c0a0";
  ctx.fillRect(x, y + 24, TILE_SIZE, 8);
  speckle(ctx, x, y, "#d8c6a8", 4, 14);
};

const bookshelf: DrawFn = (ctx, x, y) => {
  interiorWall(ctx, x, y);
  ctx.fillStyle = "#6b4c26";
  ctx.fillRect(x + 2, y + 2, 28, 28);
  for (let j = 0; j < 3; j++) {
    ctx.fillStyle = "#8a5a33";
    ctx.fillRect(x + 4, y + 4 + j * 9, 24, 7);
    const colors = ["#e76f51", "#2a9d8f", "#e9c46a", "#4d5fa8", "#9d4f88"];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = colors[Math.floor(hash(x + i, y + j, 15) * colors.length)]!;
      ctx.fillRect(x + 5 + i * 5, y + 5 + j * 9, 4, 5);
    }
  }
};

const lampPost: DrawFn = (ctx, x, y) => {
  grass(ctx, x, y);
  ctx.fillStyle = "rgba(58, 47, 36, 0.22)";
  ctx.fillRect(x + 10, y + 28, 12, 3);
  // Wrought-iron post with a warm Moroccan lantern.
  ctx.fillStyle = "#3e3a35";
  ctx.fillRect(x + 14, y + 8, 4, 22);
  ctx.fillRect(x + 11, y + 28, 10, 2);
  ctx.fillStyle = "#55504a";
  ctx.fillRect(x + 15, y + 8, 1, 22);
  ctx.fillStyle = "#2c2030";
  ctx.fillRect(x + 11, y + 2, 10, 8);
  ctx.fillStyle = "#f6d98a";
  ctx.fillRect(x + 13, y + 3, 6, 6);
  ctx.fillStyle = "#fff3cf";
  ctx.fillRect(x + 14, y + 4, 3, 3);
  ctx.fillStyle = "#2c2030";
  ctx.fillRect(x + 14, y + 0, 4, 2);
};

const bench: DrawFn = (ctx, x, y) => {
  grass(ctx, x, y);
  ctx.fillStyle = "rgba(58, 47, 36, 0.22)";
  ctx.fillRect(x + 3, y + 24, 26, 4);
  // Slatted wooden bench.
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(x + 2, y + 10, 28, 4);
  ctx.fillRect(x + 2, y + 16, 28, 5);
  ctx.fillStyle = "#a06c40";
  ctx.fillRect(x + 2, y + 10, 28, 1);
  ctx.fillRect(x + 2, y + 16, 28, 1);
  ctx.fillStyle = "#5c3d20";
  ctx.fillRect(x + 4, y + 21, 3, 6);
  ctx.fillRect(x + 25, y + 21, 3, 6);
};

const busStop: DrawFn = (ctx, x, y) => {
  path(ctx, x, y);
  ctx.fillStyle = "#55504a";
  ctx.fillRect(x + 14, y + 8, 4, 22);
  ctx.fillStyle = "#2a9d8f";
  ctx.fillRect(x + 6, y + 2, 20, 10);
  ctx.fillStyle = "#f8f4ea";
  ctx.fillRect(x + 9, y + 5, 14, 4);
};

const rug: DrawFn = (ctx, x, y) => {
  floor(ctx, x, y);
  ctx.fillStyle = "#7a9d6a";
  ctx.fillRect(x + 3, y + 3, 26, 26);
  ctx.fillStyle = "#5d7d4f";
  ctx.fillRect(x + 7, y + 7, 18, 18);
};

interface TileDef {
  char: string;
  solid: boolean;
  draw: DrawFn;
}

export const TILE_DEFS: TileDef[] = [
  { char: ".", solid: false, draw: grass },
  { char: ",", solid: false, draw: flowers },
  { char: "#", solid: false, draw: path },
  { char: "P", solid: false, draw: plaza },
  { char: "~", solid: true, draw: water },
  { char: "s", solid: false, draw: sand },
  { char: "W", solid: true, draw: wall },
  { char: "w", solid: true, draw: wallWindow },
  { char: "R", solid: true, draw: roof },
  { char: "D", solid: false, draw: door },
  { char: "T", solid: true, draw: tree },
  { char: "p", solid: true, draw: palm },
  { char: "x", solid: true, draw: fence },
  { char: "m", solid: true, draw: stall },
  { char: "F", solid: true, draw: fountain },
  { char: "g", solid: false, draw: field },
  { char: "o", solid: true, draw: kiln },
  { char: "M", solid: true, draw: mural },
  { char: "f", solid: false, draw: floor },
  { char: "c", solid: false, draw: carpet },
  { char: "d", solid: true, draw: desk },
  { char: "b", solid: true, draw: board },
  { char: "I", solid: true, draw: interiorWall },
  { char: "k", solid: true, draw: bookshelf },
  { char: "B", solid: false, draw: busStop },
  { char: "r", solid: false, draw: rug },
  { char: "l", solid: true, draw: lampPost },
  { char: "n", solid: true, draw: bench },
];

export const CHAR_TO_INDEX: Record<string, number> = Object.fromEntries(
  TILE_DEFS.map((t, i) => [t.char, i]),
);

export const SOLID_INDEXES: number[] = TILE_DEFS.flatMap((t, i) =>
  t.solid ? [i] : [],
);

export const VALID_TILE_CHARS = new Set(TILE_DEFS.map((t) => t.char));

export const TILESET_KEY = "world-tiles";

/** Build the whole tileset as one canvas texture (one row of tiles). */
export function createTilesetTexture(scene: Phaser.Scene): void {
  if (scene.textures.exists(TILESET_KEY)) return;
  const canvas = document.createElement("canvas");
  canvas.width = TILE_SIZE * TILE_DEFS.length;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext("2d")!;
  TILE_DEFS.forEach((tile, i) => tile.draw(ctx, i * TILE_SIZE, 0));
  scene.textures.addCanvas(TILESET_KEY, canvas);
}
