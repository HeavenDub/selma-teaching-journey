"use client";

import { create } from "zustand";

export type NotificationKind =
  | "achievement"
  | "level-up"
  | "item"
  | "quest"
  | "ability"
  | "info";

export interface GameNotification {
  id: number;
  kind: NotificationKind;
  title: string;
  subtitle?: string;
  icon: string;
}

interface UiState {
  notifications: GameNotification[];
  pushNotification: (n: Omit<GameNotification, "id">) => void;
  dismissNotification: (id: number) => void;
}

let nextId = 1;

export const useUiStore = create<UiState>((set) => ({
  notifications: [],
  pushNotification: (n) =>
    set((state) => ({
      notifications: [...state.notifications, { ...n, id: nextId++ }].slice(-5),
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
