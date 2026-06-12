"use client";

import { useParams } from "next/navigation";
import { QuestRunner } from "@/features/quests/QuestRunner";

export default function QuestPage() {
  const params = useParams<{ questId: string }>();
  return <QuestRunner questId={params.questId} />;
}
