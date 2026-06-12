"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUiStore, type GameNotification } from "@/stores/uiStore";

const KIND_COLORS: Record<GameNotification["kind"], string> = {
  achievement: "var(--color-gold-500)",
  "level-up": "var(--color-terra-500)",
  item: "var(--color-majorelle-500)",
  quest: "var(--color-zellige-500)",
  ability: "var(--color-terra-300)",
  info: "var(--color-ink-soft)",
};

function Toast({ notification }: { notification: GameNotification }) {
  const dismiss = useUiStore((s) => s.dismissNotification);

  useEffect(() => {
    const timer = setTimeout(() => dismiss(notification.id), 4200);
    return () => clearTimeout(timer);
  }, [notification.id, dismiss]);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: "spring", damping: 22, stiffness: 320 }}
      onClick={() => dismiss(notification.id)}
      className="flex w-72 cursor-pointer items-center gap-3 rounded-xl border-l-4 bg-white/95 p-3 text-left shadow-cozy-lg backdrop-blur"
      style={{ borderLeftColor: KIND_COLORS[notification.kind] }}
    >
      <span className="text-2xl">{notification.icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-bold text-ink">{notification.title}</span>
        {notification.subtitle && (
          <span className="block truncate text-xs text-ink-soft">{notification.subtitle}</span>
        )}
      </span>
    </motion.button>
  );
}

export function NotificationToaster() {
  const notifications = useUiStore((s) => s.notifications);
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex flex-col items-end gap-2">
      <AnimatePresence>
        {notifications.map((n) => (
          <div key={n.id} className="pointer-events-auto">
            <Toast notification={n} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
