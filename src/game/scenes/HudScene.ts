import * as Phaser from "phaser";
import { QUEST_INDEX } from "@/data/quests";
import { useGameStore } from "@/stores/gameStore";

export class HudScene extends Phaser.Scene {
  private labelText!: Phaser.GameObjects.Text;
  private questText!: Phaser.GameObjects.Text;
  private promptText!: Phaser.GameObjects.Text;
  private statsText!: Phaser.GameObjects.Text;

  constructor() {
    super("hud");
  }

  create(): void {
    // Cinematic framing: warm sunlight wash + soft vignette over the world.
    this.add
      .rectangle(0, 0, 1280, 720, 0xffd9a0, 0.05)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(0);
    this.add
      .image(640, 360, "fx-vignette")
      .setDisplaySize(1280, 720)
      .setScrollFactor(0)
      .setDepth(1);

    this.add.rectangle(0, 0, 1280, 56, 0x1f1d2b, 0.72).setOrigin(0, 0).setScrollFactor(0).setDepth(2);
    this.labelText = this.add
      .text(18, 12, "", {
        fontFamily: "Georgia, serif",
        fontSize: "18px",
        color: "#f8f4ea",
      })
      .setScrollFactor(0).setDepth(3);
    this.questText = this.add
      .text(18, 34, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "13px",
        color: "#e9c46a",
      })
      .setScrollFactor(0).setDepth(3);
    this.statsText = this.add
      .text(1262, 16, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "15px",
        color: "#f8f4ea",
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(3);
    this.promptText = this.add
      .text(640, 660, "", {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#1f1d2b",
        backgroundColor: "#f8f4ea",
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(3);

    // Always-visible key guide so players never have to dig through pause.
    this.add
      .text(18, 708, "E Talk/Act   H Bag   J Journal   Esc Pause", {
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        color: "#f8f4ea",
        backgroundColor: "rgba(31, 29, 43, 0.72)",
        padding: { x: 10, y: 6 },
      })
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(3);
  }

  update(): void {
    const snapshot = useGameStore.getState().snapshot;
    const worldLabel = (this.registry.get("worldLabel") as string | undefined) ?? "";
    const prompt = (this.registry.get("prompt") as string | undefined) ?? "";
    this.labelText.setText(worldLabel);
    this.promptText.setText(prompt);
    this.promptText.setVisible(prompt.length > 0);

    if (!snapshot) {
      this.questText.setText("");
      this.statsText.setText("");
      return;
    }

    const active = Object.values(snapshot.quests).find((q) => q.status === "active");
    this.questText.setText(active ? `Active quest: ${QUEST_INDEX[active.questId]?.title ?? active.questId}` : "");
    this.statsText.setText(
      `Lv ${snapshot.player.level}   Energy ${snapshot.player.stats.energy}   Confidence ${snapshot.player.stats.confidence}`,
    );
  }
}
