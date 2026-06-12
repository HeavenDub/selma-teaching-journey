import * as Phaser from "phaser";
import { CHAR_FRAMES } from "@/game/pixel/characterFactory";
import type { Facing } from "@/game/world/types";

/**
 * A townsperson standing in the world. Static body (so the player can't push
 * the school director into the fountain) plus an optional quest marker.
 */
export class NpcSprite extends Phaser.Physics.Arcade.Sprite {
  readonly npcId: string;
  private marker: Phaser.GameObjects.Text | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, npcId: string, facing: Facing = "down") {
    super(scene, x, y, `char-${npcId}`, CHAR_FRAMES.downIdle);
    this.npcId = npcId;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setScale(2);
    this.setDepth(9);
    this.face(facing);
    const body = this.body as Phaser.Physics.Arcade.StaticBody;
    body.setSize(26, 22);
    body.setOffset(this.displayWidth / 2 - 13 + this.displayOriginX * 0, 26);
    body.updateFromGameObject();
    // Gentle idle bob so the world feels alive.
    scene.tweens.add({
      targets: this,
      y: y - 2,
      duration: 1400 + Math.floor(Math.random() * 600),
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  face(direction: Facing): void {
    if (direction === "up") {
      this.setFrame(CHAR_FRAMES.upIdle);
    } else if (direction === "down") {
      this.setFrame(CHAR_FRAMES.downIdle);
    } else {
      this.setFrame(CHAR_FRAMES.sideIdle);
      this.setFlipX(direction === "left");
    }
  }

  /** "!" above quest givers with something to offer; "…" while in progress. */
  setQuestMarker(kind: "available" | "active" | null): void {
    if (this.marker) {
      this.marker.destroy();
      this.marker = null;
    }
    if (!kind) return;
    this.marker = this.scene.add
      .text(this.x, this.y - 36, kind === "available" ? "!" : "…", {
        fontFamily: "Georgia, serif",
        fontSize: "22px",
        color: kind === "available" ? "#e9c46a" : "#7fc8bd",
        stroke: "#3a2f24",
        strokeThickness: 4,
      })
      .setOrigin(0.5, 1)
      .setDepth(20);
    this.scene.tweens.add({
      targets: this.marker,
      y: this.y - 42,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  destroy(fromScene?: boolean): void {
    this.marker?.destroy();
    super.destroy(fromScene);
  }
}
