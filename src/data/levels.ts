import type { Ability, LevelDefinition } from "@/types";

export const LEVELS: LevelDefinition[] = [
  { level: 1, xpRequired: 0, title: "Nervous Trainee" },
  { level: 2, xpRequired: 100, title: "Eager Observer", unlocksAbility: "active-listening" },
  { level: 3, xpRequired: 250, title: "Apprentice Teacher", unlocksAbility: "icebreaker" },
  { level: 4, xpRequired: 450, title: "Confident Planner", unlocksAbility: "lesson-architect" },
  { level: 5, xpRequired: 700, title: "Classroom Navigator", unlocksAbility: "calm-presence" },
  { level: 6, xpRequired: 1000, title: "Reflective Practitioner", unlocksAbility: "deep-reflection" },
  { level: 7, xpRequired: 1350, title: "Rising Professional", unlocksAbility: "assessment-eye" },
  { level: 8, xpRequired: 1750, title: "Almost There", unlocksAbility: "inspiring-voice" },
  { level: 9, xpRequired: 2200, title: "Inspection Ready" },
  { level: 10, xpRequired: 2700, title: "Certified Professional" },
];

export const ABILITIES: Ability[] = [
  {
    id: "active-listening",
    name: "Active Listening",
    description: "Selma hears what students mean, not just what they say.",
    icon: "👂",
    passiveBonus: { classroomManagement: 2 },
  },
  {
    id: "icebreaker",
    name: "Icebreaker",
    description: "A warm-up activity for every occasion. Awkward silences fear her.",
    icon: "🧊",
    passiveBonus: { confidence: 2 },
  },
  {
    id: "lesson-architect",
    name: "Lesson Architect",
    description: "Objectives, staging, timing — lessons assemble themselves in her head.",
    icon: "📐",
    passiveBonus: { teachingSkill: 3 },
  },
  {
    id: "calm-presence",
    name: "Calm Presence",
    description: "When the class storms, Selma is the lighthouse.",
    icon: "🌊",
    passiveBonus: { classroomManagement: 3 },
  },
  {
    id: "deep-reflection",
    name: "Deep Reflection",
    description: "Every lesson becomes a lesson about lessons.",
    icon: "🪞",
    passiveBonus: { confidence: 2, teachingSkill: 1 },
  },
  {
    id: "assessment-eye",
    name: "Assessment Eye",
    description: "Selma sees exactly what each task actually measures.",
    icon: "🎯",
    passiveBonus: { englishKnowledge: 3 },
  },
  {
    id: "inspiring-voice",
    name: "Inspiring Voice",
    description: "Students lean in when she speaks. So do inspectors.",
    icon: "📣",
    passiveBonus: { reputation: 3 },
  },
];

export const ABILITY_INDEX: Record<string, Ability> = Object.fromEntries(
  ABILITIES.map((a) => [a.id, a]),
);

export function levelForXp(xp: number): LevelDefinition {
  let current = LEVELS[0]!;
  for (const def of LEVELS) {
    if (xp >= def.xpRequired) current = def;
  }
  return current;
}

export function nextLevel(level: number): LevelDefinition | null {
  return LEVELS.find((l) => l.level === level + 1) ?? null;
}
