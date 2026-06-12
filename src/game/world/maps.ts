import { MapBuilder } from "./MapBuilder";
import type { WorldMapDef } from "./types";

/**
 * Every explorable space in the game: six Moroccan towns and their school /
 * CRMEF interiors. All geometry is authored through MapBuilder so the grids
 * are structurally valid by construction.
 */

const TOWN_W = 36;
const TOWN_H = 22;
const INT_W = 22;
const INT_H = 13;

// ─── Safi ───────────────────────────────────────────────────────────────────

function safiTown(): WorldMapDef {
  const b = new MapBuilder(TOWN_W, TOWN_H, ".");
  b.border("T");
  // Atlantic on the west, with a sandy shore.
  b.rect(0, 0, 4, TOWN_H, "~").rect(4, 0, 2, TOWN_H, "s");
  // CRMEF Safi (north) and the host school (east).
  b.building(8, 2, 10, 12);
  b.building(24, 7, 9, 28);
  // Pottery plaza with fountain — Safi's signature.
  b.rect(10, 12, 8, 5, "P").set(13, 14, "F");
  b.scatter([[6, 9], [6, 12]], "o");
  b.scatter([[20, 14], [22, 14]], "m");
  // Streets.
  b.vline(12, 6, 6, "#");
  b.vline(28, 11, 7, "#");
  b.hline(10, 18, 21, "#");
  b.set(13, 17, "#");
  b.set(30, 18, "B");
  // Greenery.
  b.scatter([[18, 3], [20, 3], [7, 15]], "T");
  b.scatter([[9, 13], [18, 13]], "l");
  b.scatter([[9, 15], [18, 15]], "n");
  b.scatter([[9, 7], [16, 11], [19, 16], [25, 13]], ",");
  return {
    id: "safi-town",
    cityId: "safi",
    kind: "town",
    label: "Safi — Old Medina & Port",
    grid: b.rows(),
    spawn: { tx: 13, ty: 18 },
    doors: [
      { tx: 12, ty: 5, label: "CRMEF Safi", target: { mapId: "crmef-safi", tx: 11, ty: 11 } },
      { tx: 28, ty: 10, label: "Host School", target: { mapId: "safi-host-school", tx: 11, ty: 11 } },
    ],
    npcs: [{ npcId: "saadia", tx: 15, ty: 13, facing: "down" }],
    busStop: { tx: 30, ty: 18 },
  };
}

function crmefSafi(): WorldMapDef {
  const b = new MapBuilder(INT_W, INT_H, "f");
  b.border("I");
  b.hline(8, 0, 5, "b");
  b.scatter([[3, 0], [4, 0], [17, 0], [18, 0]], "k");
  b.rect(9, 2, 4, 2, "c");
  b.scatter(
    [[5, 4], [6, 4], [9, 4], [10, 4], [13, 4], [14, 4], [5, 7], [6, 7], [9, 7], [10, 7], [13, 7], [14, 7]],
    "d",
  );
  b.set(11, 12, "D");
  return {
    id: "crmef-safi",
    cityId: "safi",
    kind: "interior",
    label: "CRMEF Safi — Seminar Room",
    grid: b.rows(),
    spawn: { tx: 11, ty: 11 },
    doors: [{ tx: 11, ty: 12, label: "Back to Safi", target: { mapId: "safi-town", tx: 12, ty: 6 } }],
    npcs: [{ npcId: "dr-benhadouch", tx: 10, ty: 3, facing: "down" }],
    students: [
      { tx: 5, ty: 5, variant: 0 },
      { tx: 9, ty: 5, variant: 1 },
      { tx: 13, ty: 5, variant: 2 },
    ],
  };
}

