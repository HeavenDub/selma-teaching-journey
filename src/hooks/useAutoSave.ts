"use client";

import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";
import { AUTOSAVE_SLOT, saveToSlot } from "@/lib/save/saveSystem";

/** Debounced auto-save: any snapshot change is persisted after a short pause. */
export function useAutoSave(): void {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const unsubscribe = useGameStore.subscribe((state, prev) => {
      if (!state.snapshot || state.snapshot === prev.snapshot) return;
      if (timer) clearTimeout(timer);
      const snapshot = state.snapshot;
      timer = setTimeout(() => {
        saveToSlot(AUTOSAVE_SLOT, snapshot);
      }, 800);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, []);
}
