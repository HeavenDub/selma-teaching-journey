import * as Phaser from "phaser";
import { audioManager } from "@/lib/audio/audioManager";
import { CITIES } from "@/data/cities";
import { NPC_INDEX } from "@/data/npcs";
import { ALL_QUESTS, QUEST_INDEX } from "@/data/quests";
import { useGameStore } from "@/stores/gameStore";
import { GameEventBus } from "@/game/EventBus";
import { NpcSprite } from "@/game/entities/NpcSprite";
import { Player } from "@/game/entities/Player";
import { consumeTouchInteract, consumeTouchPause } from "@/game/touchInput";
import { CHAR_FRAMES } from "@/game/pixel/characterFactory";
import {
  CHAR_TO_INDEX,
  SOLID_INDEXES,
  TILESET_KEY,
  TILE_SIZE,
} from "@/game/pixel/tileFactory";
import {
  QUEST_GIVERS,
  WORLD_MAP_INDEX,
  getWorldMap,
  townMapForCity,
} from "@/game/world/maps";
import type { DoorDef, TilePoint, WorldMapDef } from "@/game/world/types";

type PendingFlow =
  | { kind: "quest"; questId: string; treeId?: string }
  | { kind: "chat"; treeId: string }
  | { kind: "travel" }
  | { kind: "pause" };

type Interaction =
  | { kind: "door"; door: DoorDef }
  | { kind: "npc"; npc: NpcSprite }
  | { kind: "bus" };

interface WorldSceneData {
  mapId?: string;
  spawn?: TilePoint;
}

export class WorldScene extends Phaser.Scene {
  private mapDef!: WorldMapDef;
  private tileLayer: Phaser.Tilemaps.TilemapLayer | null = null;
  private player!: Player;
  private playerShadow: Phaser.GameObjects.Image | null = null;
  private npcSprites: NpcSprite[] = [];
  private studentSprites: Phaser.Types.Physics.Arcade.SpriteWithStaticBody[] = [];
  private interactKey!: Phaser.Input.Keyboard.Key;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private pending: PendingFlow | null = null;
  private interactLockUntil = 0;
  private saveAt = 0;
  private offBus: (() => void) | null = null;
  private offBusCancel: (() => void) | null = null;
  private offDialogue: (() => void) | null = null;
  private offMiniGame: (() => void) | null = null;
  private offPause: (() => void) | null = null;

  constructor() {
    super("world");
  }

  init(data: WorldSceneData): void {
    const snapshot = useGameStore.getState().snapshot;
    const savedMap = snapshot?.world?.mapId;
    const fallback = snapshot ? townMapForCity(snapshot.currentCityId).id : "safi-town";
    this.mapDef = getWorldMap(data.mapId ?? savedMap ?? fallback);
  }