function safiHostSchool(): WorldMapDef {
  const b = new MapBuilder(INT_W, INT_H, "f");
  b.border("I");
  b.hline(7, 0, 6, "b");
  b.scatter([[2, 0], [3, 0]], "k");
  b.scatter(
    [[4, 5], [5, 5], [8, 5], [9, 5], [12, 5], [13, 5], [16, 5], [17, 5], [4, 8], [5, 8], [8, 8], [9, 8], [12, 8], [13, 8], [16, 8], [17, 8]],
    "d",
  );
  b.set(11, 12, "D");
  return {
    id: "safi-host-school",
    cityId: "safi",
    kind: "interior",
    label: "Safi Host School — Classroom",
    grid: b.rows(),
    spawn: { tx: 11, ty: 11 },
    doors: [{ tx: 11, ty: 12, label: "Back to Safi", target: { mapId: "safi-town", tx: 28, ty: 11 } }],
    npcs: [{ npcId: "mr-alaoui", tx: 10, ty: 3, facing: "down" }],
    students: [
      { tx: 4, ty: 6, variant: 0 },
      { tx: 8, ty: 6, variant: 1 },
      { tx: 12, ty: 6, variant: 2 },
      { tx: 16, ty: 6, variant: 0 },
      { tx: 5, ty: 9, variant: 1 },
      { tx: 13, ty: 9, variant: 2 },
    ],
  };
}

// ─── El Jadida ──────────────────────────────────────────────────────────────

function elJadidaTown(): WorldMapDef {
  const b = new MapBuilder(TOWN_W, TOWN_H, ".");
  b.border("T");
  // Atlantic to the north, ramparts by the shore.
  b.rect(0, 0, TOWN_W, 3, "~").rect(0, 3, TOWN_W, 1, "s");
  b.rect(4, 6, 6, 4, "W");
  b.scatter([[5, 9], [6, 9], [7, 9]], "M");
  // The middle school.
  b.building(22, 8, 10, 26);
  // Plaza & fountain.
  b.rect(14, 13, 8, 4, "P").set(17, 15, "F");
  // Streets and bus stop.
  b.vline(26, 12, 6, "#");
  b.hline(8, 18, 24, "#");
  b.set(31, 18, "B");
  // Market & palms by the shore.
  b.scatter([[12, 9], [14, 9]], "m");
  b.scatter([[8, 4], [12, 4], [20, 4], [28, 4]], "p");
  b.scatter([[10, 12], [24, 15], [30, 9]], ",");
  b.scatter([[30, 13], [6, 14]], "T");
  b.scatter([[13, 14], [22, 14]], "l");
  b.scatter([[13, 16], [22, 16]], "n");
  return {
    id: "el-jadida-town",
    cityId: "el-jadida",
    kind: "town",
    label: "El Jadida — Cité Portugaise",
    grid: b.rows(),
    spawn: { tx: 15, ty: 18 },
    doors: [
      { tx: 26, ty: 11, label: "Middle School", target: { mapId: "el-jadida-school", tx: 11, ty: 11 } },
    ],
    npcs: [{ npcId: "mrs-fassi", tx: 24, ty: 13, facing: "down" }],
    busStop: { tx: 31, ty: 18 },
  };
}

function elJadidaSchool(): WorldMapDef {
  const b = new MapBuilder(INT_W, INT_H, "f");
  b.border("I");
  b.hline(8, 0, 5, "b");
  b.scatter([[15, 0], [16, 0]], "k");
  b.scatter(
    [[4, 4], [5, 4], [8, 4], [9, 4], [12, 4], [13, 4], [16, 4], [17, 4], [4, 7], [5, 7], [8, 7], [9, 7], [12, 7], [13, 7], [16, 7], [17, 7]],
    "d",
  );
  b.set(11, 12, "D");
  return {
    id: "el-jadida-school",
    cityId: "el-jadida",
    kind: "interior",
    label: "El Jadida — English Classroom",
    grid: b.rows(),
    spawn: { tx: 11, ty: 11 },
    doors: [{ tx: 11, ty: 12, label: "Back to El Jadida", target: { mapId: "el-jadida-town", tx: 26, ty: 12 } }],
    npcs: [{ npcId: "amine", tx: 10, ty: 5, facing: "down" }],
    students: [
      { tx: 4, ty: 5, variant: 0 },
      { tx: 8, ty: 5, variant: 1 },
      { tx: 12, ty: 5, variant: 2 },
      { tx: 16, ty: 5, variant: 0 },
      { tx: 5, ty: 8, variant: 1 },
      { tx: 13, ty: 8, variant: 2 },
    ],
  };
}

// ─── Azemmour ───────────────────────────────────────────────────────────────

