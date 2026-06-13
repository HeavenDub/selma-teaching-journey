"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MiniGameResult, QuizQuestion } from "@/types";
import { audioManager } from "@/lib/audio/audioManager";
import { shuffle } from "@/utils/math";
import { MiniGameFrame, FeedbackPanel } from "./common";

interface QuizGameProps {
  title: string;
  instructions: string;
  questions: QuizQuestion[];
  onComplete: (result: MiniGameResult) => void;
}

/** Generic multiple-choice engine (Grammar Challenge & friends). */
export function QuizGame({ title, instructions, questions, onComplete }: QuizGameProps) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const question = questions[index];
  // Shuffle once per mount so re-renders never reorder the options.
  const [shuffledOrder] = useState(() =>
    questions.map((q) => shuffle(q.options.map((_, i) => i))),
  );

  if (!question) return null;
  const order = shuffledOrder[index]!;
  const isCorrect = picked !== null && picked === question.correctIndex;

  const pick = (optionIndex: number) => {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (optionIndex === question.correctIndex) {
      setCorrectCount((c) => c + 1);
      audioManager.play("click");
    } else {
      audioManager.play("error");
    }
  };

  const next = () => {
    const finalCorrect = correctCount;
    if (index + 1 >= questions.length) {
      const score = Math.round((finalCorrect / questions.length) * 100);
      onComplete({
        score,
        summary: `${finalCorrect} of ${questions.length} answers correct`,
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
      progressMax={questions.length}
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-sand-200 bg-white/85 p-5 shadow-cozy"
      >
        <p className="mb-4 text-lg font-semibold">
          <span className="mr-2 text-ink-soft">
            Q{index + 1}/{questions.length}
          </span>
          {question.prompt}
        </p>
        <div className="flex flex-col gap-2">
          {order.map((optionIndex) => {
            const text = question.options[optionIndex]!;
            const chosen = picked === optionIndex;
            const showCorrect = picked !== null && optionIndex === question.correctIndex;
            return (
              <button
                key={optionIndex}
                disabled={picked !== null}
                onClick={() => pick(optionIndex)}
                className={`rounded-xl border-2 p-3 text-left text-base transition-colors ${
                  showCorrect
                    ? "border-zellige-500 bg-zellige-500/10 font-semibold"
                    : chosen
                      ? "border-terra-500 bg-terra-500/10"
                      : picked !== null
                        ? "border-sand-200 bg-sand-100 text-ink-soft"
                        : "cursor-pointer border-sand-300 bg-white hover:border-zellige-500"
                }`}
              >
                {text}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <FeedbackPanel
            good={isCorrect}
            text={question.explanation}
            onNext={next}
            nextLabel={index + 1 >= questions.length ? "Finish" : "Next question"}
          />
        )}
      </motion.div>
    </MiniGameFrame>
  );
}
