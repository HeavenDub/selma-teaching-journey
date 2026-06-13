import type { ItemDefinition } from "@/types";

export const ITEMS: ItemDefinition[] = [
  {
    id: "observation-sheet-1",
    name: "First Observation Sheet",
    description:
      "Selma's very first completed observation sheet, noting Mr. Alaoui's calm-down countdown and pair-work transitions.",
    rarity: "common",
    category: "observation-sheet",
    icon: "📋",
    effects: [
      {
        description: "A keepsake of the first day. +2 Teaching Skill when earned.",
        statBonus: { teachingSkill: 2 },
      },
    ],
  },
  {
    id: "lesson-plan-quantities",
    name: "Quantities Lesson Plan",
    description:
      "A polished PPP lesson plan for 'Could I have a glass of milk, please?' — countables, uncountables and polite requests.",
    rarity: "uncommon",
    category: "lesson-plan",
    icon: "📝",
    effects: [
      {
        description: "A reusable template. +3 Teaching Skill when earned.",
        statBonus: { teachingSkill: 3 },
      },
    ],
  },
  {
    id: "weather-flashcards",
    name: "Weather Flashcard Set",
    description:
      "Hand-drawn flashcards for sunny, cloudy, rainy and stormy days, laminated with love at the El Jadida copy shop.",
    rarity: "common",
    category: "teaching-material",
    icon: "🌦️",
    effects: [
      {
        description: "Engaging visuals. +2 Classroom Management when earned.",
        statBonus: { classroomManagement: 2 },
      },
    ],
  },
  {
    id: "portfolio-entry-internship",
    name: "Internship Portfolio Entry",
    description:
      "A reflective report on Selma's Azemmour internship, with honest insights about what worked and what didn't.",
    rarity: "rare",
    category: "portfolio-entry",
    icon: "📔",
    effects: [
      {
        description: "Depth of reflection. +3 Confidence when earned.",
        statBonus: { confidence: 3 },
      },
    ],
  },
  {
    id: "time-management-badge",
    name: "Time Management Badge",
    description:
      "Awarded for surviving the legendary Observation Sheet Factory deadline. Trainees whisper about that week.",
    rarity: "rare",
    category: "achievement-badge",
    icon: "⏱️",
    effects: [
      {
        description: "Hard-won efficiency. +3 Energy when earned.",
        statBonus: { energy: 3 },
      },
    ],
  },
  {
    id: "assessment-toolkit",
    name: "Assessment Toolkit",
    description:
      "A complete kit of quiz templates, rubrics and marking grids that cleanly separates assessment, evaluation and testing.",
    rarity: "epic",
    category: "assessment-tool",
    icon: "🧰",
    effects: [
      {
        description: "Professional rigor. +4 Teaching Skill when earned.",
        statBonus: { teachingSkill: 4 },
      },
    ],
  },
  {
    id: "teaching-materials-pack",
    name: "Didactic Materials Pack",
    description:
      "Realia, worksheets and games co-created with fellow trainees at the Bir Jdid didactic production workshop.",
    rarity: "epic",
    category: "teaching-material",
    icon: "🎒",
    effects: [
      {
        description: "Collaborative craft. +3 English Knowledge when earned.",
        statBonus: { englishKnowledge: 3 },
      },
    ],
  },
  {
    id: "methodology-handbook",
    name: "ELT Methodology Handbook",
    description:
      "A dog-eared reference book covering PPP, TBL and CLT approaches, gifted by supervisor Dr. Benhaddouche.",
    rarity: "rare",
    category: "reference-book",
    icon: "📚",
    effects: [
      {
        description: "Theory at your fingertips. +3 English Knowledge when earned.",
        statBonus: { englishKnowledge: 3 },
      },
    ],
  },
  {
    id: "leadership-ribbon",
    name: "School Life Leadership Ribbon",
    description:
      "Recognition for organizing the Had Soualem school open day, from the morning assembly to the closing chorus.",
    rarity: "rare",
    category: "achievement-badge",
    icon: "🎗️",
    effects: [
      {
        description: "Leadership shown. +3 Reputation when earned.",
        statBonus: { reputation: 3 },
      },
    ],
  },
  {
    id: "inspector-commendation",
    name: "Inspector's Commendation",
    description:
      "A formal note of respect from Inspector Tazi, acknowledging Selma's integrity in a difficult ethical situation.",
    rarity: "epic",
    category: "certificate",
    icon: "🎖️",
    effects: [
      {
        description: "Professional respect. +4 Reputation when earned.",
        statBonus: { reputation: 4 },
      },
    ],
  },
  {
    id: "teaching-certificate",
    name: "Teaching Certificate",
    description:
      "The official certificate declaring Selma a qualified English teacher of Morocco. Her dream, on paper, at last.",
    rarity: "legendary",
    category: "certificate",
    icon: "📜",
    effects: [
      {
        description: "The dream achieved. +5 Confidence when earned.",
        statBonus: { confidence: 5 },
      },
    ],
  },
];

export const ITEM_INDEX: Record<string, ItemDefinition> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i]),
);

export function getItem(id: string): ItemDefinition {
  const item = ITEM_INDEX[id];
  if (!item) throw new Error(`Unknown item: ${id}`);
  return item;
}
