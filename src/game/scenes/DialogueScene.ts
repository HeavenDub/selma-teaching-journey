import * as Phaser from "phaser";

/**
 * The rich dialogue UI is rendered by React over the canvas. This scene stays
 * registered so Phaser can reserve dialogue as a first-class mode later.
 */
export class DialogueScene extends Phaser.Scene {
  constructor() {
    super("dialogue");
  }
}
