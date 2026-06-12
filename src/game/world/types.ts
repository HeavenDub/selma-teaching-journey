export type Facing = "down" | "up" | "left" | "right";

export interface TilePoint {
  tx: number;
  ty: number;
}

export interface NpcPlacement extends TilePoint {
  npcId: string;
  facing?: Facing;
}

export interface DoorDef extends TilePoint {
  label: string;
  target: { mapId: string } & TilePoint;
}

export interface StudentPlacement extends TilePoint {
  /** Index into the shared student palette set. */
  variant: number;
}

export interface WorldMapDef {
  id: string;
  cityId: string;
  kind: "town" | "interior";
  label: string;
  /** ASCII tile rows; every char must exist in the tile factory legend. */
  grid: string[];
  spawn: TilePoint;
  doors: DoorDef[];
  npcs: NpcPlacement[];
  /** Bus stop tile — interacting opens the Morocco route map (towns only). */
  busStop?: TilePoint;
  students?: StudentPlacement[];
}
