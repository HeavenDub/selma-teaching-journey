export type NpcRole =
  | "mentor-teacher"
  | "school-director"
  | "inspector"
  | "teacher-trainee"
  | "student"
  | "parent"
  | "crmef-supervisor"
  | "administrative-staff";

export interface NpcPortrait {
  /** Emoji face used in the stylized avatar frame. */
  emoji: string;
  /** Tailwind-compatible hex backdrop for the avatar. */
  background: string;
}

export interface NpcDefinition {
  id: string;
  name: string;
  role: NpcRole;
  cityId: string;
  portrait: NpcPortrait;
  biography: string;
  /** Dialogue tree shown when chatting outside quests. */
  chatDialogueId: string;
  /** Lines of their personal arc revealed as relationship grows. */
  storyArc: { minRelationship: number; text: string }[];
}

/** Relationship level 0-100 per NPC id. */
export type RelationshipMap = Record<string, number>;
