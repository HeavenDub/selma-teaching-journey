import * as Phaser from "phaser";

/**
 * Pause controls are React overlays for access to saves and settings. Keeping
 * this scene in the stack makes the V2 scene architecture explicit.
 */
export class PauseScene extends Phaser.Scene {
  constructor() {
    super("pause");
  }
}
