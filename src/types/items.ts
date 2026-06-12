import type { PlayerStats } from "./player";

export type ItemRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type ItemCategory =
  | "observation-sheet"
  | "lesson-plan"
  | "teaching-material"
  | "reference-book"
  | "certificate"
  | "portfolio-entry"
  | "assessment-tool"
  | "achievement-badge";

export interface ItemEffect {
  description: string;
  statBonus?: Partial<PlayerStats>;
}

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  rarity: ItemRarity;
  category: ItemCategory;
  /** Emoji icon rendered inside the item card. */
  icon: string;
  effects: ItemEffect[];
}

export interface InventoryEntry {
  itemId: string;
  quantity: number;
  /** ISO timestamp of first acquisition. */
  acquiredAt: string;
}
