"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CITIES } from "@/data/cities";
import { cityProgressList, useGameStore } from "@/stores/gameStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCityMusic } from "@/hooks/useCityMusic";

/** Interactive map of the route Safi → Casablanca. */
export function WorldMap() {
  const snapshot = useGameStore((s) => s.snapshot);
  const travelTo = useGameStore((s) => s.travelTo);
  const router = useRouter();
  const [traveling, setTraveling] = useState<string | null>(null);
  useCityMusic("menu");

  const progress = useMemo(
    () => (snapshot ? cityProgressList(snapshot) : []),
    [snapshot],
  );

  if (!snapshot) return null;

  const currentCity = CITIES.find((c) => c.id === snapshot.currentCityId)!;

  const handleTravel = (cityId: string) => {
    if (cityId === snapshot.currentCityId) {
      router.push(`/city/${cityId}`);
      return;
    }
    setTraveling(cityId);
    travelTo(cityId);
    setTimeout(() => router.push(`/city/${cityId}`), 900);
  };

  // Route polyline through city positions (percent coordinates).
  const routePoints = CITIES.map((c) => `${c.position.x},${c.position.y}`).join(" ");
  const unlockedCount = progress.filter((p) => p.unlocked).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-bold">The Road to Casablanca</h1>
          <p className="text-ink-soft">
            Currently in <strong>{currentCity.name}</strong> · {unlockedCount} of{" "}
            {CITIES.length} cities reached
          </p>
        </div>
        <Badge color="var(--color-terra-500)">
          🧭 {progress.filter((p) => p.completed).length}/{CITIES.length} cities completed
        </Badge>
      </div>

      <div className="relative w-full overflow-hidden rounded-3xl border border-sand-200 shadow-cozy-lg">
        {/* Stylized Moroccan Atlantic coast backdrop. */}
        <div
          className="relative aspect-[4/3] w-full sm:aspect-[16/10]"
          style={{
            background:
              "linear-gradient(115deg, #bfe3dd 0%, #cfe9e0 26%, #f6ecd4 42%, #f2e3c2 60%, #e9d4a7 100%)",
          }}
        >
          {/* Ocean texture */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,100 C10,80 6,60 14,42 C20,28 16,12 26,0 L0,0 Z"
              fill="#7fc8bd"
              opacity="0.5"
            />
            <path
              d="M0,100 C8,84 4,62 12,46 C18,30 14,12 22,0 L0,0 Z"
              fill="#5db4a6"
              opacity="0.35"
            />
            {/* Dotted route */}
            <polyline
              points={routePoints}
              fill="none"
              stroke="#8f6730"
              strokeWidth="0.7"
              strokeDasharray="2 1.6"
              strokeLinecap="round"
              opacity="0.75"
            />
          </svg>

          {/* Decorative landmarks */}
          <span className="absolute left-[6%] top-[28%] text-2xl opacity-60" aria-hidden>🌊</span>
          <span className="absolute left-[40%] top-[78%] text-2xl opacity-50" aria-hidden>🌴</span>
          <span className="absolute left-[68%] top-[55%] text-2xl opacity-50" aria-hidden>🐪</span>
          <span className="absolute left-[88%] top-[35%] text-2xl opacity-50" aria-hidden>⛵</span>

          {/* City nodes */}
          {progress.map(({ city, unlocked, completed, questsDone, questsTotal }) => {
            const isCurrent = snapshot.currentCityId === city.id;
            const isTarget = traveling === city.id;
            return (
              <motion.button
                key={city.id}
                disabled={!unlocked || traveling !== null}
                onClick={() => handleTravel(city.id)}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 ${
                  unlocked ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                style={{ left: `${city.position.x}%`, top: `${city.position.y}%` }}
                whileHover={unlocked ? { scale: 1.12 } : undefined}
                animate={isTarget ? { scale: [1, 1.3, 1] } : undefined}
              >
                <span
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full border-4 text-xl shadow-cozy-lg transition-all sm:h-14 sm:w-14 sm:text-2xl ${
                    isCurrent
                      ? "border-gold-500 bg-white"
                      : unlocked
                        ? "border-white bg-sand-50"
                        : "border-sand-300 bg-sand-200 grayscale"
                  }`}
                  style={unlocked ? { boxShadow: `0 4px 18px ${city.accent}66` } : undefined}
                >
                  {unlocked ? city.emblem : "🔒"}
                  {completed && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zellige-500 text-[10px] text-white shadow">
                      ✓
                    </span>
                  )}
                  {isCurrent && (
                    <motion.span
                      className="absolute -top-7 text-xl"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6 }}
                    >
                      📍
                    </motion.span>
                  )}
                </span>
                <span
                  className={`mt-1 block rounded-full px-2 py-0.5 text-center text-[10px] font-bold shadow-sm sm:text-xs ${
                    unlocked ? "bg-white/90 text-ink" : "bg-sand-200/90 text-sand-600"
                  }`}
                >
                  {city.name}
                  {unlocked && (
                    <span className="ml-1 text-[9px] font-semibold text-ink-soft">
                      {questsDone}/{questsTotal}
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}

          {/* Traveling Selma marker */}
          {traveling && (
            <motion.span
              className="absolute z-10 text-3xl"
              initial={{
                left: `${currentCity.position.x}%`,
                top: `${currentCity.position.y - 6}%`,
              }}
              animate={{
                left: `${CITIES.find((c) => c.id === traveling)!.position.x}%`,
                top: `${CITIES.find((c) => c.id === traveling)!.position.y - 6}%`,
              }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
              style={{ translateX: "-50%" }}
            >
              🚌
            </motion.span>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {progress.map(({ city, unlocked, completed, questsDone, questsTotal }) => (
          <div
            key={city.id}
            className={`rounded-2xl border p-4 ${
              unlocked
                ? "border-sand-200 bg-white/80 shadow-cozy"
                : "border-sand-200 bg-sand-100/60 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold">
                {city.emblem} {city.name}
                <span className="ml-2 text-sm font-normal text-ink-soft">{city.arabicName}</span>
              </span>
              {completed ? (
                <Badge color="var(--color-zellige-500)">Completed</Badge>
              ) : unlocked ? (
                <Badge color={city.accent}>
                  {questsDone}/{questsTotal} quests
                </Badge>
              ) : (
                <Badge color="var(--color-ink-soft)">🔒 Locked</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-soft">{city.tagline}</p>
            {unlocked && (
              <Button
                size="sm"
                variant={snapshot.currentCityId === city.id ? "primary" : "secondary"}
                className="mt-3 w-full"
                disabled={traveling !== null}
                onClick={() => handleTravel(city.id)}
              >
                {snapshot.currentCityId === city.id ? "Enter city" : "Travel here"}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
