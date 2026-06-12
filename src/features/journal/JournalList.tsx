"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/stores/gameStore";
import { CITY_INDEX } from "@/data/cities";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/utils/format";

export function JournalList() {
  const snapshot = useGameStore((s) => s.snapshot);
  if (!snapshot) return null;

  const entries = [...snapshot.journal].reverse();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 font-display text-3xl font-bold">Selma's Journal</h1>
      <p className="mb-6 text-ink-soft">
        Reflections from the road — her growth, written in her own hand.
      </p>

      {entries.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-5xl">📓</p>
          <p className="mt-3 text-ink-soft">
            The journal is waiting for its first entry. Complete a quest, and Selma will have
            something to write about tonight.
          </p>
        </Card>
      ) : (
        <div className="relative space-y-5 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-0.5 before:bg-sand-300">
          {entries.map((entry, idx) => {
            const city = CITY_INDEX[entry.cityId];
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="relative pl-12"
              >
                <span
                  className="absolute left-0 top-4 flex h-8 w-8 items-center justify-center rounded-full text-base shadow-cozy"
                  style={{ backgroundColor: city?.accent ?? "#999", color: "white" }}
                >
                  {city?.emblem ?? "📍"}
                </span>
                <Card className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-display text-lg font-bold">{entry.title}</h2>
                    {city && <Badge color={city.accent}>{city.name}</Badge>}
                  </div>
                  <p className="mt-3 whitespace-pre-line font-serif text-[15px] italic leading-relaxed text-ink">
                    “{entry.text}”
                  </p>
                  <p className="mt-3 text-right text-xs text-ink-soft">
                    — Selma, {formatDate(entry.writtenAt)}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