  create(data: WorldSceneData): void {
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);
    this.renderMap();
    this.decorateEnvironment();
    this.createPlayer(data.spawn);
    this.createNpcs();
    this.createStudents();
    this.createControls();
    this.bindDirectorEvents();
    this.updateQuestMarkers();
    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setZoom(1.5);
    this.registry.set("worldLabel", this.mapDef.label);
    this.persistWorldState();
    const city = CITIES.find((c) => c.id === this.mapDef.cityId);
    if (city) audioManager.playTheme(city.musicTheme);
    GameEventBus.emit("game:ready", { mapId: this.mapDef.id, label: this.mapDef.label });
  }

  update(time: number): void {
    this.player.update();
    if (this.playerShadow) {
      this.playerShadow.setPosition(this.player.x, this.player.y + 22);
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.interactKey) ||
      Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
      consumeTouchInteract()
    ) {
      if (time >= this.interactLockUntil) this.interact();
    }
    if (consumeTouchPause() && !this.pending) {
      this.pending = { kind: "pause" };
      this.player.lockMovement();
      GameEventBus.emit("app:pause-overlay", { open: true });
    }
    if (time >= this.saveAt) {
      this.saveAt = time + 700;
      this.persistWorldState();
      this.updatePrompt();
    }
  }

  private renderMap(): void {
    const data = this.mapDef.grid.map((row) =>
      [...row].map((ch) => {
        const index = CHAR_TO_INDEX[ch];
        if (index === undefined) throw new Error(`Unknown tile '${ch}' in ${this.mapDef.id}`);
        return index;
      }),
    );
    const map = this.make.tilemap({ data, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });
    const tileset = map.addTilesetImage(TILESET_KEY);
    if (!tileset) throw new Error("World tileset was not created");
    this.tileLayer = map.createLayer(0, tileset, 0, 0);
    if (!this.tileLayer) throw new Error(`Could not create tile layer for ${this.mapDef.id}`);
    this.tileLayer.setCollision(SOLID_INDEXES);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  /**
   * Deterministic ambience: tufts, stones, flowers and shells scattered by
   * position hash, plus shimmering glints tweening over every water area.
   */
  private decorateEnvironment(): void {
    const hash = (x: number, y: number, salt: number) => {
      let h = (x * 374761393 + y * 668265263 + salt * 1442695041) | 0;
      h = (h ^ (h >> 13)) * 1274126177;
      return ((h ^ (h >> 16)) >>> 0) / 4294967295;
    };
    const place = (tx: number, ty: number, key: string, salt: number, depth = 1) => {
      const jx = (hash(tx, ty, salt + 50) - 0.5) * 18;
      const jy = (hash(tx, ty, salt + 60) - 0.5) * 18;
      this.add
        .image(this.tileCenter(tx) + jx, this.tileCenter(ty) + jy, key)
        .setScale(2)
        .setDepth(depth);
    };
    this.mapDef.grid.forEach((row, ty) => {
      for (let tx = 0; tx < row.length; tx++) {
        const ch = row[tx]!;
        if (ch === ".") {
          if (hash(tx, ty, 1) < 0.16) place(tx, ty, "fx-tuft", 1);
          else if (hash(tx, ty, 2) < 0.05) place(tx, ty, "fx-stone", 2);
          else if (hash(tx, ty, 3) < 0.05) place(tx, ty, "fx-flower", 3);
        } else if (ch === "s" && hash(tx, ty, 4) < 0.12) {
          place(tx, ty, "fx-shell", 4);
        } else if (ch === "#" && hash(tx, ty, 5) < 0.05) {
          place(tx, ty, "fx-stone", 5);
        } else if (ch === "~" && hash(tx, ty, 6) < 0.16) {
          const glimmer = this.add
            .image(
              this.tileCenter(tx) + (hash(tx, ty, 7) - 0.5) * 16,
              this.tileCenter(ty) + (hash(tx, ty, 8) - 0.5) * 16,
              "fx-glimmer",
            )
            .setScale(2)
            .setDepth(1)
            .setAlpha(0);
          this.tweens.add({
            targets: glimmer,
            alpha: { from: 0, to: 0.75 },
            x: glimmer.x + 6,
            duration: 1100 + hash(tx, ty, 9) * 900,
            delay: hash(tx, ty, 10) * 2000,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
          });
        }
      }
    });
  }

  private addShadow(x: number, y: number): Phaser.GameObjects.Image {
    return this.add.image(x, y, "fx-shadow").setScale(1.6, 1.4).setDepth(2);
  }

  private createPlayer(spawn?: TilePoint): void {
    const snapshot = useGameStore.getState().snapshot;
    const saved = snapshot?.world?.mapId === this.mapDef.id ? snapshot.world : null;
    const point = spawn ?? this.mapDef.spawn;
    const x = saved ? saved.x : this.tileCenter(point.tx);
    const y = saved ? saved.y : this.tileCenter(point.ty);
    this.player = new Player(this, x, y);
    this.playerShadow = this.addShadow(x, y + 22);
    if (this.tileLayer) this.physics.add.collider(this.player, this.tileLayer);
  }

  private createNpcs(): void {
    this.npcSprites = this.mapDef.npcs.map((placement) => {
      const x = this.tileCenter(placement.tx);
      const y = this.tileCenter(placement.ty);
      this.addShadow(x, y + 22);
      const npc = new NpcSprite(this, x, y, placement.npcId, placement.facing);
      this.physics.add.collider(this.player, npc);
      return npc;
    });
  }

  private createStudents(): void {
    this.studentSprites = (this.mapDef.students ?? []).map((student) => {
      this.addShadow(this.tileCenter(student.tx), this.tileCenter(student.ty) + 22);
      const sprite = this.physics.add
        .staticSprite(
          this.tileCenter(student.tx),
          this.tileCenter(student.ty),
          `char-student-${student.variant}`,
          CHAR_FRAMES.downIdle,
        )
        .setScale(2)
        .setDepth(8);
      sprite.body.setSize(24, 18);
      sprite.body.updateFromGameObject();
      this.physics.add.collider(this.player, sprite);
      return sprite;
    });
  }

  private createControls(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) return;
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyboard.on("keydown-ESC", () => {
      if (this.pending) return;
      this.pending = { kind: "pause" };
      this.player.lockMovement();
      GameEventBus.emit("app:pause-overlay", { open: true });
    });
    keyboard.on("keydown-H", () => this.openMenuPage("/inventory"));
    keyboard.on("keydown-J", () => this.openMenuPage("/journal"));
  }

  /** Jump straight to a menu page (bag, journal) without going through pause. */
  private openMenuPage(to: string): void {
    if (this.pending) return;
    this.persistWorldState();
    GameEventBus.emit("app:navigate", { to });
  }

  private bindDirectorEvents(): void {
    this.offDialogue = GameEventBus.on("dialogue:done", ({ treeId }) => {
      if (!this.pending) return;
      if (this.pending.kind === "chat" && this.pending.treeId === treeId) {
        this.clearPending();
        return;
      }
      if (this.pending.kind === "quest" && this.pending.treeId === treeId) {
        useGameStore.getState().advanceQuestStep(this.pending.questId);
        this.continueQuest(this.pending.questId);
      }
    });
    this.offMiniGame = GameEventBus.on("minigame:result", ({ questId, result }) => {
      if (this.pending?.kind !== "quest" || this.pending.questId !== questId) return;
      const store = useGameStore.getState();
      store.recordMiniGameScore(questId, result.score);
      store.advanceQuestStep(questId);
      this.continueQuest(questId);
    });
    this.offBus = GameEventBus.on("travel:selected", ({ cityId }) => {
      if (this.pending?.kind !== "travel") return;
      const snapshot = useGameStore.getState().snapshot;
      if (!snapshot?.unlockedCityIds.includes(cityId)) {
        this.clearPending();
        return;
      }
      useGameStore.getState().travelTo(cityId);
      const town = townMapForCity(cityId);
      const spawn = town.spawn;
      useGameStore
        .getState()
        .setWorldState(town.id, this.tileCenter(spawn.tx), this.tileCenter(spawn.ty));
      this.scene.restart({ mapId: town.id, spawn });
    });
    this.offBusCancel = GameEventBus.on("travel:cancelled", () => {
      if (this.pending?.kind === "travel") this.clearPending();
    });
    this.offPause = GameEventBus.on("app:pause-overlay", ({ open }) => {
      if (!open && this.pending?.kind === "pause") this.clearPending();
    });
  }

  private interact(): void {
    if (this.pending) return;
    const interaction = this.currentInteraction();
    if (!interaction) return;
    if (interaction.kind === "door") {
      const target = interaction.door.target;
      useGameStore
        .getState()
        .setWorldState(target.mapId, this.tileCenter(target.tx), this.tileCenter(target.ty));
      this.scene.restart({ mapId: target.mapId, spawn: target });
      return;
    }
    if (interaction.kind === "bus") {
      const snapshot = useGameStore.getState().snapshot;
      if (!snapshot) return;
      this.pending = { kind: "travel" };
      this.player.lockMovement();
      GameEventBus.emit("travel:open", {
        currentCityId: snapshot.currentCityId,
        unlockedCityIds: snapshot.unlockedCityIds,
      });
      return;
    }
    this.talkToNpc(interaction.npc.npcId);
  }

  private talkToNpc(npcId: string): void {
    const questId = this.questForNpc(npcId);
    if (questId) {
      const progress = useGameStore.getState().snapshot?.quests[questId];
      if (progress?.status === "available") useGameStore.getState().startQuest(questId);
      this.continueQuest(questId);
      return;
    }
    const treeId = NPC_INDEX[npcId]?.chatDialogueId;
    if (!treeId) return;
    this.pending = { kind: "chat", treeId };
    this.player.lockMovement();
    GameEventBus.emit("dialogue:open", { treeId });
  }

  private continueQuest(questId: string): void {
    const snapshot = useGameStore.getState().snapshot;
    const quest = QUEST_INDEX[questId];
    const progress = snapshot?.quests[questId];
    if (!snapshot || !quest || !progress) {
      this.clearPending();
      return;
    }
    const step = quest.steps[progress.currentStep];
    if (!step) {
      useGameStore.getState().completeQuest(questId);
      this.player.celebrate();
      this.updateQuestMarkers();
      this.clearPending();
      if (questId === "grand-inspection") {
        GameEventBus.emit("app:navigate", { to: "/victory" });
      }
      return;
    }
    this.player.lockMovement();
    if (step.kind === "dialogue") {
      this.pending = { kind: "quest", questId, treeId: step.dialogueId };
      GameEventBus.emit("dialogue:open", { questId, treeId: step.dialogueId });
      return;
    }
    this.pending = { kind: "quest", questId };
    GameEventBus.emit("minigame:open", { questId, config: step.minigame });
  }

  private questForNpc(npcId: string): string | null {
    const snapshot = useGameStore.getState().snapshot;
    if (!snapshot) return null;
    const candidates = ALL_QUESTS.filter((quest) => {
      const giver = QUEST_GIVERS[quest.id];
      if (!giver || giver.npcId !== npcId) return false;
      if (giver.mapId && giver.mapId !== this.mapDef.id) return false;
      return quest.cityId === this.mapDef.cityId;
    });
    const active = candidates.find((quest) => snapshot.quests[quest.id]?.status === "active");
    if (active) return active.id;
    const available = candidates.find((quest) => snapshot.quests[quest.id]?.status === "available");
    return available?.id ?? null;
  }

  private updateQuestMarkers(): void {
    const snapshot = useGameStore.getState().snapshot;
    if (!snapshot) return;
    for (const npc of this.npcSprites) {
      const candidates = ALL_QUESTS.filter((quest) => {
        const giver = QUEST_GIVERS[quest.id];
        return (
          giver?.npcId === npc.npcId &&
          (!giver.mapId || giver.mapId === this.mapDef.id) &&
          quest.cityId === this.mapDef.cityId
        );
      });
      const kind = candidates.some((q) => snapshot.quests[q.id]?.status === "available")
        ? "available"
        : candidates.some((q) => snapshot.quests[q.id]?.status === "active")
          ? "active"
          : null;
      npc.setQuestMarker(kind);
    }
  }

  private currentInteraction(): Interaction | null {
    const nearestNpc = this.npcSprites.find((npc) =>
      Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y) <= 48,
    );
    if (nearestNpc) return { kind: "npc", npc: nearestNpc };

    for (const door of this.mapDef.doors) {
      if (
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.tileCenter(door.tx),
          this.tileCenter(door.ty),
        ) <= 42
      ) {
        return { kind: "door", door };
      }
    }
    if (this.mapDef.busStop) {
      const stop = this.mapDef.busStop;
      if (
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.tileCenter(stop.tx),
          this.tileCenter(stop.ty),
        ) <= 48
      ) {
        return { kind: "bus" };
      }
    }
    return null;
  }

  private updatePrompt(): void {
    if (this.pending) {
      this.registry.set("prompt", "");
      return;
    }
    const interaction = this.currentInteraction();
    if (!interaction) {
      this.registry.set("prompt", "");
      return;
    }
    if (interaction.kind === "door") {
      this.registry.set("prompt", `Press E to enter ${interaction.door.label}`);
    } else if (interaction.kind === "bus") {
      this.registry.set("prompt", "Press E to travel");
    } else {
      const npc = NPC_INDEX[interaction.npc.npcId];
      this.registry.set("prompt", `Press E to talk to ${npc?.name ?? interaction.npc.npcId}`);
    }
  }

  private clearPending(): void {
    this.pending = null;
    // Brief lock so the key that closed an overlay (E/Space) cannot
    // immediately re-trigger the same interaction.
    this.interactLockUntil = this.time.now + 350;
    this.player.unlockMovement();
    this.updateQuestMarkers();
    this.updatePrompt();
  }

  private persistWorldState(): void {
    if (!this.player || !WORLD_MAP_INDEX[this.mapDef.id]) return;
    useGameStore.getState().setWorldState(this.mapDef.id, this.player.x, this.player.y);
  }

  private tileCenter(tile: number): number {
    return tile * TILE_SIZE + TILE_SIZE / 2;
  }

  private cleanup(): void {
    this.offBus?.();
    this.offBusCancel?.();
    this.offDialogue?.();
    this.offMiniGame?.();
    this.offPause?.();
    this.offBus = null;
    this.offBusCancel = null;
    this.offDialogue = null;
    this.offMiniGame = null;
    this.offPause = null;
    this.npcSprites = [];
    this.studentSprites = [];
    this.registry.set("prompt", "");
    const cityName = CITIES.find((city) => city.id === this.mapDef?.cityId)?.name;
    if (cityName) this.registry.set("worldLabel", cityName);
  }
}
