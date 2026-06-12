import * as Phaser from "phaser";
import { useGameStore } from "@/stores/gameStore";
import { touchInput } from "@/game/touchInput";
import type { Facing } from "@/game/world/types";

const BASE_SPEED = 120;

/**
 * Selma. Arrow keys / WASD to move. Movement speed breathes with her
 * energy stat — exhausted trainees walk like exhausted trainees.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private keys: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
  };
  facing: Facing = "down";
  private canMove = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "char-selma", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(2);
    this.setDepth(10);
    this.setCollideWorldBounds(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    // Collide with feet, not the whole sprite, so Selma can stand "behind" things.
    body.setSize(12, 10);
    body.setOffset(2, 14);

    const kb = scene.input.keyboard!;
    this.keys = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      w: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  private currentSpeed(): number {
    const energy = useGameStore.getState().snapshot?.player.stats.energy ?? 70;
    return BASE_SPEED + energy * 0.6;
  }

  update(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!this.canMove) {
      body.setVelocity(0, 0);
      this.playIdle();
      return;
    }

    const left = this.keys.left.isDown || this.keys.a.isDown || touchInput.left;
    const right = this.keys.right.isDown || this.keys.d.isDown || touchInput.right;
    const up = this.keys.up.isDown || this.keys.w.isDown || touchInput.up;
    const down = this.keys.down.isDown || this.keys.s.isDown || touchInput.down;

    body.setVelocity(0, 0);
    if (left) {
      body.setVelocityX(-1);
      this.facing = "left";
    } else if (right) {
      body.setVelocityX(1);
      this.facing = "right";
    }
    if (up) {
      body.setVelocityY(-1);
      if (!left && !right) this.facing = "up";
    } else if (down) {
      body.setVelocityY(1);
      if (!left && !right) this.facing = "down";
    }

    body.velocity.normalize().scale(this.currentSpeed());

    if (body.velocity.lengthSq() > 0) {
      this.playWalk();
    } else {
      this.playIdle();
    }
  }

  private animDirection(): "down" | "up" | "side" {
    if (this.facing === "down") return "down";
    if (this.facing === "up") return "up";
    return "side";
  }

  private playWalk(): void {
    this.setFlipX(this.facing === "left");
    this.anims.play(`char-selma-walk-${this.animDirection()}`, true);
  }

  private playIdle(): void {
    this.setFlipX(this.facing === "left");
    this.anims.play(`char-selma-idle-${this.animDirection()}`, true);
  }

  face(direction: Facing): void {
    this.facing = direction;
    this.playIdle();
  }

  lockMovement(): void {
    this.canMove = false;
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
    this.playIdle();
  }

  unlockMovement(): void {
    this.canMove = true;
  }

  /** Little celebration hop with sparkles (quest complete). */
  celebrate(): void {
    this.scene.tweens.add({
      targets: this,
      y: this.y - 14,
      duration: 160,
      yoyo: true,
      repeat: 2,
      ease: "Quad.easeOut",
    });
    const particles = this.scene.add.particles(this.x, this.y - 20, "fx-sparkle", {
      speed: { min: 30, max: 90 },
      lifespan: 600,
      scale: { start: 1, end: 0 },
      quantity: 12,
      emitting: false,
    });
    particles.setDepth(20);
    particles.explode(12);
    this.scene.time.delayedCall(800, () => particles.destroy());
  }
}