function azemmourTown(): WorldMapDef {
  const b = new MapBuilder(TOWN_W, TOWN_H, ".");
  b.border("T");
  // The Oum Er-Rbia river crosses the north, with a small bridge.
  b.rect(0, 4, TOWN_W, 2, "~");
  b.set(18, 4, "#").set(18, 5, "#");
  // Mural street — Azemmour's open-air gallery.
  b.hline(6, 9, 6, "M");
  b.hline(24, 9, 5, "M");
  // School archive building.
  b.building(14, 7, 8, 17);
  // Small plaza.
  b.rect(12, 13, 6, 3, "P");
  // Streets.
  b.vline(17, 11, 7, "#");
  b.hline(8, 18, 22, "#");
  b.set(29, 18, "B");
  b.scatter([[5, 13], [26, 13], [30, 8], [9, 2], [27, 2]], "T");
  b.scatter([[11, 14], [18, 14]], "l");
  b.scatter([[11, 16]], "n");
  b.scatter([[10, 12], [21, 14], [24, 16], [8, 15]], ",");
  return {
    id: "azemmour-town",
    cityId: "azemmour",
    kind: "town",
    label: "Azemmour — River & Murals",
    grid: b.rows(),
    spawn: { tx: 16, ty: 18 },
    doors: [
      { tx: 17, ty: 10, label: "School Archive", target: { mapId: "azemmour-archive", tx: 11, ty: 11 } },
    ],
    npcs: [],
    busStop: { tx: 29, ty: 18 },
  };
}

function azemmourArchive(): WorldMapDef {
  const b = new MapBuilder(INT_W, INT_H, "f");
  b.border("I");
  b.hline(2, 0, 8, "k");
  b.hline(12, 0, 8, "k");
  b.scatter([[5, 4], [6, 4], [7, 4], [13, 4], [14, 4], [15, 4]], "d");
  b.rect(9, 6, 4, 3, "r");
  b.set(11, 12, "D");
  return {
    id: "azemmour-archive",
    cityId: "azemmour",
    kind: "interior",
    label: "Azemmour — Archive & Portfolio Room",
    grid: b.rows(),
    spawn: { tx: 11, ty: 11 },
    doors: [{ tx: 11, ty: 12, label: "Back to Azemmour", target: { mapId: "azemmour-town", tx: 17, ty: 11 } }],
    npcs: [
      { npcId: "khadija", tx: 6, ty: 6, facing: "down" },
      { npcId: "si-brahim", tx: 14, ty: 6, facing: "down" },
    ],
  };
}

// ─── Bir Jdid ───────────────────────────────────────────────────────────────

function birJdidTown(): WorldMapDef {
  const b = new MapBuilder(TOWN_W, TOWN_H, ".");
  b.border("T");
  // Farmland all around the crossroads town.
  b.rect(4, 3, 8, 4, "g");
  b.rect(24, 3, 8, 4, "g");
  b.rect(4, 14, 6, 4, "g");
  b.hline(4, 7, 8, "x");
  // Didactic production workshop.
  b.building(16, 8, 9, 20);
  // Market stalls.
  b.scatter([[12, 14], [14, 14], [26, 14]], "m");
  // Streets.
  b.vline(20, 12, 6, "#");
  b.hline(10, 18, 20, "#");
  b.set(29, 18, "B");
  b.scatter([[8, 10], [28, 9], [30, 16]], "T");
  b.scatter([[18, 13], [22, 13]], "l");
  b.scatter([[18, 16]], "n");
  b.scatter([[13, 10], [24, 12], [11, 16]], ",");
  return {
    id: "bir-jdid-town",
    cityId: "bir-jdid",
    kind: "town",
    label: "Bir Jdid — Crossroads of Farmland",
    grid: b.rows(),
    spawn: { tx: 19, ty: 18 },
    doors: [
      { tx: 20, ty: 11, label: "Didactic Workshop", target: { mapId: "bir-jdid-workshop", tx: 11, ty: 11 } },
    ],
    npcs: [],
    busStop: { tx: 29, ty: 18 },
  };
}

