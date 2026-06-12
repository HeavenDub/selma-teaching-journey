import type { ItemRarity, StatKey } from "@/types";

export const STAT_LABELS: Record<StatKey, string> = {
  teachingSkill: "Teaching Skill",
  classroomManagement: "Classroom Management",
  englishKnowledge: "English Knowledge",
  confidence: "Confidence",
  energy: "Energy",
  reputation: "Professional Reputation",
};

export const STAT_ICONS: Record<StatKey, string> = {
  teachingSkill: "🍎",
  classroomManagement: "🧭",
  englishKnowledge: "📖",
  confidence: "💪",
  energy: "⚡",
  reputation: "🌟",
};

export const RARITY_LABELS: Record<ItemRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: "#8a8f98",
  uncommon: "#4f9d69",
  rare: "#4787c7",
  epic: "#9d5fc4",
  legendary: "#d4982a",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
