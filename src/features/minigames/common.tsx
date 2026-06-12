"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function MiniGameFrame({
  title,
  instructions,
  progressValue,
  progressMax,
  children,
}: {
  title: string;
  instructions: string;
  progressValue?: number;
  progressMax?: number;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-4 rounded-2xl border border-sand-200 bg-white/85 p-5 shadow-cozy">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{instructions}</p>
        {progressValue !== undefined && progressMax !== undefined && (
          <ProgressBar
            value={progressValue}
            max={progressMax}
            className="mt-3"
            color="var(--color-terra-500)"
          />
        )}
      </div>
      {children}
    </div>
  );
}

/** Feedback banner shown after answering a round. */
export function FeedbackPanel({
  good,
  text,
  onNext,
  nextLabel,
}: {
  good: boolean;
  text: string;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 rounded-xl border-l-4 p-4 ${
        good
          ? "border-zellige-500 bg-zellige-500/10"
          : "border-terra-500 bg-terra-500/10"
      }`}
    >
      <p className="text-sm font-medium text-ink">
        <span className="mr-1 text-lg">{good ? "✅" : "💡"}</span>
        {text}
      </p>
      <div className="mt-3 text-right">
        <Button size="sm" onClick={onNext}>
          {nextLabel}
        </Button>
      </div>
    </motion.div>
  );
}

export function qualityIsGood(quality: number): boolean {
  return quality === 2;
}
