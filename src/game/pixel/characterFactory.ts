import type Phaser from "phaser";

/**
 * Procedural pixel-art characters. Every sprite in the game is generated at
 * runtime from these typed pixel grids — the project ships zero binary art.
 * Phaser is imported as a type only so the grids are testable in Node.
 *
 * Grid legend: '.'=transparent H=hair/scarf h=hair shadow S=skin E=eye
 * T=top t=top shadow B=bottom F=shoes A=accessory(bag/books) W=white
 */

export interface CharacterPalette {
  skin: string;
  hair: string;
  hairShadow: string;
  top: string;
  topShadow: string;
  bottom: string;
  shoes: string;
  accessory: string;
  /** Headscarf instead of visible hair. */
  scarf?: boolean;
}

export const FRAME_W = 16;
export const FRAME_H = 24;

/** Selma: ginger hair, cream top, soft-green skirt, warm brown tote. */
export const SELMA_PALETTE: CharacterPalette = {
  skin: "#e8b88a",
  hair: "#c45e26",
  hairShadow: "#9a4419",
  top: "#f3e6c8",
  topShadow: "#ddc9a0",
  bottom: "#7a9d6a",
  shoes: "#6b4c26",
  accessory: "#8a5a33",
};

export const NPC_PALETTES: Record<string, CharacterPalette> = {
  "mr-alaoui": {
    skin: "#c98e5e", hair: "#4a4038", hairShadow: "#332c26",
    top: "#2a9d8f", topShadow: "#1d6e64", bottom: "#3d3a45",
    shoes: "#262430", accessory: "#caa468",
  },
  "dr-benhadouch": {
    skin: "#c89868", hair: "#e8e3da", hairShadow: "#b8b2a6",
    top: "#7d5a74", topShadow: "#5e4358", bottom: "#4a4550",
    shoes: "#2c2733", accessory: "#e3d3b5",
  },
  saadia: {
    skin: "#b97a4e", hair: "#e7a93c", hairShadow: "#c1882a",
    top: "#457b9d", topShadow: "#35617c", bottom: "#5c4d6e",
    shoes: "#3e3450", accessory: "#f0d488", scarf: true,
  },
  "mrs-fassi": {
    skin: "#d8a878", hair: "#6e4a32", hairShadow: "#553823",
    top: "#bc6c25", topShadow: "#96541b", bottom: "#4a4038",
    shoes: "#332c26", accessory: "#e3d3b5",
  },
  amine: {
    skin: "#caa06e", hair: "#2f2a26", hairShadow: "#1f1c19",
    top: "#588157", topShadow: "#446343", bottom: "#39506e",
    shoes: "#2a3b52", accessory: "#e9c46a",
  },
  khadija: {
    skin: "#e0ae80", hair: "#4f3026", hairShadow: "#3a221b",
    top: "#e76f51", topShadow: "#c1532f", bottom: "#5a4a52",
    shoes: "#3f343a", accessory: "#7fc8bd",
  },
  "si-brahim": {
    skin: "#c08a60", hair: "#cfcac2", hairShadow: "#a8a29a",
    top: "#8a8f98", topShadow: "#6e727a", bottom: "#5a564e",
    shoes: "#3e3b36", accessory: "#caa468",
  },
  "mr-tahiri": {
    skin: "#caa06e", hair: "#3f352c", hairShadow: "#2d2620",
    top: "#bc8a2f", topShadow: "#946d22", bottom: "#43403a",
    shoes: "#2e2c28", accessory: "#7a9d6a",
  },
  souad: {
    skin: "#d8a878", hair: "#7d6bb5", hairShadow: "#62538f",
    top: "#7d6bb5", topShadow: "#62538f", bottom: "#4f4566",
    shoes: "#39314a", accessory: "#f0d488", scarf: true,
  },
  "inspector-tazi": {
    skin: "#c98e5e", hair: "#55504a", hairShadow: "#3e3a35",
    top: "#3a3340", topShadow: "#2a2430", bottom: "#3a3340",
    shoes: "#211d28", accessory: "#d62847",
  },
};

/** Generic student palette used for classroom ambience sprites. */
export const STUDENT_PALETTES: CharacterPalette[] = [
  { skin: "#caa06e", hair: "#2f2a26", hairShadow: "#1f1c19", top: "#aab9d4", topShadow: "#8a99b4", bottom: "#39506e", shoes: "#2a3b52", accessory: "#e9c46a" },
  { skin: "#e0ae80", hair: "#4f3026", hairShadow: "#3a221b", top: "#aab9d4", topShadow: "#8a99b4", bottom: "#5a4a52", shoes: "#3f343a", accessory: "#7fc8bd" },
  { skin: "#b97a4e", hair: "#2f2a26", hairShadow: "#1f1c19", top: "#aab9d4", topShadow: "#8a99b4", bottom: "#4a4038", shoes: "#332c26", accessory: "#f4a261" },
];

