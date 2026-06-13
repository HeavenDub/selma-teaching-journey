"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LessonSequenceConfig, MiniGameResult } from "@/types";
import { audioManager } from "@/lib/audio/audioManager";
import { shuffle } from "@/utils/math";
import { MiniGameFrame } from "./common";
import { Button } from "@/components/ui/Button";

interface Props {
  config: LessonSequenceConfig;
  onComplete: (result: MiniGameResult) => void;
}

/** Click stages in the correct pedagogical order. Mistakes cost score. */
export function LessonSequenceGame({ config, onComplete }: Props) {
  // Shuffle once per mount so re-renders never reorder the stages.
  const [stages] = useState(() => shuffle(config.correctOrder));
  const [placed, setPlaced] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const nextExpected = config.correctOrder[placed.length];
  const done = placed.length === config.correctOrder.length;

  const pick = (stageId: string) => {
    if (!nextExpected || placed.includes(stageId)) return;
    if (stageId === nextExpected.id) {
      setPlaced([...placed, stageId]);
      audioManager.play("click");
    } else {
      setMistakes((m) => m + 1);
      setShakeId(stageId);
      audioManager.play("error");
      setTimeout(() => setShakeId(null), 400);
    }
  };

  const finish = () => {
    const score = Math.max(20, 100 - mistakes * 12);
    onComplete({
      score,
      summary:
        mistakes === 0
          ? "A flawless lesson plan — every stage in its place"
          : `Lesson assembled with ${mistakes} misstep${mistakes === 1 ? "" : "s"}`,
    });
  };

  return (
    <MiniGameFrame
      title={config.title}
      instructions={config.instructions}
      progressValue={placed.length}
      progressMax={config.correctOrder.length}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-sand-200 bg-white/85 p-4 shadow-cozy">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-soft">
            Stage cards (pick what comes next)
          </h3>
          <div className="flex flex-col gap-2">
            {stages.map((stage) => {
              const used = placed.includes(stage.id);
              return (
                <motion.button
                  key={stage.id}
                  disabled={used}
                  animate={shakeId === stage.id ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
                  onClick={() => pick(stage.id)}
                  className={`rounded-xl border-2 p-3 text-left transition-colors ${
                    used
                      ? "border-sand-200 bg-sand-100 opacity-40"
                      : "cursor-pointer border-sand-300 bg-white hover:border-zellige-500"
                  }`}
                >
                  <span className="block font-bold">{stage.label}</span>
                  <span className="block text-sm text-ink-soft">{stage.detail}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-sand-200 bg-white/85 p-4 shadow-cozy">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-soft">
            Your lesson plan
          </h3>
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {placed.map((id, idx) => {
                const stage = config.correctOrder.find((s) => s.id === id)!;
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 rounded-xl border-2 border-zellige-300 bg-zellige-500/10 p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zellige-500 text-sm font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{stage.label}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {!done && (
              <div className="rounded-xl border-2 border-dashed border-sand-300 p-3 text-center text-sm text-ink-soft">
                Stage {placed.length + 1} goes here…
              </div>
            )}
          </div>
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <p className="font-display text-lg font-bold text-zellige-700">
                The lesson flows from warm-up to wrap-up! ✨
              </p>
              <Button className="mt-3" onClick={finish}>
                Teach it
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </MiniGameFrame>
  );
}
