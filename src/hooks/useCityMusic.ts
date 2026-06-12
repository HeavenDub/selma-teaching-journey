"use client";

import { useEffect } from "react";
import { audioManager } from "@/lib/audio/audioManager";
import { useSettingsStore } from "@/stores/settingsStore";

/**
 * Plays the ambient theme for a city (or the menu) while mounted.
 * Browsers require a user gesture before audio can start, so the theme
 * is also (re)armed on the first interaction after mount.
 */
export function useCityMusic(themeKey: string): void {
  const musicEnabled = useSettingsStore((s) => s.musicEnabled);

  useEffect(() => {
    if (!musicEnabled) return;
    audioManager.playTheme(themeKey);
    const arm = () => audioManager.playTheme(themeKey);
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, [themeKey, musicEnabled]);
}
