import type { StatChange } from "./player";
import type { MiniGameConfig } from "./minigames";

export type QuestCategory =
  | "teaching-practice"
  | "classroom-challenge"
  | "english-challenge"
  | "professional-development"
  | "crmef-activity"
  | "internship-activity"
  | "assessment-task"
  | "portfolio-task"
  | "ethics-challenge"
  | "school-life";

export type QuestDifficulty = 1 | 2 | 3 | 4 | 5;

export type QuestStatus = "locked" | "available" | "active" | "completed";

export interface QuestObjective {
  id: string;
  description: string;
}

export interface QuestRewards {
  experience: number;
  statChanges?: StatChange[];
  itemIds?: string[];
  abilityId?: string;
}

/** A quest plays as a sequence of steps executed by the quest engine. */
export type QuestStep =
  | { kind: "dialogue"; dialogueId: string }
  | { kind: "minigame"; minigame: MiniGameConfig };

export interface QuestDefinition {
  id: string;
  cityId: string;
  title: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  /** Short hook shown on the quest card. */
  summary: string;
  /** Longer narrative intro shown in the quest log. */
  story: string;
  objectives: QuestObjective[];
  steps: QuestStep[];
  rewards: QuestRewards;
  /** Quest ids that must be completed first. */
  prerequisites?: string[];
  /** Journal entry written upon completion (varies by score). */
  journal: {
    highScore: string;
    lowScore: string;
  };
}

export interface QuestProgress {
  questId: string;
  status: QuestStatus;
  currentStep: number;
  /** Normalized 0-100 performance across the quest's minigames. */
  score: number;
  completedAt?: string;
}
