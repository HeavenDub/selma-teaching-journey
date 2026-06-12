"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/stores/gameStore";
import { ACHIEVEMENTS } from "@/data/achievements";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatDate } from "@/utils/format";

export function AchievementsGrid() {
  const snapshot = useGameStore((s) => s.snapshot);
  if (!snapshot) return null;

  const unlockedMap = new Map(
    snapshot.achievements.map((a) => [a.achievementId, a.unlockedAt]),
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Achievements</h1>
          <p className="text-ink-soft">
            {unlockedMap.size} of {ACHIEVEMENTS.length} unlocked
          </p>
        </div>
        <div className="w-48">
          <ProgressBar
            value={unlockedMap.size}
            max={ACHIEVEMENTS.length}
            color="var(--color-gold-500)"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((achievement, idx) => {
          const unlockedAt = unlockedMap.get(achievement.id);
          const unlocked = unlockedAt !== undefined;
          const secret = achievement.hidden && !unlocked;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className={`flex h-full items-start gap-4 p-5 ${
                  unlocked ? "border-gold-300" : "opacity-75"
                }`}
              >
                <motion.span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-3xl ${
                    unlocked ? "bg-gold-500/20" : "bg-sand-200 grayscale"
                  }`}
                  animate={unlocked ? { rotate: [0, -6, 6, 0] } : undefined}
                  transition={{ delay: 0.4 + idx * 0.05, duration: 0.5 }}
                >
                  {secret ? "❓" : achievement.icon}
                </motion.span>
                <div>
                  <h2 className="font-display font-bold">
                    {secret ? "???" : achievement.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {secret ? "A secret achievement awaits discovery." : achievement.description}
                  </p>
                  {unlocked && (
                    <p className="mt-2 text-xs font-bold text-gold-700">
                      🏆 Unlocked {formatDate(unlockedAt)}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
