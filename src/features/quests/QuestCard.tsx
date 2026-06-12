"use client";

import { useRouter } from "next/navigation";
import type { QuestDefinition, QuestProgress } from "@/types";
import { QUEST_CATEGORY_LABELS, QUEST_INDEX } from "@/data/quests";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const STATUS_BADGES: Record<QuestProgress["status"], { label: string; color: string }> = {
  locked: { label: "🔒 Locked", color: "var(--color-ink-soft)" },
  available: { label: "✨ Available", color: "var(--color-gold-700)" },
  active: { label: "▶ In Progress", color: "var(--color-terra-500)" },
  completed: { label: "✓ Completed", color: "var(--color-zellige-500)" },
};

interface QuestCardProps {
  quest: QuestDefinition;
  progress: QuestProgress;
  /** Show the full story text (quest log) instead of the summary. */
  expanded?: boolean;
}

export function QuestCard({ quest, progress, expanded = false }: QuestCardProps) {
  const router = useRouter();
  const status = STATUS_BADGES[progress.status];
  const playable = progress.status === "available" || progress.status === "active";

  const lockedReason =
    progress.status === "locked" && quest.prerequisites?.length
      ? `Requires: ${quest.prerequisites.map((id) => QUEST_INDEX[id]?.title ?? id).join(", ")}`
      : null;

  return (
    <Card className={`p-5 ${progress.status === "locked" ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-bold">{quest.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge color="var(--color-majorelle-500)">
              {QUEST_CATEGORY_LABELS[quest.category]}
            </Badge>
            <span className="text-xs font-bold text-gold-700" title={`Difficulty ${quest.difficulty}/5`}>
              {"★".repeat(quest.difficulty)}
              <span className="text-sand-300">{"★".repeat(5 - quest.difficulty)}</span>
            </span>
          </div>
        </div>
        <Badge color={status.color}>{status.label}</Badge>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        {expanded ? quest.story : quest.summary}
      </p>

      {expanded && (
        <ul className="mt-3 space-y-1">
          {quest.objectives.map((o) => (
            <li key={o.id} className="flex items-start gap-2 text-sm">
              <span className={progress.status === "completed" ? "text-zellige-500" : "text-sand-400"}>
                {progress.status === "completed" ? "☑" : "☐"}
              </span>
              {o.description}
            </li>
          ))}
        </ul>
      )}

      {lockedReason && <p className="mt-3 text-xs font-semibold text-terra-700">{lockedReason}</p>}

      {progress.status === "completed" && (
        <p className="mt-3 text-xs font-bold text-zellige-700">
          Performance: {progress.score}/100
        </p>
      )}

      {playable && (
        <Button
          size="sm"
          className="mt-4"
          onClick={() => router.push(`/quest/${quest.id}`)}
        >
          {progress.status === "active" ? "Continue quest" : "Begin quest"}
        </Button>
      )}
    </Card>
  );
}
