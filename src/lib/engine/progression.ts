import type { GameSnapshot, PlayerState, PlayerStats, StatChange } from "@/types";
import { ABILITY_INDEX, LEVELS, levelForXp } from "@/data/levels";
import { clampStat } from "@/utils/math";

export const INITIAL_STATS: PlayerStats = {
  teachingSkill: 15,
  classroomManagement: 10,
  englishKnowledge: 35,
  confidence: 12,
  energy: 70,
  reputation: 5,
};

/** NG+ carries a fraction of earned stats into the new run. */
export function ngPlusStats(previous: PlayerStats): PlayerStats {
  const carry = (base: number, prev: number) =>
    clampStat(base + Math.round(Math.max(0, prev - base) * 0.3));
  return {
    teachingSkill: carry(INITIAL_STATS.teachingSkill, previous.teachingSkill),
    classroomManagement: carry(INITIAL_STATS.classroomManagement, previous.classroomManagement),
    englishKnowledge: carry(INITIAL_STATS.englishKnowledge, previous.englishKnowledge),
    confidence: carry(INITIAL_STATS.confidence, previous.confidence),
    energy: clampStat(INITIAL_STATS.energy),
    reputation: carry(INITIAL_STATS.reputation, previous.reputation),
  };
}

export function applyStatChanges(stats: PlayerStats, changes: StatChange[]): PlayerStats {
  const next = { ...stats };
  for (const change of changes) {
    next[change.stat] = clampStat(next[change.stat] + change.amount);
  }
  return next;
}

export interface LevelUpResult {
  player: PlayerState;
  leveledUp: boolean;
  newLevel: number;
  newAbilityIds: string[];
}

/** Add XP, resolve level-ups and ability unlocks (with passive bonuses). */
export function grantExperience(player: PlayerState, xp: number): LevelUpResult {
  const experience = player.experience + xp;
  const target = levelForXp(experience);
  const leveledUp = target.level > player.level;

  const newAbilityIds: string[] = [];
  let stats = { ...player.stats };
  if (leveledUp) {
    for (const def of LEVELS) {
      if (
        def.level > player.level &&
        def.level <= target.level &&
        def.unlocksAbility &&
        !player.unlockedAbilities.includes(def.unlocksAbility)
      ) {
        newAbilityIds.push(def.unlocksAbility);
        const ability = ABILITY_INDEX[def.unlocksAbility];
        if (ability?.passiveBonus) {
          for (const [stat, bonus] of Object.entries(ability.passiveBonus)) {
            const key = stat as keyof PlayerStats;
            stats[key] = clampStat(stats[key] + (bonus ?? 0));
          }
        }
      }
    }
  }

  return {
    player: {
      ...player,
      experience,
      level: target.level,
      stats,
      unlockedAbilities: [...player.unlockedAbilities, ...newAbilityIds],
    },
    leveledUp,
    newLevel: target.level,
    newAbilityIds,
  };
}

/** Overall journey readiness 0-100 used as a component of the final grade. */
export function journeyReadiness(snapshot: GameSnapshot): number {
  const { stats } = snapshot.player;
  const core =
    (stats.teachingSkill +
      stats.classroomManagement +
      stats.englishKnowledge +
      stats.confidence +
      stats.reputation) /
    5;
  const questScores = Object.values(snapshot.quests)
    .filter((q) => q.status === "completed")
    .map((q) => q.score);
  const avgQuestScore =
    questScores.length > 0
      ? questScores.reduce((a, b) => a + b, 0) / questScores.length
      : 0;
  return Math.round(core * 0.55 + avgQuestScore * 0.45);
}