function birJdidWorkshop(): WorldMapDef {
  const b = new MapBuilder(INT_W, INT_H, "f");
  b.border("I");
  b.hline(9, 0, 4, "b");
  b.scatter([[3, 0], [4, 0], [17, 0], [18, 0]], "k");
  b.rect(4, 4, 4, 1, "d");
  b.rect(14, 4, 4, 1, "d");
  b.rect(4, 8, 4, 1, "d");
  b.rect(14, 8, 4, 1, "d");
  b.set(11, 12, "D");
  return {
    id: "bir-jdid-workshop",
    cityId: "bir-jdid",
    kind: "interior",
    label: "Bir Jdid — Production Workshop",
    grid: b.rows(),
    spawn: { tx: 11, ty: 11 },
    doors: [{ tx: 11, ty: 12, label: "Back to Bir Jdid", target: { mapId: "bir-jdid-town", tx: 20, ty: 12 } }],
    npcs: [
      { npcId: "mr-tahiri", tx: 11, ty: 3, facing: "down" },
      { npcId: "saadia", tx: 5, ty: 6, facing: "right" },
      { npcId: "khadija", tx: 15, ty: 6, facing: "left" },
    ],
  };
}

// ─── Had Soualem ────────────────────────────────────────────────────────────

function hadSoualemTown(): WorldMapDef {
  const b = new MapBuilder(TOWN_W, TOWN_H, ".");
  b.border("T");
  // The school and its fenced yard dominate the town.
  b.building(12, 4, 12, 17);
  b.vline(8, 10, 5, "x");
  b.vline(27, 10, 5, "x");
  b.hline(8, 15, 8, "x");
  b.hline(20, 15, 8, "x");
  b.rect(14, 10, 8, 4, "P");
  // Streets.
  b.vline(17, 8, 2, "#");
  b.vline(17, 15, 3, "#");
  b.hline(10, 18, 20, "#");
  b.set(29, 18, "B");
  b.scatter([[6, 6], [30, 6], [5, 16], [31, 16]], "T");
  b.scatter([[13, 11], [22, 11]], "l");
  b.scatter([[13, 13], [22, 13]], "n");
  b.scatter([[15, 11], [20, 13], [10, 16], [25, 16]], ",");
  return {
    id: "had-soualem-town",
    cityId: "had-soualem",
    kind: "town",
    label: "Had Soualem — School & Yard",
    grid: b.rows(),
    spawn: { tx: 16, ty: 18 },
    doors: [
      { tx: 17, ty: 7, label: "School Hall", target: { mapId: "had-soualem-school", tx: 11, ty: 11 } },
    ],
    npcs: [{ npcId: "souad", tx: 16, ty: 12, facing: "down" }],
    busStop: { tx: 29, ty: 18 },
  };
}

function hadSoualemSchool(): WorldMapDef {
  const b = new MapBuilder(INT_W, INT_H, "f");
  b.border("I");
  b.hline(8, 0, 5, "b");
  b.scatter([[3, 0], [16, 0]], "k");
  b.scatter(
    [[4, 4], [5, 4], [9, 4], [10, 4], [14, 4], [15, 4], [4, 7], [5, 7], [9, 7], [10, 7], [14, 7], [15, 7]],
    "d",
  );
  b.set(11, 12, "D");
  return {
    id: "had-soualem-school",
    cityId: "had-soualem",
    kind: "interior",
    label: "Had Soualem — School Hall",
    grid: b.rows(),
    spawn: { tx: 11, ty: 11 },
    doors: [{ tx: 11, ty: 12, label: "Back to Had Soualem", target: { mapId: "had-soualem-town", tx: 17, ty: 8 } }],
    npcs: [{ npcId: "inspector-tazi", tx: 11, ty: 2, facing: "down" }],
    students: [
      { tx: 4, ty: 5, variant: 0 },
      { tx: 9, ty: 5, variant: 1 },
      { tx: 14, ty: 5, variant: 2 },
    ],
  };
}

// ─── Casablanca ─────────────────────────────────────────────────────────────

