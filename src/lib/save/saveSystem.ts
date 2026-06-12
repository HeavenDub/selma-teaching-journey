import type { GameSnapshot, SaveSlotMeta } from "@/types";
import { CITY_INDEX } from "@/data/cities";

export const SNAPSHOT_VERSION = 1;
export const AUTOSAVE_SLOT = "auto";
export const MANUAL_SLOTS = ["slot-1", "slot-2", "slot-3"] as const;

const KEY_PREFIX = "selma-journey:save:";

function storageAvailable(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function keyFor(slotId: string): string {
  return `${KEY_PREFIX}${slotId}`;
}

interface StoredSave {
  meta: SaveSlotMeta;
  snapshot: GameSnapshot;
}

export function saveToSlot(slotId: string, snapshot: GameSnapshot): SaveSlotMeta | null {
  if (!storageAvailable()) return null;
  const completed = Object.values(snapshot.quests).filter(
    (q) => q.status === "completed",
  ).length;
  const meta: SaveSlotMeta = {
    slotId,
    label: slotId === AUTOSAVE_SLOT ? "Auto-save" : `Save ${slotId.replace("slot-", "")}`,
    savedAt: new Date().toISOString(),
    level: snapshot.player.level,
    cityName: CITY_INDEX[snapshot.currentCityId]?.name ?? "Unknown",
    questsCompleted: completed,
    ngPlusCycle: snapshot.ngPlusCycle,
  };
  const stored: StoredSave = { meta, snapshot };
  try {
    window.localStorage.setItem(keyFor(slotId), JSON.stringify(stored));
    return meta;
  } catch {
    return null;
  }
}

export function loadFromSlot(slotId: string): GameSnapshot | null {
  if (!storageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(keyFor(slotId));
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredSave;
    if (stored.snapshot?.version !== SNAPSHOT_VERSION) return null;
    return stored.snapshot;
  } catch {
    return null;
  }
}

export function slotMeta(slotId: string): SaveSlotMeta | null {
  if (!storageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(keyFor(slotId));
    if (!raw) return null;
    const stored = JSON.parse(raw) as StoredSave;
    if (stored.snapshot?.version !== SNAPSHOT_VERSION) return null;
    return stored.meta;
  } catch {
    return null;
  }
}

export function deleteSlot(slotId: string): void {
  if (!storageAvailable()) return;
  window.localStorage.removeItem(keyFor(slotId));
}

export function listAllSaves(): SaveSlotMeta[] {
  const ids: string[] = [AUTOSAVE_SLOT, ...MANUAL_SLOTS];
  return ids
    .map((id) => slotMeta(id))
    .filter((m): m is SaveSlotMeta => m !== null);
}

/** Most recently written save across all slots, for "Continue". */
export function latestSave(): SaveSlotMeta | null {
  const all = listAllSaves();
  if (all.length === 0) return null;
  return all.reduce((latest, m) =>
    new Date(m.savedAt) > new Date(latest.savedAt) ? m : latest,
  );
}
