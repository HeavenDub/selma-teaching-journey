"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/stores/gameStore";
import { ENDING_DESCRIPTIONS } from "@/lib/engine/ending";
import { ALL_QUESTS } from "@/data/quests";
import { CITIES } from "@/data/cities";
import { NPCS } from "@/data/npcs";
import { ACHIEVEMENTS } from "@/data/achievements";
import { useCityMusic } from "@/hooks/useCityMusic";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { STAT_ICONS, STAT_LABELS } from "@/utils/format";
import { formatPlayTime } from "@/utils/math";
import type { StatKey } from "@/types";

type Phase = "ceremony" | "stats" | "credits";

const GRADE_STYLE = {
  A: { emoji: "🌟", color: "var(--color-gold-500)" },
  B: { emoji: "🎓", color: "var(--color-zellige-500)" },
  C: { emoji: "🌱", color: "var(--color-terra-500)" },
} as const;

export function VictoryScreen() {
  const router = useRouter();
  const snapshot = useGameStore((s) => s.snapshot);
  const newGamePlus = useGameStore((s) => s.newGamePlus);
  const quitToMenu = useGameStore((s) => s.quitToMenu);
  const [phase, setPhase] = useState<Phase>("ceremony");
  useCityMusic("casablanca");

  useEffect(() => {
    if (snapshot && !snapshot.ending) router.replace("/map");
  }, [snapshot, router]);

  const stats = useMemo(() => {
    if (!snapshot) return null;
    const completed = Object.values(snapshot.quests).filter(
      (q) => q.status === "completed",
    );
    const avgScore =
      completed.length > 0
        ? Math.round(completed.reduce((a, q) => a + q.score, 0) / completed.length)
        : 0;
    const bestFriend = NPCS.reduce(
      (best, npc) => {
        const value = snapshot.relationships[npc.id] ?? 0;
        return value > best.value ? { npc, value } : best;
      },
      { npc: NPCS[0]!, value: -1 },
    );
    return { completed: completed.length, avgScore, bestFriend };
  }, [snapshot]);

  if (!snapshot?.ending || !stats) return null;
  const { ending } = snapshot;
  const style = GRADE_STYLE[ending.grade];

  const startNgPlus = () => {
    newGamePlus();
    router.push("/map");
  };

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      {/* Confetti for certified endings */}
      {ending.certified &&
        Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute select-none text-2xl"
            style={{ left: `${(i * 41) % 100}%`, top: "-3rem" }}
            animate={{ y: ["0vh", "110vh"], rotate: [0, 360 * (i % 2 ? 1 : -1)] }}
            transition={{
              repeat: Infinity,
              duration: 5 + (i % 5),
              delay: i * 0.35,
              ease: "linear",
            }}
          >
            {["🎉", "🎊", "📜", "🍎", "⭐"][i % 5]}
          </motion.span>
        ))}

      <AnimatePresence mode="wait">
        {phase === "ceremony" && (
          <motion.div
            key="ceremony"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-2xl pt-6 text-center"
          >
            <motion.p
              className="text-8xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, delay: 0.3 }}
            >
              {style.emoji}
            </motion.p>
            <h1 className="mt-4 font-display text-4xl font-bold">
              {ending.title}
            </h1>
            <p className="mt-1 text-lg font-semibold" style={{ color: style.color }}>
              Ending {ending.grade} · Final score {ending.inspectionScore}/100
            </p>
            {ending.certified && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mx-auto mt-4 max-w-md rounded-2xl border-2 border-gold-500 bg-gold-500/10 p-4 font-display text-xl font-bold"
              >
                📜 Certified English Teacher of Morocco
              </motion.p>
            )}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mx-auto mt-6 max-w-xl leading-relaxed text-ink-soft"
            >
              {ENDING_DESCRIPTIONS[ending.grade]}
            </motion.p>
            <Button size="lg" className="mt-8" onClick={() => setPhase("stats")}>
              The graduation ceremony →
            </Button>
          </motion.div>
        )}

        {phase === "stats" && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-2xl pt-4"
          >
            <h1 className="text-center font-display text-3xl font-bold">
              🎓 Journey Statistics
            </h1>
            <Card className="mt-6 p-6">
              <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-3">
                <Stat label="Quests completed" value={`${stats.completed}/${ALL_QUESTS.length}`} icon="📜" />
                <Stat label="Cities visited" value={`${snapshot.unlockedCityIds.length}/${CITIES.length}`} icon="🗺️" />
                <Stat label="Average performance" value={`${stats.avgScore}%`} icon="🎯" />
                <Stat label="Final level" value={`${snapshot.player.level}`} icon="⬆️" />
                <Stat
                  label="Achievements"
                  value={`${snapshot.achievements.length}/${ACHIEVEMENTS.length}`}
                  icon="🏆"
                />
                <Stat label="Journey time" value={formatPlayTime(snapshot.playSeconds)} icon="⏳" />
              </div>
              <div className="mt-6 rounded-xl bg-sand-100 p-4 text-center">
                <p className="text-sm text-ink-soft">Closest companion on the road</p>
                <p className="mt-1 font-display text-lg font-bold">
                  {stats.bestFriend.npc.portrait.emoji} {stats.bestFriend.npc.name} —{" "}
                  {stats.bestFriend.value} relationship
                </p>
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {(Object.keys(STAT_LABELS) as StatKey[]).map((stat) => (
                  <p key={stat} className="flex justify-between rounded-lg bg-white px-3 py-2 text-sm">
                    <span>
                      {STAT_ICONS[stat]} {STAT_LABELS[stat]}
                    </span>
                    <strong>{snapshot.player.stats[stat]}/100</strong>
                  </p>
                ))}
              </div>
            </Card>
            <div className="mt-6 text-center">
              <Button size="lg" onClick={() => setPhase("credits")}>
                Roll the credits →
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "credits" && (
          <motion.div
            key="credits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-xl pt-4 text-center"
          >
            <div className="h-[24rem] overflow-hidden rounded-2xl border border-sand-200 bg-ink p-6 text-sand-100">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "-130%" }}
                transition={{ duration: 38, ease: "linear", repeat: Infinity }}
                className="space-y-7"
              >
                <p className="font-display text-2xl font-bold text-gold-300">
                  Selma's Teaching Journey
                </p>
                <CreditBlock title="Created By">Your Dear Husband ♥</CreditBlock>
                <CreditBlock title="Starring">Selma — Teacher Trainee Extraordinaire</CreditBlock>
                <CreditBlock title="The Mentors">
                  Mr. Alaoui · Dr. Benhaddouche · Mr. Tahiri
                </CreditBlock>
                <CreditBlock title="The Friends">
                  Saadia (and her magnificent scarf) · Khadija (and her seventeen highlighters)
                </CreditBlock>
                <CreditBlock title="The Schools">
                  Mrs. Fassi · Si Brahim · Souad and the Parents' Committee
                </CreditBlock>
                <CreditBlock title="The Students">
                  Amine, weather correspondent · The girl who whispered "painting"
                </CreditBlock>
                <CreditBlock title="The Inspector">
                  Inspector Tazi — 1,412 inspections and counting
                </CreditBlock>
                <CreditBlock title="The Route">
                  Safi → El Jadida → Azemmour → Bir Jdid → Had Soualem → Casablanca
                </CreditBlock>
                <CreditBlock title="Special Thanks">
                  Every teacher who was once a nervous trainee — which is to say, every teacher.
                </CreditBlock>
                <CreditBlock title="Dedicated To">
                  Selma — from Your Dear Husband, with all my love. Good luck in Casablanca. ♥
                </CreditBlock>
                <p className="pb-10 font-display text-xl text-gold-300">
                  شكراً · Thank you for playing 🍎
                </p>
              </motion.div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" variant="gold" onClick={startNgPlus}>
                🔄 New Game Plus
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  quitToMenu();
                  router.push("/");
                }}
              >
                🏠 Main menu
              </Button>
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              New Game Plus carries part of Selma's grown stats and all achievements into a fresh journey.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl bg-sand-100 p-3">
      <p className="text-2xl">{icon}</p>
      <p className="font-display text-xl font-bold">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );
}

function CreditBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-sand-400">{title}</p>
      <p className="mt-1 text-base">{children}</p>
    </div>
  );
}
