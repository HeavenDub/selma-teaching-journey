import type { GameSnapshot } from "@/types";
import { ALL_QUESTS } from "@/data/quests";

type AchievementCheck = (snapshot: GameSnapshot) => boolean;

function questCompleted(snapshot: GameSnapshot, questId: string): boolean {
  return snapshot.quests[questId]?.status === "completed";
}

function questScore(snapshot: GameSnapshot, questId: string): number {
  return snapshot.quests[questId]?.score ?? 0;
}

const CHECKS: Record<string, AchievementCheck> = {
  "first-observation": (s) => questCompleted(s, "first-observation"),
  "lesson-planner": (s) => questCompleted(s, "glass-of-milk"),
  "classroom-hero": (s) =>
    (questCompleted(s, "first-observation") && questScore(s, "first-observation") >= 90) ||
    (questCompleted(s, "school-life") && questScore(s, "school-life") >= 85),
  "portfolio-master": (s) =>
    ALL_QUESTS.filter((q) => q.category === "portfolio-task").every((q) =>
      questCompleted(s, q.id),
    ),
  "ethical-teacher": (s) =>
    questCompleted(s, "professional-ethics") && questScore(s, "professional-ethics") >= 70,
  "assessment-expert": (s) =>
    questCompleted(s, "assessment-master") && questScore(s, "assessment-master") >= 80,
  "social-butterfly": (s) =>
    Object.values(s.relationships).filter((r) => r >= 50).length >= 3,
  "halfway-there": (s) => s.unlockedCityIds.includes("bir-jdid"),
  "certified-teacher": (s) => s.ending?.certified === true,
  outstanding: (s) => s.ending?.grade === "A",
  completionist: (s) => ALL_QUESTS.every((q) => questCompleted(s, q.id)),
  "new-game-plus": (s) => s.ngPlusCycle >= 1,
};

/** Returns achievement ids newly earned but not yet unlocked. */
export function evaluateAchievements(snapshot: GameSnapshot): string[] {
  const unlocked = new Set(snapshot.achievements.map((a) => a.achievementId));
  return Object.entries(CHECKS)
    .filter(([id, check]) => !unlocked.has(id) && check(snapshot))
    .map(([id]) => id);
}
