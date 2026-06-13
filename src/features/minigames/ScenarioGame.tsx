"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MiniGameResult } from "@/types";
import { audioManager } from "@/lib/audio/audioManager";
import { shuffle } from "@/utils/math";
import { MiniGameFrame, FeedbackPanel, qualityIsGood } from "./common";

export interface ScenarioRound {
  prompt: string;
  options: { text: string; quality: 0 | 1 | 2; feedback: string }[];
}

interface ScenarioGameProps {
  title: string;
  instructions: string;
  rounds: ScenarioRound[];
  /** Label above each scenario, e.g. "Situation" or "Moment". */
  roundLabel: string;
  onComplete: (result: MiniGameResult) => void;
}

/**
 * Judgment engine shared by Behavior Management, Micro-Teaching,
 * Portfolio Writing and the Ethics seminar: graded choices with feedback.
 */
export function ScenarioGame({
  title,
  instructions,
  rounds,
  roundLabel,
  onComplete,
}: ScenarioGameProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [totalQuality, setTotalQuality] = useState(0);

  // Shuffle once per mount: parents rebuild the rounds array on re-render,
  // so a memo keyed on it would reshuffle mid-game.
  const [shuffledOptions] = useState(() =>
    rounds.map((r) => shuffle(r.options.map((_, i) => i))),
  );

  const round = rounds[index];
  if (!round) return null;
  const order = shuffledOptions[index]!;
  const pickedOption = picked !== null ? round.options[picked] : null;

  const pick = (optionIndex: number) => {
    if (picked !== null) return;
    setPicked(optionIndex);
    const quality = round.options[optionIndex]!.quality;
    setTotalQuality((t) => t + quality);
    audioManager.play(quality === 2 ? "click" : "error");
  };

  const next = () => {
    if (index + 1 >= rounds.length) {
      const max = rounds.length * 2;
      const score = Math.round((totalQuality / max) * 100);
      onComplete({
        score,
        summary: `Judgment quality ${score}%`,
      });
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  };

  return (
    <MiniGameFrame
      title={title}
      instructions={instructions}
      progressValue={index + (picked !== null ? 1 : 0)}
      progressMax={rounds.length}
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-sand-200 bg-white/85 p-5 shadow-cozy"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-terra-500">
          {roundLabel} {index + 1} of {rounds.length}
        </p>
        <p className="mb-4 mt-1 text-lg leading-relaxed">{round.prompt}</p>
        <div className="flex flex-col gap-2">
          {order.map((optionIndex) => {
            const option = round.options[optionIndex]!;
            const chosen = picked === optionIndex;
            return (
              <button
                key={optionIndex}
                disabled={picked !== null}
                onClick={() => pick(optionIndex)}
                className={`rounded-xl border-2 p-3 text-left text-base transition-colors ${
                  chosen
                    ? option.quality === 2
                      ? "border-zellige-500 bg-zellige-500/10 font-semibold"
                      : option.quality === 1
                        ? "border-gold-500 bg-gold-500/10"
                        : "border-terra-500 bg-terra-500/10"
                    : picked !== null
                      ? "border-sand-200 bg-sand-100 text-ink-soft"
                      : "cursor-pointer border-sand-300 bg-white hover:border-zellige-500"
                }`}
              >
                {option.text}
              </button>
            );
          })}
        </div>
        {pickedOption && (
          <FeedbackPanel
            good={qualityIsGood(pickedOption.quality)}
            text={pickedOption.feedback}
            onNext={next}
            nextLabel={index + 1 >= rounds.length ? "Finish" : "Continue"}
          />
        )}
      </motion.div>
    </MiniGameFrame>
  );
}
