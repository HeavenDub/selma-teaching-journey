/**
 * End-to-end logic test: simulates a full playthrough against the real
 * Zustand store and engine code. Run with: npx tsx scripts/playthrough.test.ts
 */

// Minimal browser shims so the save system can be exercised in Node.
const storage = new Map<string, string>();
(globalThis as Record<string, unknown>).window = {
  localStorage: {
    getItem: (k: string) => storage.get(k) ?? null,
    setItem: (k: string, v: string) => void storage.set(k, v),
    removeItem: (k: string) => void storage.delete(k),
  },
};
(globalThis as Record<string, unknown>).document = { hidden: false };

import { useGameStore } from "../src/stores/gameStore";
import { ALL_QUESTS } from "../src/data/quests";
import { CITIES } from "../src/data/cities";
import { getDialogue } from "../src/data/dialogues";
import { NPCS } from "../src/data/npcs";
import {
  AUTOSAVE_SLOT,
  loadFromSlot,
  saveToSlot,
  latestSave,
} from "../src/lib/save/saveSystem";

let failures = 0;
function assert(condition: boolean, label: string): void {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures += 1;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

const store = useGameStore;

console.log("\n— Content integrity —");
{
  // Every dialogue referenced by quests must exist and terminate.
  for (const quest of ALL_QUESTS) {
    for (const step of quest.steps) {
      if (step.kind === "dialogue") {
        const tree = getDialogue(step.dialogueId);
        assert(!!tree.nodes[tree.start], `${step.dialogueId} has valid start node`);
        for (const node of Object.values(tree.nodes)) {
          if (node.choices) {
            for (const choice of node.choices) {
              assert(
                choice.next === null || !!tree.nodes[choice.next],
                `${step.dialogueId}:${node.id} choice → valid target`,
              );
            }
          } else {
            assert(
              node.next === null || node.next === undefined || !!tree.nodes[node.next],
              `${step.dialogueId}:${node.id} next → valid target`,
            );
          }
        }
      }
    }
  }
  // Every NPC chat dialogue exists and every speaker resolves.
  for (const npc of NPCS) {
    const tree = getDialogue(npc.chatDialogueId);
    assert(!!tree, `chat dialogue exists for ${npc.id}`);
  }
}

console.log("\n— New game —");
store.getState().newGame();
{
  const s = store.getState().snapshot!;
  assert(s.player.level === 1, "starts at level 1");
  assert(s.unlockedCityIds.join() === "safi", "only Safi unlocked");
  assert(s.quests["first-observation"]!.status === "available", "first quest available");
  assert(s.quests["after-school-activities"]!.status === "locked", "second quest locked behind prerequisite");
  assert(s.quests["glass-of-milk"]!.status === "locked", "El Jadida quest locked");
}

console.log("\n— Dialogue effects —");
{
  const before = store.getState().snapshot!.player.stats.confidence;
  store.getState().applyDialogueEffects(
    [{ stat: "confidence", amount: 2 }],
    8,
    "mr-alaoui",
    "observation-focus-nerves",
  );
  const s = store.getState().snapshot!;
  assert(s.player.stats.confidence === before + 2, "stat effect applied");
  assert(s.relationships["mr-alaoui"] === 8, "relationship increased");
  assert(s.decisions.includes("observation-focus-nerves"), "decision flag recorded");
}

console.log("\n— Full playthrough (route order, high scores) —");
const routeOrder = CITIES.flatMap((city) =>
  ALL_QUESTS.filter((q) => q.cityId === city.id),
);
for (const quest of routeOrder) {
  const state = store.getState();
  const progress = state.snapshot!.quests[quest.id]!;
  assert(progress.status === "available", `${quest.id} is available when reached`);
  state.startQuest(quest.id);
  for (const step of quest.steps) {
    if (step.kind === "minigame") {
      store.getState().recordMiniGameScore(quest.id, 95);
    }
    store.getState().advanceQuestStep(quest.id);
  }
  store.getState().completeQuest(quest.id);
  assert(
    store.getState().snapshot!.quests[quest.id]!.status === "completed",
    `${quest.id} completed`,
  );
}

{
  const s = store.getState().snapshot!;
  console.log("\n— Post-game state —");
  assert(s.unlockedCityIds.length === CITIES.length, "all six cities unlocked");
  assert(s.journal.length === ALL_QUESTS.length, "journal entry per quest");
  assert(s.inventory.some((e) => e.itemId === "teaching-certificate"), "teaching certificate earned");
  assert(s.player.level >= 9, `level ${s.player.level} reached (≥9)`);
  assert(s.player.unlockedAbilities.length >= 6, `${s.player.unlockedAbilities.length} abilities unlocked`);
  assert(s.ending !== null, "ending resolved");
  console.log(
    `    → Ending: grade ${s.ending!.grade} (${s.ending!.title}), score ${s.ending!.inspectionScore}, certified=${s.ending!.certified}`,
  );
  assert(s.ending!.certified, "Selma is certified on a strong run");
  const achievementIds = s.achievements.map((a) => a.achievementId);
  for (const id of ["first-observation", "lesson-planner", "assessment-expert", "ethical-teacher", "certified-teacher", "completionist", "halfway-there", "portfolio-master"]) {
    assert(achievementIds.includes(id), `achievement unlocked: ${id}`);
  }
}

console.log("\n— Save system —");
{
  const s = store.getState().snapshot!;
  const meta = saveToSlot("slot-1", s);
  assert(meta !== null, "manual save written");
  saveToSlot(AUTOSAVE_SLOT, s);
  const loaded = loadFromSlot("slot-1");
  assert(loaded !== null, "manual save loads");
  assert(loaded!.player.experience === s.player.experience, "loaded XP matches");
  assert(JSON.stringify(loaded) === JSON.stringify(s), "snapshot round-trips losslessly");
  assert(latestSave() !== null, "latest save discoverable for Continue");
}

console.log("\n— New Game Plus —");
{
  const before = store.getState().snapshot!;
  const prevTeaching = before.player.stats.teachingSkill;
  store.getState().newGamePlus();
  const s = store.getState().snapshot!;
  assert(s.ngPlusCycle === 1, "NG+ cycle incremented");
  assert(s.player.level === 1, "level reset");
  assert(s.quests["first-observation"]!.status === "available", "quests reset");
  assert(s.unlockedCityIds.join() === "safi", "cities reset");
  assert(
    s.player.stats.teachingSkill > 15 && s.player.stats.teachingSkill < prevTeaching,
    `stats partially carried (teaching ${s.player.stats.teachingSkill})`,
  );
  assert(
    s.achievements.some((a) => a.achievementId === "new-game-plus"),
    "NG+ achievement unlocked",
  );
  assert(
    s.achievements.some((a) => a.achievementId === "certified-teacher"),
    "achievements persist into NG+",
  );
}

console.log("\n— Low-score run resolves a different ending —");
{
  store.getState().newGame();
  for (const quest of routeOrder) {
    store.getState().startQuest(quest.id);
    for (const step of quest.steps) {
      if (step.kind === "minigame") store.getState().recordMiniGameScore(quest.id, 20);
      store.getState().advanceQuestStep(quest.id);
    }
    store.getState().completeQuest(quest.id);
  }
  const s = store.getState().snapshot!;
  console.log(
    `    → Ending: grade ${s.ending!.grade} (${s.ending!.title}), score ${s.ending!.inspectionScore}, certified=${s.ending!.certified}`,
  );
  assert(s.ending !== null, "ending resolved on weak run");
  assert(s.ending!.grade !== "A", "weak run does not earn Outstanding");
}

console.log(failures === 0 ? "\n✅ ALL TESTS PASSED" : `\n❌ ${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
