"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { NpcDefinition } from "@/types";
import { getCity } from "@/data/cities";
import { questsForCity } from "@/data/quests";
import { NPCS, NPC_ROLE_LABELS } from "@/data/npcs";
import { getDialogue } from "@/data/dialogues";
import { useGameStore } from "@/stores/gameStore";
import { useCityMusic } from "@/hooks/useCityMusic";
import { QuestCard } from "@/features/quests/QuestCard";
import { DialoguePlayer } from "@/features/dialogue/DialoguePlayer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Portrait } from "@/components/ui/Portrait";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface CityViewProps {
  cityId: string;
}

export function CityView({ cityId }: CityViewProps) {
  const router = useRouter();
  const snapshot = useGameStore((s) => s.snapshot);
  const [chattingWith, setChattingWith] = useState<NpcDefinition | null>(null);
  const [bioNpc, setBioNpc] = useState<NpcDefinition | null>(null);

  const city = useMemo(() => {
    try {
      return getCity(cityId);
    } catch {
      return null;
    }
  }, [cityId]);

  useCityMusic(city?.musicTheme ?? "menu");

  if (!snapshot || !city) return null;
  if (!snapshot.unlockedCityIds.includes(city.id)) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-sand-200 bg-white/85 p-8 text-center shadow-cozy">
        <p className="text-5xl">🔒</p>
        <p className="mt-3 font-display text-xl font-bold">
          {city.name} is still ahead on the road
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Complete the previous city's quests to continue the journey.
        </p>
        <Button className="mt-4" onClick={() => router.push("/map")}>
          Back to the map
        </Button>
      </div>
    );
  }

  const quests = questsForCity(city.id);
  const npcs = NPCS.filter((n) => n.cityId === city.id);
  const questsDone = quests.filter(
    (q) => snapshot.quests[q.id]?.status === "completed",
  ).length;

  return (
    <div>
      {/* City header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 overflow-hidden rounded-3xl p-7 text-white shadow-cozy-lg"
        style={{
          background: `linear-gradient(120deg, ${city.accent}, ${city.accent}cc 60%, ${city.accent}99)`,
        }}
      >
        <div className="relative z-10 flex flex-wrap items-center gap-4">
          <span className="text-6xl drop-shadow">{city.emblem}</span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-bold drop-shadow-sm">
              {city.name} <span className="text-xl font-normal opacity-90">{city.arabicName}</span>
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed opacity-95">{city.description}</p>
          </div>
          <div className="w-full max-w-[12rem]">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide opacity-90">
              Chapter progress {questsDone}/{quests.length}
            </p>
            <ProgressBar value={questsDone} max={quests.length} color="white" />
          </div>
        </div>
        <span className="absolute -bottom-6 -right-4 select-none text-9xl opacity-15">
          {city.emblem}
        </span>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        {/* Quests */}
        <section>
          <h2 className="mb-3 font-display text-xl font-bold">📜 Chapter Quests</h2>
          <div className="space-y-4">
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} progress={snapshot.quests[quest.id]!} />
            ))}
          </div>
        </section>

        {/* NPCs */}
        <section>
          <h2 className="mb-3 font-display text-xl font-bold">👥 People of {city.name}</h2>
          <div className="space-y-3">
            {npcs.map((npc) => {
              const relationship = snapshot.relationships[npc.id] ?? 0;
              return (
                <Card key={npc.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <Portrait
                      emoji={npc.portrait.emoji}
                      background={npc.portrait.background}
                      size="md"
                      ring={relationship >= 60}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-tight">{npc.name}</p>
                      <Badge color={npc.portrait.background} className="mt-0.5">
                        {NPC_ROLE_LABELS[npc.role]}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                      <span>Relationship</span>
                      <span>
                        {relationship >= 60 ? "💛 Trusted" : relationship >= 30 ? "🙂 Friendly" : "👋 Acquaintance"}
                      </span>
                    </p>
                    <ProgressBar value={relationship} color="var(--color-gold-500)" className="h-2" />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="secondary" className="flex-1" onClick={() => setChattingWith(npc)}>
                      💬 Chat
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1" onClick={() => setBioNpc(npc)}>
                      📖 About
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </div>

      {/* Chat modal */}
      <Modal
        open={chattingWith !== null}
        onClose={() => setChattingWith(null)}
        width="max-w-3xl"
      >
        {chattingWith && (
          <DialoguePlayer
            tree={getDialogue(chattingWith.chatDialogueId)}
            onComplete={() => setChattingWith(null)}
          />
        )}
      </Modal>

      {/* Biography modal */}
      <Modal
        open={bioNpc !== null}
        onClose={() => setBioNpc(null)}
        title={bioNpc ? bioNpc.name : undefined}
      >
        {bioNpc && (
          <div>
            <div className="mb-4 flex items-center gap-4">
              <Portrait emoji={bioNpc.portrait.emoji} background={bioNpc.portrait.background} size="lg" />
              <Badge color={bioNpc.portrait.background}>{NPC_ROLE_LABELS[bioNpc.role]}</Badge>
            </div>
            <p className="leading-relaxed text-ink-soft">{bioNpc.biography}</p>
            <h3 className="mb-2 mt-5 font-display font-bold">Their story so far</h3>
            <ul className="space-y-2">
              {bioNpc.storyArc.map((arc) => {
                const unlocked = (snapshot.relationships[bioNpc.id] ?? 0) >= arc.minRelationship;
                return (
                  <li
                    key={arc.minRelationship}
                    className={`rounded-xl border p-3 text-sm ${
                      unlocked
                        ? "border-gold-300 bg-gold-500/10"
                        : "border-sand-200 bg-sand-100 text-sand-500"
                    }`}
                  >
                    {unlocked ? arc.text : `🔒 Grow closer to ${bioNpc.name} to unlock this chapter.`}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
