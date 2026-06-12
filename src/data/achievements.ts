import type { AchievementDefinition } from "@/types";

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first-observation",
    name: "First Observation",
    description: "Complete your very first classroom observation in Safi.",
    icon: "🔍",
  },
  {
    id: "lesson-planner",
    name: "Lesson Planner",
    description: "Build your first complete lesson sequence.",
    icon: "🗂️",
  },
  {
    id: "classroom-hero",
    name: "Classroom Hero",
    description: "Handle classroom situations with a near-perfect score.",
    icon: "🦸🏽‍♀️",
  },
  {
    id: "portfolio-master",
    name: "Portfolio Master",
    description: "Complete every portfolio task on the journey.",
    icon: "📔",
  },
  {
    id: "ethical-teacher",
    name: "Ethical Teacher",
    description: "Resolve the professional ethics dilemmas with integrity.",
    icon: "⚖️",
  },
  {
    id: "assessment-expert",
    name: "Assessment Expert",
    description: "Master the difference between assessment, evaluation and testing.",
    icon: "🧪",
  },
  {
    id: "social-butterfly",
    name: "Friend of the Staff Room",
    description: "Reach a warm relationship (50+) with three different people.",
    icon: "☕",
  },
  {
    id: "halfway-there",
    name: "Halfway There",
    description: "Unlock Bir Jdid — the midpoint of the road to Casablanca.",
    icon: "🛤️",
  },
  {
    id: "certified-teacher",
    name: "Certified Teacher",
    description: "Pass the Grand Teaching Inspection in Casablanca.",
    icon: "📜",
  },
  {
    id: "outstanding",
    name: "Outstanding Teacher",
    description: "Earn the best possible ending with an outstanding inspection.",
    icon: "🌟",
    hidden: true,
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Complete every quest in every city.",
    icon: "💯",
  },
  {
    id: "new-game-plus",
    name: "Once More, With Confidence",
    description: "Begin a New Game Plus journey.",
    icon: "🔄",
    hidden: true,
  },
];

export const ACHIEVEMENT_INDEX: Record<string, AchievementDefinition> =
  Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));
