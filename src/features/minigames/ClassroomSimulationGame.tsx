"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { ClassroomSimulationConfig, MiniGameResult } from "@/types";
import { audioManager } from "@/lib/audio/audioManager";
import { clamp, shuffle } from "@/utils/math";
import { MiniGameFrame, FeedbackPanel } from "./common";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface Props {
  config: ClassroomSimulationConfig;
  onComplete: (result: MiniGameResult) => void;
}

/** Live simulation balancing two meters: Engagement and Order. */
export function ClassroomSimulationGame({ config, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [engagement, setEngagement] = useState(60);
  const [order, setOrder] = useState(60);
  const [picked, setPicked] = useState<number | null>(null);

  const shuffled = useMemo(
    () => config.events.map((e) => shuffle(e.options.map((_, i) => i))),
    [config],
  );

  const event = config.events[index];
  if (!event) return null;
  const optionOrder = shuffled[index]!;
  const pickedOption = picked !== null ? event.options[picked] : null;

  const pick = (optionIndex: number) => {
    if (picked !== null) return;
    const option = event.options[optionIndex]!;
    setPicked(optionIndex);
    setEngagement((e) => clamp(e + option.engagementDelta, 0, 100));
    setOrder((o) => clamp(o + option.orderDelta, 0, 100));
    audioManager.play(option.engagementDelta + option.orderDelta > 0 ? "click" : "error");
  };

  const next = () => {
    if (index + 1 >= config.events.length) {
      const score = Math.round((engagement + order) / 2);
      onComplete({
        score,
        summary: `Day ended with engagement ${engagement} and order ${order}`,
      });
    } else {
      setIndex(index + 1);
      setPicked(null);
    }
  };

  return (
    <MiniGameFrame
      title={config.title}
      instructions={config.instructions}
      progressValue={index + (picked !== null ? 1 : 0)}
      progressMax={config.events.length}
    >
      <div className="mb-4 grid grid-cols-2 gap-4 rounded-2xl border border-sand-200 bg-white/85 p-4 shadow-cozy">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
            🎉 Engagement {engagement}
          </p>
          <ProgressBar value={engagement} color="var(--color-terra-500)" />
        </div>
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
            🧭 Order {order}
          </p>
          <ProgressBar value={order} color="var(--color-majorelle-500)" />
        </div>
      </div>

      <motion.div
        key={index}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-sand-200 bg-white/85 p-5 shadow-cozy"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-terra-500">
          Event {index + 1} of {config.events.length}
        </p>
        <p className="mb-4 mt-1 text-lg leading-relaxed">{event.description}</p>
        <div className="flex flex-col gap-2">
          {optionOrder.map((optionIndex) => {
            const option = event.options[optionIndex]!;
            const chosen = picked === optionIndex;
            return (
              <button
                key={optionIndex}
                disabled={picked !== null}
                onClick={() => pick(optionIndex)}
                className={`rounded-xl border-2 p-3 text-left text-base transition-colors ${
                  chosen
                    ? "border-zellige-500 bg-zellige-500/10 font-semibold"
                    : picked !== null
                      ? "border-sand-200 bg-sand-100 text-ink-soft"
                      : "cursor-pointer border-sand-300 bg-white hover:border-zellige-500"
                }`}
              >
                {option.text}
                {chosen && (
                  <span className="mt-1 block text-xs font-bold text-ink-soft">
                    Engagement {option.engagementDelta >= 0 ? "+" : ""}
                    {option.engagementDelta} · Order {option.orderDelta >= 0 ? "+" : ""}
                    {option.orderDelta}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {pickedOption && (
          <FeedbackPanel
            good={pickedOption.engagementDelta + pickedOption.orderDelta > 5}
            text={pickedOption.feedback}
            onNext={next}
            nextLabel={index + 1 >= config.events.length ? "End the day" : "Next event"}
          />
        )}
      </motion.div>
    </MiniGameFrame>
  );
}
