import * as Phaser from "phaser";
import {
  NPC_PALETTES,
  SELMA_PALETTE,
  STUDENT_PALETTES,
  createCharacterAnims,
  createCharacterTexture,
  createEmojiTexture,
} from "@/game/pixel/characterFactory";
import { createDecorTextures } from "@/game/pixel/decorFactory";
import { createTilesetTexture } from "@/game/pixel/tileFactory";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  create(): void {
    this.add
      .text(640, 320, "Preparing Selma's notebook...", {
        fontFamily: "Georgia, serif",
        fontSize: "28px",
        color: "#f8f4ea",
      })
      .setOrigin(0.5);

    createTilesetTexture(this);
    createCharacterTexture(this, "char-selma", SELMA_PALETTE);
    createCharacterAnims(this, "char-selma");
    for (const [npcId, palette] of Object.entries(NPC_PALETTES)) {
      createCharacterTexture(this, `char-${npcId}`, palette);
      createCharacterAnims(this, `char-${npcId}`);
    }
    STUDENT_PALETTES.forEach((palette, index) => {
      createCharacterTexture(this, `char-student-${index}`, palette);
    });
    createEmojiTexture(this, "fx-sparkle", "✦", 16);
    createDecorTextures(this);

    this.time.delayedCall(120, () => {
      this.scene.start("world");
      this.scene.launch("hud");
    });
  }
}
