"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MiniGameResult, VocabularyMatchingConfig } from "@/types";
import { audioManager } from "@/lib/audio/audioManager";
import { shuffle } from "@/utils/math";
import { MiniGameFrame } from "./common";
import { Button } from "@/components/ui/Button";

interface Props {
  config: VocabularyMatchingConfig;
  onComplete: (result: MiniGameResult) => void;
}

/** Match each word to its picture; wrong attempts cost score. */
export function VocabularyMatchingGame({ config, onComplete }: Props) {
  // Shuffle once per mount so re-renders never reorder the boards.
  const [words] = useState(() => shuffle(config.pairs.map((p) => p.word)));
  const [emojis] = useState(() => shuffle(config.pairs));
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [shakeWord, setShakeWord] = useState<string | null>(null);

  const allMatched = matched.size === config.pairs.length;

  const tryMatch = (emojiWord: string) => {
    if (!selectedWord || matched.has(emojiWord)) return;
    if (selectedWord === emojiWord) {
      const next = new Set(matched);
      next.add(emojiWord);
      setMatched(next);
      setSelectedWord(null);
      audioManager.play("click");
    } else {
      setWrongAttempts((w) => w + 1);
      setShakeWord(selectedWord);
      setSelectedWord(null);
      audioManager.play("error");
      setTimeout(() => setShakeWord(null), 400);
    }
  };

  const finish = () => {
    const score = Math.max(20, 100 - wrongAttempts * 9);
    onComplete({
      score,
      summary:
        wrongAttempts === 0
          ? "A perfect matching round — every hand stayed up!"
          : `Matched all pairs with ${wrongAttempts} wrong attempt${wrongAttempts === 1 ? "" : "s"}`,
    });
  };

  return (
    <MiniGameFrame
      title={config.title}
      instructions={config.instructions}
      progressValue={matched.size}
      progressMax={config.pairs.length}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-sand-200 bg-white/85 p-4 shadow-cozy">
          <h3 className="mb-3 text-center text-sm font-bold uppercase tracking-wider text-ink-soft">
            Words
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {words.map((word) => {
              const done = matched.has(word);
              return (
                <motion.button
                  key={word}
                  disabled={done}
                  animate={shakeWord === word ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
                  onClick={() => setSelectedWord(selectedWord === word ? null : word)}
                  className={`rounded-xl border-2 px-4 py-2 font-semibold transition-colors ${
                    done
                      ? "border-zellige-300 bg-zellige-500/10 text-zellige-700 line-through opacity-60"
                      : selectedWord === word
                        ? "border-terra-500 bg-terra-500/10"
                        : "cursor-pointer border-sand-300 bg-white hover:border-terra-300"
                  }`}
                >
                  {word}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-sand-200 bg-white/85 p-4 shadow-cozy">
          <h3 className="mb-3 text-center text-sm font-bold uppercase tracking-wider text-ink-soft">
            Pictures
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {emojis.map((pair) => {
              const done = matched.has(pair.word);
              return (
                <motion.button
                  key={pair.word}
                  disabled={done || !selectedWord}
                  whileHover={!done && selectedWord ? { scale: 1.1 } : undefined}
                  onClick={() => tryMatch(pair.word)}
                  className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 text-3xl transition-colors ${
                    done
                      ? "border-zellige-300 bg-zellige-500/10 opacity-60"
                      : selectedWord
                        ? "cursor-pointer border-sand-300 bg-white hover:border-zellige-500"
                        : "border-sand-200 bg-sand-100"
                  }`}
                >
                  {done ? "✓" : pair.emoji}
                </motion.button>
              );
            })}
          </div>
          <p className="mt-3 text-center text-xs text-ink-soft">
            {selectedWord
              ? `Find the picture for “${selectedWord}”`
              : "Pick a word first, then its picture"}
          </p>
        </div>
      </div>

      {allMatched && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-zellige-300 bg-zellige-500/10 p-4 text-center"
        >
          <p className="font-display text-lg font-bold text-zellige-700">
            All pairs matched! The class is buzzing. 🎉
          </p>
          <Button className="mt-3" onClick={finish}>
            Finish the activity
          </Button>
        </motion.div>
      )}
    </MiniGameFrame>
  );
}
