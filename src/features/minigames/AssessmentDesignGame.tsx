"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { AssessmentDesignConfig, MiniGameResult } from "@/types";
import { audioManager } from "@/lib/audio/audioManager";
import { shuffle } from "@/utils/math";
import { MiniGameFrame } from "./common";
import { Button } from "@/components/ui/Button";

interface Props {
  config: AssessmentDesignConfig;
  onComplete: (result: MiniGameResult) => void;
}

const BUCKETS = [
  { id: "assessment", label: "Assessment", icon: "🌡️", hint: "Ongoing checks during learning" },
  { id: "evaluation", label: "Evaluation", icon: "⚖️", hint: "Judging level against criteria" },
  { id: "testing", label: "Testing", icon: "📝", hint: "A specific measuring instrument" },
] as const;

/** Sort each concept card into Assessment / Evaluation / Testing. */
export function AssessmentDesignGame({ config, onComplete }: Props) {
  // Shuffle once per mount so re-renders never reorder the cards.
  const [items] = useState(() => shuffle(config.items));
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [lastResult, setLastResult] = useState<{ good: boolean; bucket: string } | null>(null);

  const item = items[index];
  const finished = index >= items.length;

  const sort = (bucketId: string) => {
    if (!item || lastResult) return;
    const good = item.bucket === bucketId;
    if (good) {
      setCorrect((c) => c + 1);
      audioManager.play("click");
    } else {
      audioManager.play("error");
    }
    setLastResult({ good, bucket: item.bucket });
    setTimeout(() => {
      setLastResult(null);
      setIndex((i) => i + 1);
    }, good ? 600 : 1600);
  };

  const finish = () => {
    const score = Math.round((correct / items.length) * 100);
    onComplete({
      score,
      summary: `${correct} of ${items.length} concepts sorted correctly`,
    });
  };

  return (
    <MiniGameFrame
      title={config.title}
      instructions={config.instructions}
      progressValue={index}
      progressMax={items.length}
    >
      {!finished && item ? (
        <div>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -16, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            className="mx-auto mb-5 max-w-xl rounded-2xl border-2 border-gold-500 bg-white p-6 text-center shadow-cozy-lg"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Concept {index + 1} of {items.length}
            </p>
            <p className="mt-2 text-lg font-semibold">{item.text}</p>
            {lastResult && (
              <p
                className={`mt-3 text-sm font-bold ${
                  lastResult.good ? "text-zellige-700" : "text-terra-700"
                }`}
              >
                {lastResult.good
                  ? "Correct bucket!"
                  : `Mr. Tahiri's green pen: this one is ${lastResult.bucket}.`}
              </p>
            )}
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-3">
            {BUCKETS.map((bucket) => (
              <motion.button
                key={bucket.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={lastResult !== null}
                onClick={() => sort(bucket.id)}
                className="cursor-pointer rounded-2xl border-2 border-sand-300 bg-white/85 p-5 text-center shadow-cozy transition-colors hover:border-zellige-500 disabled:cursor-default"
              >
                <span className="block text-3xl">{bucket.icon}</span>
                <span className="mt-1 block font-display text-lg font-bold">{bucket.label}</span>
                <span className="mt-1 block text-xs text-ink-soft">{bucket.hint}</span>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-zellige-300 bg-zellige-500/10 p-6 text-center"
        >
          <p className="font-display text-xl font-bold text-zellige-700">
            Toolbox sorted: {correct}/{items.length}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Assessment watches, evaluation judges, testing measures.
          </p>
          <Button className="mt-4" onClick={finish}>
            Show Mr. Tahiri
          </Button>
        </motion.div>
      )}
    </MiniGameFrame>
  );
}
