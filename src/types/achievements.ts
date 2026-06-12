export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** Hidden achievements show "???" until unlocked. */
  hidden?: boolean;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;
}
