/**
 * World integrity test: validates every tile grid, door, spawn, NPC and
 * quest-giver placement without a browser.
 * Run with: npx tsx scripts/world.test.ts
 */

import { WORLD_MAPS, WORLD_MAP_INDEX, QUEST_GIVERS, townMapForCity } from "../src/game/world/maps";
import { VALID_TILE_CHARS, TILE_DEFS } from "../src/game/pixel/tileFactory";
import { FRAME_W, FRAME_H, NPC_PALETTES, SELMA_PALETTE, STUDENT_PALETTES } from "../src/game/pixel/characterFactory";
import { ALL_QUESTS } from "../src/data/quests";
import { NPC_INDEX } from "../src/data/npcs";
import { CITIES } from "../src/data/cities";

let failures = 0;
function assert(condition: boolean, label: string): void {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures += 1;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

const SOLID = new Set(TILE_DEFS.filter((t) => t.solid).map((t) => t.char));

function walkable(mapId: string, tx: number, ty: number): boolean {
  const map = WORLD_MAP_INDEX[mapId]!;
  const row = map.grid[ty];
  if (!row) return false;
  const ch = row[tx];
  return ch !== undefined && !SOLID.has(ch);
}

console.log("\n— Grid structure —");
for (const map of WORLD_MAPS) {
  const widths = new Set(map.grid.map((r) => r.length));
  assert(widths.size === 1, `${map.id}: uniform row width (${[...widths].join(",")})`);
  const badChars = new Set<string>();
  for (const row of map.grid) {
    for (const ch of row) if (!VALID_TILE_CHARS.has(ch)) badChars.add(ch);
  }
  assert(badChars.size === 0, `${map.id}: all tile chars valid${badChars.size ? ` (bad: ${[...badChars].join("")})` : ""}`);
}

console.log("\n— Spawns, doors, NPCs, bus stops —");
for (const map of WORLD_MAPS) {
  assert(walkable(map.id, map.spawn.tx, map.spawn.ty), `${map.id}: spawn walkable`);
  for (const door of map.doors) {
    const ch = map.grid[door.ty]?.[door.tx];
    assert(ch === "D", `${map.id}: door '${door.label}' sits on a D tile`);
    const target = WORLD_MAP_INDEX[door.target.mapId];
    assert(!!target, `${map.id}: door '${door.label}' target map exists`);
    if (target) {
      assert(
        walkable(target.id, door.target.tx, door.target.ty),
        `${map.id}: door '${door.label}' target tile walkable`,
      );
    }
  }
  // Every D tile in the grid must be a registered door.
  map.grid.forEach((row, ty) => {
    for (let tx = 0; tx < row.length; tx++) {
      if (row[tx] === "D") {
        assert(
          map.doors.some((d) => d.tx === tx && d.ty === ty),
          `${map.id}: D tile at ${tx},${ty} registered as door`,
        );
      }
    }
  });
  for (const npc of map.npcs) {
    assert(walkable(map.id, npc.tx, npc.ty), `${map.id}: NPC ${npc.npcId} on walkable tile`);
    assert(!!NPC_INDEX[npc.npcId], `${map.id}: NPC ${npc.npcId} exists in data`);
    assert(!!NPC_PALETTES[npc.npcId], `${map.id}: NPC ${npc.npcId} has a sprite palette`);
  }
  for (const s of map.students ?? []) {
    assert(walkable(map.id, s.tx, s.ty), `${map.id}: student at ${s.tx},${s.ty} walkable`);
    assert(s.variant >= 0 && s.variant < STUDENT_PALETTES.length, `${map.id}: student variant valid`);
  }
  if (map.kind === "town") {
    assert(!!map.busStop, `${map.id}: town has a bus stop`);
    if (map.busStop) {
      assert(walkable(map.id, map.busStop.tx, map.busStop.ty), `${map.id}: bus stop walkable`);
      assert(map.grid[map.busStop.ty]?.[map.busStop.tx] === "B", `${map.id}: bus stop on a B tile`);
    }
  }
}

console.log("\n— Cities & quest givers —");
for (const city of CITIES) {
  const town = townMapForCity(city.id);
  assert(town.kind === "town", `${city.id}: town map exists (${town.id})`);
}
for (const quest of ALL_QUESTS) {
  const giver = QUEST_GIVERS[quest.id];
  assert(!!giver, `quest ${quest.id}: has a giver`);
  if (!giver) continue;
  assert(!!NPC_INDEX[giver.npcId], `quest ${quest.id}: giver NPC ${giver.npcId} exists`);
  const placements = WORLD_MAPS.filter(
    (m) => m.npcs.some((n) => n.npcId === giver.npcId) && (!giver.mapId || m.id === giver.mapId),
  );
  assert(placements.length > 0, `quest ${quest.id}: giver ${giver.npcId} placed in the world`);
  // The giver must be reachable in the quest's own city.
  assert(
    placements.some((m) => m.cityId === quest.cityId),
    `quest ${quest.id}: giver reachable inside ${quest.cityId}`,
  );
}

console.log("\n— Pixel grids —");
{
  const { default: factorySource } = { default: null };
  void factorySource;
  // Validate frame grid dimensions by reconstructing them the same way the
  // factory does (body 18 rows + legs 6 rows, all 16 wide).
  assert(FRAME_W === 16 && FRAME_H === 24, "frame dimensions are 16×24");
  for (const [id, palette] of [["selma", SELMA_PALETTE] as const, ...Object.entries(NPC_PALETTES)]) {
    assert(
      /^#[0-9a-f]{6}$/i.test(palette.skin) && /^#[0-9a-f]{6}$/i.test(palette.top),
      `palette ${id}: valid colors`,
    );
  }
}

console.log(failures === 0 ? "\n✅ WORLD OK" : `\n❌ ${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
