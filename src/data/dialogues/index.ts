import type { DialogueTree } from "@/types";
import { SAFI_DIALOGUES } from "./safi";
import { EL_JADIDA_DIALOGUES } from "./elJadida";
import { AZEMMOUR_DIALOGUES } from "./azemmour";
import { BIR_JDID_DIALOGUES } from "./birJdid";
import { HAD_SOUALEM_DIALOGUES } from "./hadSoualem";
import { CASABLANCA_DIALOGUES } from "./casablanca";
import { CHAT_DIALOGUES } from "./chats";

export const ALL_DIALOGUES: DialogueTree[] = [
  ...SAFI_DIALOGUES,
  ...EL_JADIDA_DIALOGUES,
  ...AZEMMOUR_DIALOGUES,
  ...BIR_JDID_DIALOGUES,
  ...HAD_SOUALEM_DIALOGUES,
  ...CASABLANCA_DIALOGUES,
  ...CHAT_DIALOGUES,
];

export const DIALOGUE_INDEX: Record<string, DialogueTree> = Object.fromEntries(
  ALL_DIALOGUES.map((d) => [d.id, d]),
);

export function getDialogue(id: string): DialogueTree {
  const tree = DIALOGUE_INDEX[id];
  if (!tree) throw new Error(`Unknown dialogue: ${id}`);
  return tree;
}
