"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DialogueChoice, DialogueNode, DialogueTree } from "@/types";
import { NPC_INDEX } from "@/data/npcs";
import { useGameStore } from "@/stores/gameStore";
import { TEXT_SPEED_MS, useSettingsStore } from "@/stores/settingsStore";
import { audioManager } from "@/lib/audio/audioManager";
import { Portrait, NARRATOR_PORTRAIT, SELMA_PORTRAIT } from "@/components/ui/Portrait";
import { STAT_LABELS } from "@/utils/format";

interface SpeakerInfo {
  name: string;
  emoji: string;
  background: string;
}

function speakerInfo(speakerId: string): SpeakerInfo {
  if (speakerId === "selma") return { name: "Selma", ...SELMA_PORTRAIT };
  if (speakerId === "narrator") return { name: "Narrator", ...NARRATOR_PORTRAIT };
  const npc = NPC_INDEX[speakerId];
  if (npc) return { name: npc.name, emoji: npc.portrait.emoji, background: npc.portrait.background };
  return { name: speakerId, ...NARRATOR_PORTRAIT };
}

const MOOD_EMOJI: Record<NonNullable<DialogueNode["mood"]>, string> = {
  neutral: "",
  happy: "😊",
  worried: "😟",
  stern: "😐",
  proud: "🌟",
};

interface DialoguePlayerProps {
  tree: DialogueTree;
  onComplete: () => void;
}

/** Interactive dialogue scene with typewriter text and branching choices. */
export function DialoguePlayer({ tree, onComplete }: DialoguePlayerProps) {
  const [nodeId, setNodeId] = useState(tree.start);
  const [visibleChars, setVisibleChars] = useState(0);
  const textSpeed = useSettingsStore((s) => s.textSpeed);
  const applyDialogueEffects = useGameStore((s) => s.applyDialogueEffects);
  const stats = useGameStore((s) => s.snapshot?.player.stats);

  const node = tree.nodes[nodeId];

  useEffect(() => {
    setVisibleChars(0);
  }, [nodeId]);

  useEffect(() => {
    if (!node) return;
    if (visibleChars >= node.text.length) return;
    const timer = setTimeout(
      () => setVisibleChars((c) => Math.min(node.text.length, c + 1)),
      TEXT_SPEED_MS[textSpeed],
    );
    return () => clearTimeout(timer);
  }, [visibleChars, node, textSpeed]);

  const fullyTyped = node ? visibleChars >= node.text.length : true;

  const advance = useCallback(() => {
    if (!node) return;
    if (!fullyTyped) {
      setVisibleChars(node.text.length);
      return;
    }
    if (node.choices && node.choices.length > 0) return;
    audioManager.play("dialogue-advance");
    if (node.next) {
      setNodeId(node.next);
    } else {
      onComplete();
    }
  }, [node, fullyTyped, onComplete]);

  const pickChoice = useCallback(
    (choice: DialogueChoice) => {
      audioManager.play("dialogue-advance");
      applyDialogueEffects(
        choice.effects ?? [],
        choice.relationshipDelta ?? 0,
        tree.npcId,
        choice.decisionFlag,
      );
      if (choice.next) {
        setNodeId(choice.next);
      } else {
        onComplete();
      }
    },
    [applyDialogueEffects, tree.npcId, onComplete],
  );

  const choiceLocked = useMemo(
    () => (choice: DialogueChoice) => {
      if (!choice.requirement || !stats) return false;
      return stats[choice.requirement.stat] < choice.requirement.min;
    },
    [stats],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || !node) return;
      const hasChoices = fullyTyped && !!node.choices && node.choices.length > 0;
      if (event.key === " " || event.key === "Enter" || event.key.toLowerCase() === "e") {
        event.preventDefault();
        if (!hasChoices) advance();
        return;
      }
      if (hasChoices) {
        const num = Number.parseInt(event.key, 10);
        const choice = node.choices![num - 1];
        if (choice && !choiceLocked(choice)) pickChoice(choice);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [node, fullyTyped, advance, pickChoice, choiceLocked]);

  if (!node) {
    onComplete();
    return null;
  }

  const speaker = speakerInfo(node.speaker);
  const isNarrator = node.speaker === "narrator";
  const showChoices = fullyTyped && node.choices && node.choices.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 text-ink">
      <div
        className="min-h-64 cursor-pointer select-none rounded-2xl border border-sand-200 bg-white/85 p-6 shadow-cozy backdrop-blur"
        onClick={advance}
        role="button"
        aria-label="Advance dialogue"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={nodeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <Portrait emoji={speaker.emoji} background={speaker.background} size="md" />
              <div>
                <span className="block font-display text-lg font-bold text-ink">
                  {speaker.name}{" "}
                  {node.mood && node.mood !== "neutral" && (
                    <span className="text-base">{MOOD_EMOJI[node.mood]}</span>
                  )}
                </span>
                {tree.npcId && node.speaker === tree.npcId && NPC_INDEX[tree.npcId] && (
                  <span className="text-xs text-ink-soft">
                    {NPC_INDEX[tree.npcId]!.biography.split(".")[0]}.
                  </span>
                )}
              </div>
            </div>
            <p
              className={`text-lg leading-relaxed ${
                isNarrator ? "italic text-ink-soft" : "text-ink"
              }`}
            >
              {node.text.slice(0, visibleChars)}
              {!fullyTyped && <span className="animate-pulse-soft">▍</span>}
            </p>
          </motion.div>
        </AnimatePresence>

        {fullyTyped && !showChoices && (
          <motion.div
            className="mt-4 text-right text-sm font-semibold text-zellige-700"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            Space / click to continue ▸
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showChoices && (
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {node.choices!.map((choice, idx) => {
              const locked = choiceLocked(choice);
              return (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={locked ? undefined : { scale: 1.01, x: 4 }}
                  disabled={locked}
                  onClick={() => pickChoice(choice)}
                  className={`rounded-xl border-2 p-3.5 text-left text-base font-medium transition-colors ${
                    locked
                      ? "cursor-not-allowed border-sand-200 bg-sand-100 text-sand-500"
                      : "cursor-pointer border-sand-300 bg-white/90 text-ink hover:border-zellige-500 hover:bg-zellige-500/5"
                  }`}
                >
                  <span className="mr-2 font-bold text-zellige-700">{idx + 1}.</span>
                  {choice.text}
                  {choice.requirement && (
                    <span className="ml-2 text-xs font-bold text-terra-500">
                      [{STAT_LABELS[choice.requirement.stat]} {choice.requirement.min}+]
                    </span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
