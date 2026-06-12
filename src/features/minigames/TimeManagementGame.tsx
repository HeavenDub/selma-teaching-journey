"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { MiniGameResult, TimeManagementConfig } from "@/types";
import { audioManager } from "@/lib/audio/audioManager";
import { clamp } from "@/utils/math";
import { MiniGameFrame } from "./common";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface Props {
  config: TimeManagementConfig;
  onComplete: (result: MiniGameResult) => void;
}

const WORK_COST = 9;
const REST_GAIN = 26;

/**
 * The Observation Sheet Factory: race the clock, but tired hands write
 * slowly — progress per click scales with remaining energy.
 */
export function TimeManagementGame({ config, onComplete }: Props) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [energy, setEnergy] = useState(80);
  const [sheetProgress, setSheetProgress] = useState(0);
  const [sheetsDone, setSheetsDone] = useState(0);
  const [finished, setFinished] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!started || finished) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  const targetReached = sheetsDone >= config.sheetTarget;

  useEffect(() => {
    if (finishedRef.current) return;
    if ((timeLeft === 0 && started) || targetReached) {
      finishedRef.current = true;
      setFinished(true);
    }
  }, [timeLeft, targetReached, started]);

  const work = () => {
    if (finished || !started) return;
    // Tired hands: 100% energy ≈ 34% of a sheet per click; near zero ≈ 8%.
    const gain = 8 + (energy / 100) * 26;
    setEnergy((e) => clamp(e - WORK_COST, 0, 100));
    setSheetProgress((p) => {
      const next = p + gain;
      if (next >= 100) {
        setSheetsDone((s) => s + 1);
        audioManager.play("click");
        return next - 100;
      }
      return next;
    });
  };

  const rest = () => {
    if (finished || !started) return;
    setEnergy((e) => clamp(e + REST_GAIN, 0, 100));
    audioManager.play("dialogue-advance");
  };

  const finish = () => {
    const score = Math.round((Math.min(sheetsDone, config.sheetTarget) / config.sheetTarget) * 100);
    onComplete({
      score,
      summary: `${sheetsDone}/${config.sheetTarget} sheets archived${
        targetReached ? ` with ${timeLeft}s to spare` : ""
      }`,
    });
  };

  return (
    <MiniGameFrame
      title={config.title}
      instructions={config.instructions}
      progressValue={sheetsDone}
      progressMax={config.sheetTarget}
    >
      {!started ? (
        <div className="rounded-2xl border border-sand-200 bg-white/85 p-8 text-center shadow-cozy">
          <p className="text-5xl">📋⏰</p>
          <p className="mx-auto mt-3 max-w-md text-ink-soft">
            {config.sheetTarget} sheets. {config.timeLimit} seconds. Si Brahim's advice:
            working tired is slower than resting smart.
          </p>
          <Button className="mt-5" size="lg" onClick={() => setStarted(true)}>
            Pick up the good pens
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="rounded-2xl border border-sand-200 bg-white/85 p-5 shadow-cozy">
            <div className="mb-4 flex items-center justify-between">
              <span
                className={`font-display text-3xl font-bold ${
                  timeLeft <= 10 ? "text-terra-700" : "text-ink"
                }`}
              >
                ⏱ {timeLeft}s
              </span>
              <span className="font-display text-xl font-bold text-zellige-700">
                📋 {sheetsDone}/{config.sheetTarget}
              </span>
            </div>

            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
              Current sheet
            </p>
            <ProgressBar value={sheetProgress} color="var(--color-majorelle-500)" />

            <p className="mb-1 mt-4 text-xs font-bold uppercase tracking-wide text-ink-soft">
              Energy {energy <= 25 && <span className="text-terra-700">— exhausted, slow writing!</span>}
            </p>
            <ProgressBar
              value={energy}
              color={energy > 50 ? "var(--color-zellige-500)" : energy > 25 ? "var(--color-gold-500)" : "var(--color-terra-500)"}
            />

            {!finished ? (
              <div className="mt-6 flex gap-3">
                <motion.div whileTap={{ scale: 0.94 }} className="flex-1">
                  <Button className="w-full" size="lg" onClick={work}>
                    ✍️ Write!
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 0.94 }} className="flex-1">
                  <Button className="w-full" size="lg" variant="secondary" onClick={rest}>
                    🍵 Sip tea
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-zellige-300 bg-zellige-500/10 p-4 text-center"
              >
                <p className="font-display text-lg font-bold text-zellige-700">
                  {targetReached
                    ? "All sheets archived before five o'clock! 🎉"
                    : `Time's up — ${sheetsDone} of ${config.sheetTarget} sheets made it.`}
                </p>
                <Button className="mt-3" onClick={finish}>
                  Hand the stack to Si Brahim
                </Button>
              </motion.div>
            )}
          </div>

          <div className="hidden w-40 flex-col items-center justify-center rounded-2xl border border-sand-200 bg-white/85 p-4 text-center shadow-cozy sm:flex">
            <motion.span
              className="text-5xl"
              animate={energy <= 25 ? { rotate: [0, 4, -4, 0] } : { y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: energy <= 25 ? 0.5 : 1.4 }}
            >
              {energy > 50 ? "👩🏽‍🏫" : energy > 25 ? "😮‍💨" : "🥱"}
            </motion.span>
            <p className="mt-2 text-xs text-ink-soft">
              {energy > 50
                ? "Selma is in the zone."
                : energy > 25
                  ? "The hand is cramping…"
                  : "Tea. She needs tea."}
            </p>
          </div>
        </div>
      )}
    </MiniGameFrame>
  );
}
