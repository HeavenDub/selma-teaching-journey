"use client";

import { create } from "zustand";
import type {
  GameSnapshot,
  PlayerState,
  QuestProgress,
  StatChange,
} from "@/types";
import { ALL_QUESTS, QUEST_INDEX, questsForCity } from "@/data/quests";
import { CITIES, getNextCity } from "@/data/cities";
import { getItem } from "@/data/items";
import { ACHIEVEMENT_INDEX } from "@/data/achievements";
import { ABILITY_INDEX } from "@/data/levels";
import {
  applyStatChanges,
  grantExperience,
  INITIAL_STATS,
  ngPlusStats,
} from "@/lib/engine/progression";
import { resolveEnding } from "@/lib/engine/ending";
import { evaluateAchievements } from "@/lib/engine/achievements";
import { SNAPSHOT_VERSION } from "@/lib/save/saveSystem";
import { audioManager } from "@/lib/audio/audioManager";
import { useUiStore } from "./uiStore";
import { clamp } from "@/utils/math";

function freshPlayer(ngPlusFrom?: PlayerState): PlayerState {
  return {
    name: "Selma",
    stats: ngPlusFrom ? ngPlusStats(ngPlusFrom.stats) : { ...INITIAL_STATS },
    experience: 0,
    level: 1,
    unlockedAbilities: [],
    traits: ["motivated", "hardworking", "nervous", "ambitious"],
  };
}

function initialQuestProgress(): Record<string, QuestProgress> {
  const progress: Record<string, QuestProgress> = {};
  for (const quest of ALL_QUESTS) {
    progress[quest.id] = {
      questId: quest.id,
      status: "locked",
      currentStep: 0,
      score: 0,
    };
  }
  return progress;
}

function freshSnapshot(ngPlusFrom?: GameSnapshot): GameSnapshot {
  const snapshot: GameSnapshot = {
    version: SNAPSHOT_VERSION,
    player: freshPlayer(ngPlusFrom?.player),
    inventory: [],
    quests: initialQuestProgress(),
    relationships: {},
    journal: [],
    achievements: ngPlusFrom ? [...ngPlusFrom.achievements] : [],
    decisions: [],
    currentCityId: "safi",
    unlockedCityIds: ["safi"],
    ending: null,
    ngPlusCycle: ngPlusFrom ? ngPlusFrom.ngPlusCycle + 1 : 0,
    startedAt: new Date().toISOString(),
    playSeconds: 0,
    world: null,
  };
  return refreshQuestAvailability(snapshot);
}

/** Unlock quests whose prerequisites are met in unlocked cities. */
function refreshQuestAvailability(snapshot: GameSnapshot): GameSnapshot {
  const quests = { ...snapshot.quests };
  for (const quest of ALL_QUESTS) {
    const progress = quests[quest.id];
    if (!progress || progress.status !== "locked") continue;
    const cityUnlocked = snapshot.unlockedCityIds.includes(quest.cityId);
    const prereqsDone = (quest.prerequisites ?? []).every(
      (id) => quests[id]?.status === "completed",
    );
    if (cityUnlocked && prereqsDone) {
      quests[quest.id] = { ...progress, status: "available" };
    }
  }
  return { ...snapshot, quests };
}

function notify(
  kind: "achievement" | "level-up" | "item" | "quest" | "ability" | "info",
  title: string,
  icon: string,
  subtitle?: string,
): void {
  useUiStore.getState().pushNotification({ kind, title, icon, subtitle });
}

/** Run achievement checks and append any new unlocks (with fanfare). */
function withAchievements(snapshot: GameSnapshot): GameSnapshot {
  const newIds = evaluateAchievements(snapshot);
  if (newIds.length === 0) return snapshot;
  const now = new Date().toISOString();
  for (const id of newIds) {
    const def = ACHIEVEMENT_INDEX[id];
    if (def) {
      notify("achievement", "Achievement Unlocked", def.icon, def.name);
    }
  }
  audioManager.play("achievement");
  return {
    ...snapshot,
    achievements: [
      ...snapshot.achievements,
      ...newIds.map((id) => ({ achievementId: id, unlockedAt: now })),
    ],
  };
}