// ─── Pixel grids ────────────────────────────────────────────────────────────

const BODY_DOWN = [
  "................",
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HHHHHHHHhh...",
  "...HSSSSSSSSh...",
  "...HSESSSSESh...",
  "...HSSSSSSSSh...",
  "...hSSSSSSSSh...",
  "....SSSSSSSS....",
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "..TTTATTTTATTT..",
  "..STTATTTTATTS..",
  "..STTTTTTTTTTS..",
  "...TTTTTTTTtt...",
  "...BBBBBBBBBB...",
  "...BBBBBBBBBB...",
];

const BODY_DOWN_SCARF = [
  "................",
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HHhSSSShHH...",
  "...HHSSSSSSHH...",
  "...HHSESSESHH...",
  "...HHSSSSSSHH...",
  "...hHHSSSSHHh...",
  "....HHHHHHHH....",
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "..TTTATTTTATTT..",
  "..STTATTTTATTS..",
  "..STTTTTTTTTTS..",
  "...TTTTTTTTtt...",
  "...BBBBBBBBBB...",
  "...BBBBBBBBBB...",
];

const BODY_UP = [
  "................",
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHh...",
  "...HHHHHHHHHh...",
  "...HHHHHHHHHh...",
  "...hHHHHHHHHh...",
  "....SSHHHHSS....",
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "..TTAAAAAAAATT..",
  "..STAAAAAAAATS..",
  "..STAAAAAAAATS..",
  "...TTTTTTTTtt...",
  "...BBBBBBBBBB...",
  "...BBBBBBBBBB...",
];

const BODY_UP_SCARF = BODY_UP;

const BODY_SIDE = [
  "................",
  "......HHHHH.....",
  ".....HHHHHHH....",
  "....HHHHHHHH....",
  "....HHHHHHHH....",
  "....HhSSSSS.....",
  "....HhSSESS.....",
  "....HhSSSSS.....",
  "....hhSSSS......",
  ".....SSSSS......",
  ".....TTTTT......",
  "....TTTTTTT.....",
  "....ATTTTTT.....",
  "....ATTTTTS.....",
  "....ATTTTTS.....",
  "....TTTTTtt.....",
  "....BBBBBBB.....",
  "....BBBBBBB.....",
];

const BODY_SIDE_SCARF = [
  "................",
  "......HHHHH.....",
  ".....HHHHHHH....",
  "....HHHHHHHH....",
  "....HHHhSSH.....",
  "....HHhSSSH.....",
  "....HHhSESH.....",
  "....HHhSSSH.....",
  "....hHHSSH......",
  ".....HHHHH......",
  ".....TTTTT......",
  "....TTTTTTT.....",
  "....ATTTTTT.....",
  "....ATTTTTS.....",
  "....ATTTTTS.....",
  "....TTTTTtt.....",
  "....BBBBBBB.....",
  "....BBBBBBB.....",
];

const LEGS_FRONT_STAND = [
  "....BBB..BBB....",
  "....BBB..BBB....",
  "....SSS..SSS....",
  "....SSS..SSS....",
  "....FFF..FFF....",
  "................",
];

const LEGS_FRONT_STEP_A = [
  "....BBB..BBB....",
  "....BBB..BBB....",
  "....SSS..SSS....",
  "....FFF..SSS....",
  ".........FFF....",
  "................",
];

const LEGS_FRONT_STEP_B = [
  "....BBB..BBB....",
  "....BBB..BBB....",
  "....SSS..SSS....",
  "....SSS..FFF....",
  "....FFF.........",
  "................",
];

const LEGS_SIDE_STAND = [
  ".....BBBBB......",
  ".....BBBBB......",
  ".....SS.SS......",
  ".....SS.SS......",
  ".....FF.FF......",
  "................",
];

const LEGS_SIDE_STEP_A = [
  ".....BBBBB......",
  ".....BBBBB......",
  "....SS..SS......",
  "....FF..SS......",
  "........FF......",
  "................",
];

const LEGS_SIDE_STEP_B = [
  ".....BBBBB......",
  ".....BBBBB......",
  ".....SS..SS.....",
  ".....SS..FF.....",
  ".....FF.........",
  "................",
];

// ─── Generation ─────────────────────────────────────────────────────────────

