/**
 * Typed event bus bridging the Phaser world and the React shell.
 * Phaser does the game, React does the app chrome, Zustand stores the truth —
 * this bus is the only channel the two UIs use to talk to each other.
 */

import type { MiniGameConfig, MiniGameResult } from "@/types";

export interface GameEvents {
  /** Phaser reports the first playable scene rendered successfully. */
  "game:ready": { mapId: string; label: string };
  /** Phaser asks React to open a visual-novel dialogue overlay. */
  "dialogue:open": { treeId: string; questId?: string };
  /** Phaser asks React to open a quest minigame as an overlay. */
  "minigame:open": { questId: string; config: MiniGameConfig };
  /** React reports the minigame outcome back to the quest director. */
  "minigame:result": { questId: string; result: MiniGameResult };
  /** Phaser asks React to open the travel overlay from a town bus stop. */
  "travel:open": { currentCityId: string; unlockedCityIds: string[] };
  /** React reports the selected destination back to Phaser. */
  "travel:selected": { cityId: string };
  /** React closed the travel overlay without choosing a destination. */
  "travel:cancelled": null;
  /** Phaser asks the Next.js router to navigate (victory, quit…). */
  "app:navigate": { to: string };
  /** Phaser requests a full React pause overlay (settings/saves live there). */
  "app:pause-overlay": { open: boolean };
  /** Dialogue scene finished a tree (quest director continuation). */
  "dialogue:done": { treeId: string };
}

type Handler<T> = (payload: T) => void;

class TypedEmitter {
  private handlers = new Map<keyof GameEvents, Set<Handler<never>>>();

  on<K extends keyof GameEvents>(event: K, handler: Handler<GameEvents[K]>): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    set.add(handler as Handler<never>);
    return () => this.off(event, handler);
  }

  off<K extends keyof GameEvents>(event: K, handler: Handler<GameEvents[K]>): void {
    this.handlers.get(event)?.delete(handler as Handler<never>);
  }

  emit<K extends keyof GameEvents>(event: K, payload: GameEvents[K]): void {
    this.handlers.get(event)?.forEach((h) => (h as Handler<GameEvents[K]>)(payload));
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const GameEventBus = new TypedEmitter();