function casablancaTown(): WorldMapDef {
  const b = new MapBuilder(TOWN_W, TOWN_H, ".");
  b.border("T");
  // The white city: broad plaza, office blocks, palms.
  b.rect(4, 2, 10, 2, "R").rect(4, 4, 10, 2, "W");
  b.building(22, 2, 10, 26);
  b.rect(8, 8, 20, 8, "P").set(17, 11, "F");
  b.rect(4, 17, 8, 2, "R").rect(4, 19, 8, 2, "W");
  b.scatter([[6, 9], [6, 12], [29, 9], [29, 12]], "p");
  // Streets.
  b.vline(26, 6, 2, "#");
  b.vline(17, 16, 2, "#");
  b.hline(10, 18, 22, "#");
  b.set(31, 18, "B");
  b.scatter([[16, 16], [20, 7], [33, 15]], ",");
  b.scatter([[7, 11], [28, 11], [7, 14], [28, 14]], "l");
  b.scatter([[15, 16], [20, 16]], "n");
  return {
    id: "casablanca-town",
    cityId: "casablanca",
    kind: "town",
    label: "Casablanca — The White City",
    grid: b.rows(),
    spawn: { tx: 17, ty: 18 },
    doors: [
      { tx: 26, ty: 5, label: "Inspection School", target: { mapId: "casablanca-inspection", tx: 11, ty: 11 } },
    ],
    npcs: [],
    busStop: { tx: 31, ty: 18 },
  };
}

function casablancaInspection(): WorldMapDef {
  const b = new MapBuilder(INT_W, INT_H, "f");
  b.border("I");
  b.hline(8, 0, 6, "b");
  b.scatter([[2, 0], [3, 0], [18, 0], [19, 0]], "k");
  b.rect(8, 3, 6, 3, "c");
  b.scatter([[10, 7], [11, 7]], "d");
  b.set(11, 12, "D");
  return {
    id: "casablanca-inspection",
    cityId: "casablanca",
    kind: "interior",
    label: "Casablanca — Inspection Hall",
    grid: b.rows(),
    spawn: { tx: 11, ty: 11 },
    doors: [{ tx: 11, ty: 12, label: "Back to Casablanca", target: { mapId: "casablanca-town", tx: 26, ty: 6 } }],
    npcs: [{ npcId: "inspector-tazi", tx: 11, ty: 4, facing: "down" }],
  };
}

// ─── Index ──────────────────────────────────────────────────────────────────

export const WORLD_MAPS: WorldMapDef[] = [
  safiTown(),
  crmefSafi(),
  safiHostSchool(),
  elJadidaTown(),
  elJadidaSchool(),
  azemmourTown(),
  azemmourArchive(),
  birJdidTown(),
  birJdidWorkshop(),
  hadSoualemTown(),
  hadSoualemSchool(),
  casablancaTown(),
  casablancaInspection(),
];

export const WORLD_MAP_INDEX: Record<string, WorldMapDef> = Object.fromEntries(
  WORLD_MAPS.map((m) => [m.id, m]),
);

export function getWorldMap(id: string): WorldMapDef {
  const map = WORLD_MAP_INDEX[id];
  if (!map) throw new Error(`Unknown world map: ${id}`);
  return map;
}

export function townMapForCity(cityId: string): WorldMapDef {
  const map = WORLD_MAPS.find((m) => m.cityId === cityId && m.kind === "town");
  if (!map) throw new Error(`No town map for city: ${cityId}`);
  return map;
}

/**
 * Which NPC hands out each quest, and (when the NPC appears in several maps)
 * the only map where that quest can be started.
 */
export const QUEST_GIVERS: Record<string, { npcId: string; mapId?: string }> = {
  "first-observation": { npcId: "mr-alaoui" },
  "after-school-activities": { npcId: "mr-alaoui" },
  "micro-teaching": { npcId: "dr-benhadouch" },
  "glass-of-milk": { npcId: "mrs-fassi" },
  "weather-forecast": { npcId: "amine" },
  "portfolio-challenge": { npcId: "khadija", mapId: "azemmour-archive" },
  "sheet-factory": { npcId: "si-brahim" },
  "assessment-master": { npcId: "mr-tahiri" },
  "didactic-workshop": { npcId: "saadia", mapId: "bir-jdid-workshop" },
  "school-life": { npcId: "souad" },
  "professional-ethics": { npcId: "inspector-tazi", mapId: "had-soualem-school" },
  "grand-inspection": { npcId: "inspector-tazi", mapId: "casablanca-inspection" },
};
