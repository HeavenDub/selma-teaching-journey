import type { StatChange, StatKey } from "./player";

export interface DialogueRequirement {
  stat: StatKey;
  min: number;
}

export interface DialogueChoice {
  id: string;
  text: string;
  /** Next node id; null ends the dialogue. */
  next: string | null;
  /** Stat changes applied when this choice is picked. */
  effects?: StatChange[];
  /** Relationship delta with the speaking NPC. */
  relationshipDelta?: number;
  /** Choice is shown but locked unless the requirement is met. */
  requirement?: DialogueRequirement;
  /** Flag recorded into the game's decision log when picked. */
  decisionFlag?: string;
}

export interface DialogueNode {
  id: string;
  /** NPC id, or "selma" for the protagonist, or "narrator". */
  speaker: string;
  text: string;
  /** Linear continuation; ignored when choices are present. */
  next?: string | null;
  choices?: DialogueChoice[];
  /** Optional mood used to style the speaker portrait. */
  mood?: "neutral" | "happy" | "worried" | "stern" | "proud";
}

export interface DialogueTree {
  id: string;
  /** Primary NPC participating (for relationship changes). */
  npcId?: string;
  start: string;
  nodes: Record<string, DialogueNode>;
}
