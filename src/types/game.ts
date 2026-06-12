import type { PlayerState } from "./player";
import type { InventoryEntry } from "./items";
import type { QuestProgress } from "./quests";
import type { RelationshipMap } from "./npcs";
import type { JournalEntry } from "./journal";
import type { UnlockedAchievement } from "./achievements";

export type EndingGrade = "A" | "B" | "C";

export interface EndingResult {
  grade: EndingGrade;
  title: string;
  /** Final inspection score 0-100. */
  inspectionScore: number;
  certified: boolean;
}

/** Where Selma physically stands in the 2D world. */
export interface WorldPosition {
  mapId: string;
  x: number;
  y: number;
}

/** The full serializable snapshot of a playthrough. */
export interface GameSnapshot {
  version: number;
  /** 2D world position (V2); null/undefined falls back to the city spawn. */
  world?: WorldPosition | null;
  player: PlayerState;
  inventory: InventoryEntry[];
  quests: Record<string, QuestProgress>;
  relationships: RelationshipMap;
  journal: JournalEntry[];
  achievements: UnlockedAchievement[];
  /** Decision flags recorded from dialogue choices. */
  decisions: string[];
  currentCityId: string;
  unlockedCityIds: string[];
  ending: EndingResult | null;
  /** New Game Plus cycle counter (0 = first playthrough). */
  ngPlusCycle: number;
  startedAt: string;
  playSeconds: number;
}

export interface SaveSlotMeta {
  slotId: string;
  label: string;
  savedAt: string;
  level: number;
  cityName: string;
  questsCompleted: number;
  ngPlusCycle: number;
}
