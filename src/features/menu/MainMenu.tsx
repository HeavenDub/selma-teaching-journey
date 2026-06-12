"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { SaveSlotMeta } from "@/types";
import { useGameStore } from "@/stores/gameStore";
import { latestSave, listAllSaves, loadFromSlot } from "@/lib/save/saveSystem";
import { useCityMusic } from "@/hooks/useCityMusic";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { NotificationToaster } from "@/components/ui/NotificationToaster";
import { formatDate } from "@/utils/format";
import { CITIES } from "@/data/cities";

export function MainMenu() {
  const router = useRouter();
  const newGame = useGameStore((s) => s.newGame);
  const loadSnapshot = useGameStore((s) => s.loadSnapshot);
  const [continueMeta, setContinueMeta] = useState<SaveSlotMeta | null>(null);
  const [allSaves, setAllSaves] = useState<SaveSlotMeta[]>([]);
  const [loadOpen, setLoadOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  useCityMusic("menu");

  useEffect(() => {
    setContinueMeta(latestSave());
    setAllSaves(listAllSaves());
  }, []);

  const startNew = () => {
    newGame();
    router.push("/game");
  };

  const continueGame = () => {
    if (!continueMeta) return;
    const snapshot = loadFromSlot(continueMeta.slotId);
    if (snapshot) {
      loadSnapshot(snapshot);
      router.push("/game");
    }
  };

  const loadSlot = (slotId: string) => {
    const snapshot = loadFromSlot(slotId);
    if (snapshot) {
      loadSnapshot(snapshot);
      router.push("/game");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-10">
      <NotificationToaster />

      {/* Floating ambient decorations */}
      {["🏺", "🏰", "🎨", "🌾", "🕌", "🏙️", "📚", "✏️", "🍎"].map((emoji, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute select-none text-4xl opacity-15"
          style={{
            left: `${(i * 137) % 90 + 4}%`,
            top: `${(i * 71) % 80 + 8}%`,
          }}
          animate={{ y: [0, -16, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
          transition={{ repeat: Infinity, duration: 5 + (i % 4), delay: i * 0.4 }}
        >
          {emoji}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <motion.p
          className="text-7xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          👩🏽‍🏫
        </motion.p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
          Selma's
          <span className="block bg-gradient-to-r from-terra-500 via-gold-700 to-zellige-500 bg-clip-text text-transparent">
            Teaching Journey
          </span>
        </h1>
        <p className="mt-3 text-ink-soft">
          From nervous CRMEF trainee in Safi to certified English teacher in Casablanca —
          one city, one lesson, one small victory at a time.
        </p>

        <div className="mt-4 flex items-center justify-center gap-1 text-lg" aria-hidden>
          {CITIES.map((c, i) => (
            <span key={c.id} className="flex items-center">
              <span title={c.name}>{c.emblem}</span>
              {i < CITIES.length - 1 && <span className="mx-0.5 text-sand-400">·</span>}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {continueMeta && (
            <Button size="lg" variant="gold" onClick={continueGame}>
              ▶ Continue — Lv {continueMeta.level}, {continueMeta.cityName}
              <span className="block text-xs font-normal opacity-80">
                {formatDate(continueMeta.savedAt)}
              </span>
            </Button>
          )}
          <Button size="lg" onClick={startNew}>
            🌱 New Game
          </Button>
          <Button size="lg" variant="secondary" disabled={allSaves.length === 0} onClick={() => setLoadOpen(true)}>
            📂 Load Game
          </Button>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => router.push("/settings")}>
              ⚙️ Settings
            </Button>
            <Button variant="ghost" className="flex-1" onClick={() => setCreditsOpen(true)}>
              ✨ Credits
            </Button>
          </div>
        </div>
      </motion.div>

      <Modal open={loadOpen} onClose={() => setLoadOpen(false)} title="Load Game">
        {allSaves.length === 0 ? (
          <p className="text-ink-soft">No saves found yet.</p>
        ) : (
          <div className="space-y-3">
            {allSaves.map((meta) => (
              <button
                key={meta.slotId}
                onClick={() => loadSlot(meta.slotId)}
                className="w-full cursor-pointer rounded-xl border-2 border-sand-300 bg-white p-4 text-left transition-colors hover:border-zellige-500"
              >
                <p className="font-bold">
                  {meta.label}
                  {meta.ngPlusCycle > 0 && (
                    <span className="ml-2 text-xs font-bold text-terra-500">NG+{meta.ngPlusCycle}</span>
                  )}
                </p>
                <p className="text-xs text-ink-soft">
                  Level {meta.level} · {meta.cityName} · {meta.questsCompleted} quests completed ·{" "}
                  {formatDate(meta.savedAt)}
                </p>
              </button>
            ))}
          </div>
        )}
      </Modal>

      <Modal open={creditsOpen} onClose={() => setCreditsOpen(false)} title="Credits">
        <div className="space-y-3 text-sm leading-relaxed text-ink-soft">
          <p>
            <strong className="text-ink">Selma's Teaching Journey</strong> — a wholesome
            educational RPG inspired by the real path of Moroccan English teacher trainees:
            CRMEF Safi, the internship road through El Jadida, Azemmour, Bir Jdid and Had
            Soualem, and the dream of a Casablanca classroom.
          </p>
    
          <p className="text-center font-display text-base text-ink">
            🍎 For you my beloved.
          </p>
          <p className="text-center font-display text-base font-bold text-terra-500">
            Created with love by Your Dear Husband ♥
          </p>
        </div>
      </Modal>
    </div>
  );
}
