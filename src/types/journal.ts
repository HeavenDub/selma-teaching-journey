export interface JournalEntry {
  id: string;
  questId: string;
  cityId: string;
  title: string;
  /** Selma's reflection text, chosen based on quest performance. */
  text: string;
  /** ISO timestamp when the entry was written. */
  writtenAt: string;
}
