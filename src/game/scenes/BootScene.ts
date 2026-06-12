import * as Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create(): void {
    this.registry.set("prompt", "");
    this.registry.set("worldLabel", "Loading...");
    this.scene.start("preload");
  }
}