interface GameStore {
  snapshot: GameSnapshot | null;
  newGame: () => void;
  newGamePlus: () => void;
  loadSnapshot: (snapshot: GameSnapshot) => void;
  quitToMenu: () => void;
  travelTo: (cityId: string) => void;
  startQuest: (questId: string) => void;
  advanceQuestStep: (questId: string) => void;
  recordMiniGameScore: (questId: string, score: number) => void;
  completeQuest: (questId: string) => void;
  applyDialogueEffects: (
    effects: StatChange[],
    relationshipDelta: number,
    npcId: string | undefined,
    decisionFlag: string | undefined,
  ) => void;
  addRelationship: (npcId: string, delta: number) => void;
  tickPlayTime: (seconds: number) => void;
  /** Persist Selma's physical position in the 2D world (V2). */
  setWorldState: (mapId: string, x: number, y: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  snapshot: null,

  newGame: () => set({ snapshot: freshSnapshot() }),

  newGamePlus: () => {
    const current = get().snapshot;
    if (!current) return;
    let snapshot = freshSnapshot(current);
    snapshot = withAchievements(snapshot);
    set({ snapshot });
  },

  loadSnapshot: (snapshot) => set({ snapshot }),

  quitToMenu: () => {
    audioManager.stopMusic();
    set({ snapshot: null });
  },

  travelTo: (cityId) => {
    const { snapshot } = get();
    if (!snapshot || !snapshot.unlockedCityIds.includes(cityId)) return;
    if (snapshot.currentCityId === cityId) return;
    audioManager.play("travel");
    set({ snapshot: { ...snapshot, currentCityId: cityId } });
  },

  startQuest: (questId) => {
    const { snapshot } = get();
    if (!snapshot) return;
    const progress = snapshot.quests[questId];
    if (!progress || progress.status !== "available") return;
    audioManager.play("quest-accepted");
    const quest = QUEST_INDEX[questId];
    if (quest) notify("quest", "Quest Accepted", "📜", quest.title);
    set({
      snapshot: {
        ...snapshot,
        quests: {
          ...snapshot.quests,
          [questId]: { ...progress, status: "active", currentStep: 0, score: 0 },
        },
      },
    });
  },

  advanceQuestStep: (questId) => {
    const { snapshot } = get();
    if (!snapshot) return;
    const progress = snapshot.quests[questId];
    if (!progress || progress.status !== "active") return;
    set({
      snapshot: {
        ...snapshot,
        quests: {
          ...snapshot.quests,
          [questId]: { ...progress, currentStep: progress.currentStep + 1 },
        },
      },
    });
  },

  recordMiniGameScore: (questId, score) => {
    const { snapshot } = get();
    if (!snapshot) return;
    const progress = snapshot.quests[questId];
    if (!progress) return;
    const quest = QUEST_INDEX[questId];
    const totalMinigames = quest
      ? quest.steps.filter((s) => s.kind === "minigame").length
      : 1;
    // Average across the quest's minigames.
    const merged = clamp(
      Math.round(progress.score + score / Math.max(1, totalMinigames)),
      0,
      100,
    );
    set({
      snapshot: {
        ...snapshot,
        quests: {
          ...snapshot.quests,
          [questId]: { ...progress, score: merged },
        },
      },
    });
  },

  completeQuest: (questId) => {
    const { snapshot } = get();
    if (!snapshot) return;
    const quest = QUEST_INDEX[questId];
    const progress = snapshot.quests[questId];
    if (!quest || !progress || progress.status === "completed") return;

    let next: GameSnapshot = {
      ...snapshot,
      quests: {
        ...snapshot.quests,
        [questId]: {
          ...progress,
          status: "completed",
          completedAt: new Date().toISOString(),
        },
      },
    };

    // Stat rewards from the quest itself.
    if (quest.rewards.statChanges) {
      next = {
        ...next,
        player: {
          ...next.player,
          stats: applyStatChanges(next.player.stats, quest.rewards.statChanges),
        },
      };
    }

    // Item rewards, including their passive stat bonuses.
    if (quest.rewards.itemIds) {
      const inventory = [...next.inventory];
      let stats = next.player.stats;
      for (const itemId of quest.rewards.itemIds) {
        const item = getItem(itemId);
        const existing = inventory.find((e) => e.itemId === itemId);
        if (existing) {
          existing.quantity += 1;
        } else {
          inventory.push({
            itemId,
            quantity: 1,
            acquiredAt: new Date().toISOString(),
          });
          for (const effect of item.effects) {
            if (effect.statBonus) {
              stats = applyStatChanges(
                stats,
                Object.entries(effect.statBonus).map(([stat, amount]) => ({
                  stat: stat as StatChange["stat"],
                  amount: amount ?? 0,
                })),
              );
            }
          }
        }
        notify("item", "Item Earned", item.icon, item.name);
      }
      next = { ...next, inventory, player: { ...next.player, stats } };
    }

    // Experience and level-ups.
    const levelResult = grantExperience(next.player, quest.rewards.experience);
    next = { ...next, player: levelResult.player };
    if (levelResult.leveledUp) {
      audioManager.play("level-up");
      notify("level-up", `Level ${levelResult.newLevel}!`, "🎉", "Selma grows as a teacher");
      for (const abilityId of levelResult.newAbilityIds) {
        const ability = ABILITY_INDEX[abilityId];
        if (ability) {
          notify("ability", "New Ability", ability.icon, ability.name);
        }
      }
    }

    // Journal entry — tone depends on performance.
    const finalProgress = next.quests[questId]!;
    const reflection =
      finalProgress.score >= 60 ? quest.journal.highScore : quest.journal.lowScore;
    next = {
      ...next,
      journal: [
        ...next.journal,
        {
          id: `journal-${questId}-${next.ngPlusCycle}`,
          questId,
          cityId: quest.cityId,
          title: quest.title,
          text: reflection,
          writtenAt: new Date().toISOString(),
        },
      ],
    };

    // Final chapter: resolve the ending from exam score + whole journey.
    if (questId === "grand-inspection") {
      next = { ...next, ending: resolveEnding(next, finalProgress.score) };
    }

    // City completion unlocks the next stop on the route.
    const cityQuests = questsForCity(quest.cityId);
    const cityDone = cityQuests.every(
      (q) => next.quests[q.id]?.status === "completed",
    );
    if (cityDone) {
      const nextCity = getNextCity(quest.cityId);
      if (nextCity && !next.unlockedCityIds.includes(nextCity.id)) {
        next = {
          ...next,
          unlockedCityIds: [...next.unlockedCityIds, nextCity.id],
        };
        notify("info", "New Destination", nextCity.emblem, `${nextCity.name} is now reachable`);
      }
    }

    next = refreshQuestAvailability(next);
    next = withAchievements(next);
    audioManager.play("quest-completed");
    notify("quest", "Quest Completed", "✅", quest.title);
    set({ snapshot: next });
  },

  applyDialogueEffects: (effects, relationshipDelta, npcId, decisionFlag) => {
    const { snapshot } = get();
    if (!snapshot) return;
    let next: GameSnapshot = snapshot;
    if (effects.length > 0) {
      next = {
        ...next,
        player: {
          ...next.player,
          stats: applyStatChanges(next.player.stats, effects),
        },
      };
    }
    if (npcId && relationshipDelta !== 0) {
      const current = next.relationships[npcId] ?? 0;
      next = {
        ...next,
        relationships: {
          ...next.relationships,
          [npcId]: clamp(current + relationshipDelta, 0, 100),
        },
      };
    }
    if (decisionFlag && !next.decisions.includes(decisionFlag)) {
      next = { ...next, decisions: [...next.decisions, decisionFlag] };
    }
    next = withAchievements(next);
    set({ snapshot: next });
  },

  addRelationship: (npcId, delta) => {
    const { snapshot } = get();
    if (!snapshot) return;
    const current = snapshot.relationships[npcId] ?? 0;
    let next: GameSnapshot = {
      ...snapshot,
      relationships: {
        ...snapshot.relationships,
        [npcId]: clamp(current + delta, 0, 100),
      },
    };
    next = withAchievements(next);
    set({ snapshot: next });
  },

  tickPlayTime: (seconds) => {
    const { snapshot } = get();
    if (!snapshot) return;
    set({ snapshot: { ...snapshot, playSeconds: snapshot.playSeconds + seconds } });
  },

  setWorldState: (mapId, x, y) => {
    const { snapshot } = get();
    if (!snapshot) return;
    set({
      snapshot: {
        ...snapshot,
        world: { mapId, x: Math.round(x), y: Math.round(y) },
      },
    });
  },
}));

/** All cities with their unlock/completion status for the map. */
export function cityProgressList(snapshot: GameSnapshot) {
  return CITIES.map((city) => {
    const quests = questsForCity(city.id);
    const completed = quests.every(
      (q) => snapshot.quests[q.id]?.status === "completed",
    );
    return {
      city,
      unlocked: snapshot.unlockedCityIds.includes(city.id),
      completed,
      questsTotal: quests.length,
      questsDone: quests.filter((q) => snapshot.quests[q.id]?.status === "completed").length,
    };
  });
}
