"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { MiniGameResult } from "@/types";
import { QUEST_INDEX } from "@/data/quests";
import { getDialogue } from "@/data/dialogues";
import { getCity } from "@/data/cities";
import { getItem } from "@/data/items";
import { useGameStore } from "@/stores/gameStore";
import { useCityMusic } from "@/hooks/useCityMusic";
import { DialoguePlayer } from "@/features/dialogue/DialoguePlayer";
import { MiniGameHost } from "@/features/minigames/MiniGameHost";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { STAT_LABELS } from "@/utils/format";

interface QuestRunnerProps {
  questId: string;
}

/** Drives an active quest through its steps to the reward screen. */
export function QuestRunner({ questId }: QuestRunnerProps) {
  const router = useRouter();
  const snapshot = useGameStore((s) => s.snapshot);
  const startQuest = useGameStore((s) => s.startQuest);
  const advanceQuestStep = useGameStore((s) => s.advanceQuestStep);
  const recordMiniGameScore = useGameStore((s) => s.recordMiniGameScore);
  const completeQuest = useGameStore((s) => s.completeQuest);
  const [lastResult, setLastResult] = useState<MiniGameResult | null>(null);
  const [claimed, setClaimed] = useState(false);

  const quest = QUEST_INDEX[questId];
  const city = useMemo(() => (quest ? getCity(quest.cityId) : null), [quest]);
  useCityMusic(city?.musicTheme ?? "menu");

  const progress = snapshot?.quests[questId];

  // Auto-accept quests opened directly from the city view.
  useEffect(() => {
    if (progress?.status === "available") startQuest(questId);
  }, [progress?.status, questId, startQuest]);

  if (!snapshot || !quest || !city || !progress) return null;

  if (progress.status === "completed" && !claimed) {
    return (
      <CenteredNote
        emoji="✅"
        title="Quest already completed"
        action={<Button onClick={() => router.push(`/city/${city.id}`)}>Back to {city.name}</Button>}
      />
    );
  }

  if (progress.status === "locked") {
    return (
      <CenteredNote
        emoji="🔒"
        title="This quest is still locked"
        action={<Button onClick={() => router.push(`/city/${city.id}`)}>Back to {city.name}</Button>}
      />
    );
  }

  const step = quest.steps[progress.currentStep];
  const finishedAllSteps = progress.currentStep >= quest.steps.length;

  const claimRewards = () => {
    setClaimed(true);
    completeQuest(questId);
    if (questId === "grand-inspection") {
      router.push("/victory");
    } else {
      router.push(`/city/${city.id}`);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge color={city.accent}>
          {city.emblem} {city.name}
        </Badge>
        <h1 className="font-display text-2xl font-bold">{quest.title}</h1>
        <span className="ml-auto text-sm text-ink-soft">
          Step {Math.min(progress.currentStep + 1, quest.steps.length)} of {quest.steps.length}
        </span>
      </div>

      {!finishedAllSteps && step?.kind === "dialogue" && (
        <DialoguePlayer
          key={`${questId}-${progress.currentStep}`}
          tree={getDialogue(step.dialogueId)}
          onComplete={() => advanceQuestStep(questId)}
        />
      )}

      {!finishedAllSteps && step?.kind === "minigame" && (
        <MiniGameHost
          key={`${questId}-${progress.currentStep}`}
          config={step.minigame}
          onComplete={(result) => {
            setLastResult(result);
            recordMiniGameScore(questId, result.score);
            advanceQuestStep(questId);
          }}
        />
      )}

      {finishedAllSteps && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-xl rounded-3xl border border-gold-300 bg-white/90 p-8 text-center shadow-cozy-lg"
        >
          <motion.p
            className="text-6xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.15 }}
          >
            🌟
          </motion.p>
          <h2 className="mt-2 font-display text-2xl font-bold">Quest Complete!</h2>
          <p className="mt-1 text-ink-soft">{quest.title}</p>

          {lastResult && (
            <p className="mt-3 rounded-xl bg-sand-100 p-3 text-sm font-semibold">
              Performance: {progress.score}/100 — {lastResult.summary}
            </p>
          )}

          <div className="mt-5 space-y-2 text-left">
            <RewardRow icon="✨" label={`+${quest.rewards.experience} XP`} />
            {quest.rewards.statChanges?.map((c) => (
              <RewardRow
                key={c.stat}
                icon="📈"
                label={`${STAT_LABELS[c.stat]} +${c.amount}`}
              />
            ))}
            {quest.rewards.itemIds?.map((id) => {
              const item = getItem(id);
              return <RewardRow key={id} icon={item.icon} label={item.name} />;
            })}
          </div>

          <Button size="lg" className="mt-6 w-full" variant="gold" onClick={claimRewards}>
            {questId === "grand-inspection" ? "See the results…" : "Claim rewards"}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function RewardRow({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-sand-200 bg-sand-50 px-4 py-2">
      <span className="text-xl">{icon}</span>
      <span className="font-semibold">{label}</span>
    </div>
  );
}

function CenteredNote({
  emoji,
  title,
  action,
}: {
  emoji: string;
  title: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-sand-200 bg-white/85 p-8 text-center shadow-cozy">
      <p className="text-5xl">{emoji}</p>
      <p className="mt-3 font-display text-xl font-bold">{title}</p>
      <div className="mt-4">{action}</div>
    </div>
  );
}
