import type { QuestDefinition } from "@/types";
import { SAFI_QUESTS } from "./safi";
import { EL_JADIDA_QUESTS } from "./elJadida";
import { AZEMMOUR_QUESTS } from "./azemmour";
import { BIR_JDID_QUESTS } from "./birJdid";
import { HAD_SOUALEM_QUESTS } from "./hadSoualem";
import { CASABLANCA_QUESTS } from "./casablanca";

export const ALL_QUESTS: QuestDefinition[] = [
  ...SAFI_QUESTS,
  ...EL_JADIDA_QUESTS,
  ...AZEMMOUR_QUESTS,
  ...BIR_JDID_QUESTS,
  ...HAD_SOUALEM_QUESTS,
  ...CASABLANCA_QUESTS,
];

export const QUEST_INDEX: Record<string, QuestDefinition> = Object.fromEntries(
  ALL_QUESTS.map((q) => [q.id, q]),
);

export function getQuest(id: string): QuestDefinition {
  const quest = QUEST_INDEX[id];
  if (!quest) throw new Error(`Unknown quest: ${id}`);
  return quest;
}

export function questsForCity(cityId: string): QuestDefinition[] {
  return ALL_QUESTS.filter((q) => q.cityId === cityId);
}

export const QUEST_CATEGORY_LABELS: Record<QuestDefinition["category"], string> = {
  "teaching-practice": "Teaching Practice",
  "classroom-challenge": "Classroom Challenge",
  "english-challenge": "English Challenge",
  "professional-development": "Professional Development",
  "crmef-activity": "CRMEF Activity",
  "internship-activity": "Internship Activity",
  "assessment-task": "Assessment Task",
  "portfolio-task": "Portfolio Task",
  "ethics-challenge": "Ethics Challenge",
  "school-life": "School Life",
};
