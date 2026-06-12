"use client";

import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";

/** Accumulates play time while a game is loaded and the tab is visible. */
export function usePlayClock(): void {
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      const { snapshot, tickPlayTime } = useGameStore.getState();
      if (snapshot) tickPlayTime(10);
    }, 10_000);
    return () => clearInterval(interval);
  }, []);
}
