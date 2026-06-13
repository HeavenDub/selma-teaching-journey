"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { FinalInspectionConfig, MiniGameResult } from "@/types";
import { audioManager } from "@/lib/audio/audioManager";
import { shuffle } from "@/utils/math";
import { MiniGameFrame, FeedbackPanel } from "./common";
import { Button } from "@/components/ui/Button";

interface Props {
  config: FinalInspectionConfig;
  onComplete: (result: MiniGameResult) => void;
}

/** The Grand Teaching Inspection: six named sections, one verdict. */
export function FinalInspectionGame({ config, onComplete }: Props) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [sectionCorrect, setSectionCorrect] = useState(0);
  const [sectionResults, setSectionResults] = useState<number[]>([]);
  const [betweenSections, setBetweenSections] = useState(false);

  // Shuffle once per mount so re-renders never reorder the options.
  const [optionOrders] = useState(() =>
    config.sections.map((s) =>
      s.questions.map((q) => shuffle(q.options.map((_, i) => i))),
    ),
  );

  const section = config.sections[sectionIndex];
  if (!section) return null;
  const question = section.questions[questionIndex];
  const totalQuestions = config.sections.reduce((a, s) => a + s.questions.length, 0);
  const answeredSoFar =
    config.sections.slice(0, sectionIndex).reduce((a, s) => a + s.questions.length, 0) +
    questionIndex +
    (picked !== null ? 1 : 0);

  const pick = (optionIndex: number) => {
    if (picked !== null || !question) return;
    setPicked(optionIndex);
    if (optionIndex === question.correctIndex) {
      setSectionCorrect((c) => c + 1);
      audioManager.play("click");
    } else {
      audioManager.play("error");
    }
  };

  const next = () => {
    if (!question) return;
    if (questionIndex + 1 < section.questions.length) {
      setQuestionIndex(questionIndex + 1);
      setPicked(null);
      return;
    }
    // Section finished.
    const sectionScore = Math.round((sectionCorrect / section.questions.length) * 100);
    const results = [...sectionResults, sectionScore];
    setSectionResults(results);
    if (sectionIndex + 1 < config.sections.length) {
      setBetweenSections(true);
    } else {
      const score = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
      onComplete({
        score,
        summary: `Inspection sections averaged ${score}%`,
      });
    }
  };

  const startNextSection = () => {
    setSectionIndex(sectionIndex + 1);
    setQuestionIndex(0);
    setSectionCorrect(0);
    setPicked(null);
    setBetweenSections(false);
  };

  if (betweenSections) {
    const lastScore = sectionResults[sectionResults.length - 1] ?? 0;
    const nextSection = config.sections[sectionIndex + 1]!;
    return (
      <MiniGameFrame
        title={config.title}
        instructions={config.instructions}
        progressValue={answeredSoFar}
        progressMax={totalQuestions}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-sand-200 bg-white/85 p-8 text-center shadow-cozy"
        >
          <p className="text-4xl">{lastScore >= 67 ? "📗" : "📙"}</p>
          <h3 className="mt-2 font-display text-xl font-bold">
            Section complete: {section.name} — {lastScore}%
          </h3>
          <p className="mt-2 text-sm text-ink-soft">
            Inspector Tazi turns the page without expression. The next section awaits.
          </p>
          <div className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-2">
            {config.sections.map((s, i) => (
              <span
                key={s.name}
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  i < sectionResults.length
                    ? "bg-zellige-500 text-white"
                    : i === sectionIndex + 1
                      ? "bg-gold-500 text-ink"
                      : "bg-sand-200 text-ink-soft"
                }`}
              >
                {s.name}
              </span>
            ))}
          </div>
          <Button className="mt-6" size="lg" onClick={startNextSection}>
            Begin: {nextSection.name}
          </Button>
        </motion.div>
      </MiniGameFrame>
    );
  }

  if (!question) return null;
  const isCorrect = picked !== null && picked === question.correctIndex;

  return (
    <MiniGameFrame
      title={config.title}
      instructions={config.instructions}
      progressValue={answeredSoFar}
      progressMax={totalQuestions}
    >
      <motion.div
        key={`${sectionIndex}-${questionIndex}`}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-sand-200 bg-white/85 p-5 shadow-cozy"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-majorelle-500">
          Section {sectionIndex + 1}/{config.sections.length}: {section.name} · Question{" "}
          {questionIndex + 1}/{section.questions.length}
        </p>
        <p className="mb-4 mt-1 text-lg font-semibold leading-relaxed">{question.prompt}</p>
        <div className="flex flex-col gap-2">
          {(optionOrders[sectionIndex]?.[questionIndex] ?? question.options.map((_, i) => i)).map((optionIndex) => {
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
            nextLabel={
              questionIndex + 1 >= section.questions.length
                ? sectionIndex + 1 >= config.sections.length
                  ? "Submit the inspection"
                  : "Close this section"
                : "Next question"
            }
          />
        )}
      </motion.div>
    </MiniGameFrame>
  );
}
