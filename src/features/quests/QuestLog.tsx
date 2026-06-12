"use client";

import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { ALL_QUESTS } from "@/data/quests";
import { CITIES } from "@/data/cities";
import { QuestCard } from "./QuestCard";

type Filter = "all" | "active" | "available" | "completed";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "In Progress" },
  { id: "available", label: "Available" },
  { id: "completed", label: "Completed" },
];

export function QuestLog() {
  const snapshot = useGameStore((s) => s.snapshot);
  const [filter, setFilter] = useState<Filter>("all");

  if (!snapshot) return null;

  const completedCount = ALL_QUESTS.filter(
    (q) => snapshot.quests[q.id]?.status === "completed",
  ).length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Quest Log</h1>
          <p className="text-ink-soft">
            {completedCount} of {ALL_QUESTS.length} quests completed on the road to certification
          </p>
        </div>
        <div className="flex gap-1 rounded-xl border border-sand-200 bg-white/80 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                filter === f.id
                  ? "bg-zellige-500 text-white"
                  : "text-ink-soft hover:bg-sand-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {CITIES.map((city) => {
          const cityQuests = ALL_QUESTS.filter((q) => q.cityId === city.id).filter((q) => {
            const status = snapshot.quests[q.id]?.status ?? "locked";
            return filter === "all" ? true : status === filter;
          });
          if (cityQuests.length === 0) return null;
          return (
            <section key={city.id}>
              <h2 className="mb-3 font-display text-xl font-bold">
                {city.emblem} {city.name}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {cityQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    progress={snapshot.quests[quest.id]!}
                    expanded
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