function colorFor(ch: string, p: CharacterPalette): string | null {
  switch (ch) {
    case "H": return p.hair;
    case "h": return p.hairShadow;
    case "S": return p.skin;
    case "E": return "#2c2030";
    case "T": return p.top;
    case "t": return p.topShadow;
    case "B": return p.bottom;
    case "F": return p.shoes;
    case "A": return p.accessory;
    case "W": return "#f8f4ea";
    default: return null;
  }
}

const OUTLINE_COLOR = "#3a2a20";

function drawGrid(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  palette: CharacterPalette,
  offsetX: number,
  offsetY: number,
): void {
  const filled = (x: number, y: number): boolean => {
    const ch = rows[y]?.[x];
    return ch !== undefined && ch !== "." && colorFor(ch, palette) !== null;
  };
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = colorFor(row[x]!, palette);
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(offsetX + x, offsetY + y, 1, 1);
      } else if (
        // Classic pixel-art outline: empty cells touching the silhouette.
        filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)
      ) {
        ctx.fillStyle = OUTLINE_COLOR;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(offsetX + x, offsetY + y, 1, 1);
        ctx.globalAlpha = 1;
      }
    }
  });
}

/**
 * Frame order in every character spritesheet:
 * 0-2 down (idle, stepA, stepB) · 3-5 up · 6-8 side (faces right; flipX for left)
 */
export const CHAR_FRAMES = {
  downIdle: 0, downA: 1, downB: 2,
  upIdle: 3, upA: 4, upB: 5,
  sideIdle: 6, sideA: 7, sideB: 8,
} as const;

export function createCharacterTexture(
  scene: Phaser.Scene,
  key: string,
  palette: CharacterPalette,
): void {
  if (scene.textures.exists(key)) return;
  const frames: string[][] = [];
  const bodyDown = palette.scarf ? BODY_DOWN_SCARF : BODY_DOWN;
  const bodyUp = palette.scarf ? BODY_UP_SCARF : BODY_UP;
  const bodySide = palette.scarf ? BODY_SIDE_SCARF : BODY_SIDE;
  for (const legs of [LEGS_FRONT_STAND, LEGS_FRONT_STEP_A, LEGS_FRONT_STEP_B]) {
    frames.push([...bodyDown, ...legs]);
  }
  for (const legs of [LEGS_FRONT_STAND, LEGS_FRONT_STEP_A, LEGS_FRONT_STEP_B]) {
    frames.push([...bodyUp, ...legs]);
  }
  for (const legs of [LEGS_SIDE_STAND, LEGS_SIDE_STEP_A, LEGS_SIDE_STEP_B]) {
    frames.push([...bodySide, ...legs]);
  }

  const canvas = document.createElement("canvas");
  canvas.width = FRAME_W * frames.length;
  canvas.height = FRAME_H;
  const ctx = canvas.getContext("2d")!;
  frames.forEach((rows, i) => drawGrid(ctx, rows, palette, i * FRAME_W, 0));

  const texture = scene.textures.addCanvas(key, canvas);
  if (!texture) return;
  frames.forEach((_, i) => {
    texture.add(i, 0, i * FRAME_W, 0, FRAME_W, FRAME_H);
  });
}

/** Walk/idle animation set for a character texture key. */
export function createCharacterAnims(scene: Phaser.Scene, key: string): void {
  const mk = (suffix: string, frames: number[], rate: number, repeat: number) => {
    const animKey = `${key}-${suffix}`;
    if (scene.anims.exists(animKey)) return;
    scene.anims.create({
      key: animKey,
      frames: frames.map((f) => ({ key, frame: f })),
      frameRate: rate,
      repeat,
    });
  };
  mk("idle-down", [CHAR_FRAMES.downIdle], 1, -1);
  mk("idle-up", [CHAR_FRAMES.upIdle], 1, -1);
  mk("idle-side", [CHAR_FRAMES.sideIdle], 1, -1);
  mk("walk-down", [CHAR_FRAMES.downA, CHAR_FRAMES.downIdle, CHAR_FRAMES.downB, CHAR_FRAMES.downIdle], 8, -1);
  mk("walk-up", [CHAR_FRAMES.upA, CHAR_FRAMES.upIdle, CHAR_FRAMES.upB, CHAR_FRAMES.upIdle], 8, -1);
  mk("walk-side", [CHAR_FRAMES.sideA, CHAR_FRAMES.sideIdle, CHAR_FRAMES.sideB, CHAR_FRAMES.sideIdle], 8, -1);
}

/** Render an emoji into a texture (dialogue portraits, map emblems). */
export function createEmojiTexture(
  scene: Phaser.Scene,
  key: string,
  emoji: string,
  size = 64,
): void {
  if (scene.textures.exists(key)) return;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${Math.floor(size * 0.8)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2 + size * 0.04);
  scene.textures.addCanvas(key, canvas);
}
