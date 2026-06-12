export interface MapPosition {
  /** Percentage coordinates on the world map canvas (0-100). */
  x: number;
  y: number;
}

export interface CityDefinition {
  id: string;
  name: string;
  arabicName: string;
  tagline: string;
  description: string;
  /** Emoji emblem for the city. */
  emblem: string;
  position: MapPosition;
  /** Order along Selma's route, 0-indexed from Safi. */
  order: number;
  /** Accent color hex used in the city's UI theme. */
  accent: string;
  /** Music theme key resolved by the audio manager. */
  musicTheme: string;
}

export interface CityProgress {
  cityId: string;
  unlocked: boolean;
  /** All quests in the city completed. */
  completed: boolean;
}
