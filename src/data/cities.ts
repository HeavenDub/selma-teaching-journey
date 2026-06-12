import type { CityDefinition } from "@/types";

export const CITIES: CityDefinition[] = [
  {
    id: "safi",
    name: "Safi",
    arabicName: "آسفي",
    tagline: "Where the journey begins",
    description:
      "The ocean-side pottery capital, home of the CRMEF training center where Selma takes her very first steps as a teacher trainee.",
    emblem: "🏺",
    position: { x: 18, y: 82 },
    order: 0,
    accent: "#2a9d8f",
    musicTheme: "safi",
  },
  {
    id: "el-jadida",
    name: "El Jadida",
    arabicName: "الجديدة",
    tagline: "The Portuguese cistern city",
    description:
      "A breezy Atlantic city of old ramparts where Selma teaches her first real classes and learns to plan lessons that flow.",
    emblem: "🏰",
    position: { x: 34, y: 60 },
    order: 1,
    accent: "#457b9d",
    musicTheme: "el-jadida",
  },
  {
    id: "azemmour",
    name: "Azemmour",
    arabicName: "أزمور",
    tagline: "The artists' riverside town",
    description:
      "A quiet town of murals on the Oum Er-Rbia river. Here Selma confronts the great paperwork mountain: the internship portfolio.",
    emblem: "🎨",
    position: { x: 47, y: 46 },
    order: 2,
    accent: "#e76f51",
    musicTheme: "azemmour",
  },
  {
    id: "bir-jdid",
    name: "Bir Jdid",
    arabicName: "بير الجديد",
    tagline: "The crossroads of farmland",
    description:
      "A hardworking market town where Selma masters the trinity of assessment, evaluation and testing alongside fellow trainees.",
    emblem: "🌾",
    position: { x: 60, y: 33 },
    order: 3,
    accent: "#bc8a2f",
    musicTheme: "bir-jdid",
  },
  {
    id: "had-soualem",
    name: "Had Soualem",
    arabicName: "حد السوالم",
    tagline: "The last stop before the big city",
    description:
      "A fast-growing town on Casablanca's doorstep where Selma takes on school life duties and faces real ethical dilemmas.",
    emblem: "🕌",
    position: { x: 72, y: 22 },
    order: 4,
    accent: "#7d6bb5",
    musicTheme: "had-soualem",
  },
  {
    id: "casablanca",
    name: "Casablanca",
    arabicName: "الدار البيضاء",
    tagline: "The dream destination",
    description:
      "The white city of opportunity. The Grand Teaching Inspection awaits — everything Selma has learned leads to this moment.",
    emblem: "🏙️",
    position: { x: 86, y: 10 },
    order: 5,
    accent: "#d62847",
    musicTheme: "casablanca",
  },
];

export const CITY_INDEX: Record<string, CityDefinition> = Object.fromEntries(
  CITIES.map((c) => [c.id, c]),
);

export function getCity(id: string): CityDefinition {
  const city = CITY_INDEX[id];
  if (!city) throw new Error(`Unknown city: ${id}`);
  return city;
}

export function getNextCity(id: string): CityDefinition | null {
  const city = getCity(id);
  return CITIES.find((c) => c.order === city.order + 1) ?? null;
}
