/** Core stat keys tracked for Selma. Each ranges 0-100. */
export type StatKey =
  | "teachingSkill"
  | "classroomManagement"
  | "englishKnowledge"
  | "confidence"
  | "energy"
  | "reputation";

export type PlayerStats = Record<StatKey, number>;

export interface PlayerState {
  name: string;
  stats: PlayerStats;
  experience: number;
  level: number;
  /** Abilities unlocked by leveling up. */
  unlockedAbilities: string[];
  /** Trait flags earned through play (e.g. "leadership"). */
  traits: string[];
}

export interface LevelDefinition {
  level: number;
  /** Total XP required to reach this level. */
  xpRequired: number;
  title: string;
  /** Ability id unlocked at this level, if any. */
  unlocksAbility?: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Passive stat bonus granted when unlocked. */
  passiveBonus?: Partial<PlayerStats>;
}

export interface StatChange {
  stat: StatKey;
  amount: number;
}
