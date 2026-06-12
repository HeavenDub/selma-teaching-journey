"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { audioManager } from "@/lib/audio/audioManager";

interface SettingsState {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  textSpeed: "slow" | "normal" | "fast";
  setMusicEnabled: (enabled: boolean) => void;
  setSfxEnabled: (enabled: boolean) => void;
  setTextSpeed: (speed: "slow" | "normal" | "fast") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      musicEnabled: true,
      sfxEnabled: true,
      textSpeed: "normal",
      setMusicEnabled: (musicEnabled) => {
        audioManager.setMusicEnabled(musicEnabled);
        set({ musicEnabled });
      },
      setSfxEnabled: (sfxEnabled) => {
        audioManager.setSfxEnabled(sfxEnabled);
        set({ sfxEnabled });
      },
      setTextSpeed: (textSpeed) => set({ textSpeed }),
    }),
    {
      name: "selma-journey:settings",
      onRehydrateStorage: () => (state) => {
        if (state) {
          audioManager.setMusicEnabled(state.musicEnabled);
          audioManager.setSfxEnabled(state.sfxEnabled);
        }
      },
    },
  ),
);

export const TEXT_SPEED_MS: Record<SettingsState["textSpeed"], number> = {
  slow: 45,
  normal: 22,
  fast: 8,
};
