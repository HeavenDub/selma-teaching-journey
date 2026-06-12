"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/stores/gameStore";
import { ABILITIES, LEVELS, nextLevel } from "@/data/levels";
import { NPCS } from "@/data/npcs";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Portrait, SELMA_PORTRAIT } from "@/components/ui/Portrait";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { STAT_ICONS, STAT_LABELS } from "@/utils/format";
import { formatPlayTime } from "@/utils/math";
import type { StatKey } from "@/types";

const STAT_ORDER: StatKey[] = [
  "teachingSkill",
  "classroomManagement",
  "englishKnowledge",
  "confidence",
  "energy",
  "reputation",
];

const STAT_COLORS: Record<StatKey, string> = {
  teachingSkill: "var(--color-terra-500)",
  classroomManagement: "var(--color-majorelle-500)",
  englishKnowledge: "var(--color-zellige-500)",
  confidence: "var(--color-gold-500)",
  energy: "var(--color-terra-300)",
  reputation: "var(--color-majorelle-300)",
};

export function CharacterSheet() {
  const snapshot = useGameStore((s) => s.snapshot);
  if (!snapshot) return null;

  const { player } = snapshot;
  const levelDef = LEVELS.find((l) => l.level === player.level)!;
  const next = nextLevel(player.level);

  return (
    <div>
      <h1 className="mb-5 font-display text-3xl font-bold">Character Sheet</h1>
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        {/* Identity */}
        <Card className="p-6 text-center">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3.5 }}>
            <Portrait {...SELMA_PORTRAIT} size="xl" ring className="mx-auto" />
          </motion.div>
          <h2 className="mt-4 font-display text-2xl font-bold">{player.name}</h2>
          <p className="text-ink-soft">English Teacher Trainee</p>
          <Badge color="var(--color-terra-500)" className="mt-2">
            Level {player.level} · {levelDef.title}
          </Badge>
          {snapshot.ngPlusCycle > 0 && (
            <Badge color="var(--color-majorelle-500)" className="ml-1 mt-2">
              NG+{snapshot.ngPlusCycle}
            </Badge>
          )}

          <div className="mt-4 text-left">
            <p className="mb-1 flex justify-between text-xs font-bold text-ink-soft">
              <span>Experience</span>
              <span>
                {player.experience} {next ? `/ ${next.xpRequired}` : "(MAX)"}
              </span>
            </p>
            <ProgressBar
              value={player.experience - levelDef.xpRequired}
              max={next ? next.xpRequired - levelDef.xpRequired : 1}
              color="var(--color-gold-500)"
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {player.traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold capitalize text-ink-soft"
              >
                {trait}
              </span>
            ))}
          </div>

          <p className="mt-5 text-xs text-ink-soft">
            Journey time: {formatPlayTime(snapshot.playSeconds)}
          </p>
        </Card>

        <div className="space-y-6">
          {/* Stats */}
          <Card className="p-6">
            <h3 className="mb-4 font-display text-xl font-bold">Teaching Stats</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {STAT_ORDER.map((stat) => (
                <div key={stat}>
                  <p className="mb-1 flex justify-between text-sm font-semibold">
                    <span>
                      {STAT_ICONS[stat]} {STAT_LABELS[stat]}
                    </span>
                    <span className="text-ink-soft">{player.stats[stat]}/100</span>
                  </p>
                  <ProgressBar value={player.stats[stat]} color={STAT_COLORS[stat]} />
                </div>
              ))}
            </div>
          </Card>

          {/* Abilities */}
          <Card className="p-6">
            <h3 className="mb-4 font-display text-xl font-bold">Abilities</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {ABILITIES.map((ability) => {
                const unlocked = player.unlockedAbilities.includes(ability.id);
                const unlockLevel = LEVELS.find((l) => l.unlocksAbility === ability.id)?.level;
                return (
                  <div
                    key={ability.id}
                    className={`flex items-start gap-3 rounded-xl border p-3 ${
                      unlocked
                        ? "border-gold-300 bg-gold-500/10"
                        : "border-sand-200 bg-sand-100 opacity-60"
                    }`}
                  >
                    <span className="text-2xl">{unlocked ? ability.icon : "🔒"}</span>
                    <div>
                      <p className="text-sm font-bold">{ability.name}</p>
                      <p className="text-xs text-ink-soft">
                        {unlocked ? ability.description : `Unlocks at level ${unlockLevel}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Relationships */}
          <Card className="p-6">
            <h3 className="mb-4 font-display text-xl font-bold">Relationships</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {NPCS.map((npc) => {
                const value = snapshot.relationships[npc.id] ?? 0;
                const met = value > 0 || snapshot.unlockedCityIds.includes(npc.cityId);
                return (
                  <div key={npc.id} className="flex items-center gap-3">
                    <Portrait
                      emoji={met ? npc.portrait.emoji : "❔"}
                      background={met ? npc.portrait.background : "#b9b0a2"}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {met ? npc.name : "Not yet met"}
                      </p>
                      <ProgressBar value={value} color="var(--color-gold-500)" className="h-1.5" />
                    </div>
                    <span className="text-xs font-bold text-ink-soft">{value}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
