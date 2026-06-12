"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SaveSlotMeta } from "@/types";
import { useGameStore } from "@/stores/gameStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUiStore } from "@/stores/uiStore";
import {
  MANUAL_SLOTS,
  deleteSlot,
  loadFromSlot,
  saveToSlot,
  slotMeta,
} from "@/lib/save/saveSystem";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/utils/format";

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-sand-200 bg-white p-4">
      <span className="font-semibold">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-colors ${
          checked ? "bg-zellige-500" : "bg-sand-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

export function SettingsPanel() {
  const router = useRouter();
  const snapshot = useGameStore((s) => s.snapshot);
  const loadSnapshot = useGameStore((s) => s.loadSnapshot);
  const quitToMenu = useGameStore((s) => s.quitToMenu);
  const settings = useSettingsStore();
  const pushNotification = useUiStore((s) => s.pushNotification);
  const [slots, setSlots] = useState<(SaveSlotMeta | null)[]>([]);

  const refreshSlots = useCallback(() => {
    setSlots(MANUAL_SLOTS.map((id) => slotMeta(id)));
  }, []);

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  const handleSave = (slotId: string) => {
    if (!snapshot) return;
    const meta = saveToSlot(slotId, snapshot);
    if (meta) {
      pushNotification({ kind: "info", title: "Game saved", icon: "💾", subtitle: meta.label });
      refreshSlots();
    }
  };

  const handleLoad = (slotId: string) => {
    const loaded = loadFromSlot(slotId);
    if (loaded) {
      loadSnapshot(loaded);
      pushNotification({ kind: "info", title: "Game loaded", icon: "📂" });
      router.push("/map");
    }
  };

  const handleDelete = (slotId: string) => {
    deleteSlot(slotId);
    refreshSlots();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-5 font-display text-3xl font-bold">Settings</h1>

      <Card className="p-6">
        <h2 className="mb-4 font-display text-xl font-bold">🔊 Audio</h2>
        <div className="space-y-3">
          <Toggle
            label="Background music"
            checked={settings.musicEnabled}
            onChange={settings.setMusicEnabled}
          />
          <Toggle
            label="Sound effects"
            checked={settings.sfxEnabled}
            onChange={settings.setSfxEnabled}
          />
        </div>

        <h2 className="mb-4 mt-7 font-display text-xl font-bold">💬 Dialogue</h2>
        <div className="flex gap-2">
          {(["slow", "normal", "fast"] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => settings.setTextSpeed(speed)}
              className={`flex-1 rounded-xl border-2 py-2.5 font-semibold capitalize transition-colors ${
                settings.textSpeed === speed
                  ? "border-zellige-500 bg-zellige-500/10 text-zellige-700"
                  : "border-sand-300 bg-white text-ink-soft hover:border-sand-400"
              }`}
            >
              {speed}
            </button>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-1 font-display text-xl font-bold">💾 Save Slots</h2>
        <p className="mb-4 text-sm text-ink-soft">
          The game also auto-saves after every change. Manual slots are yours to manage.
        </p>
        <div className="space-y-3">
          {MANUAL_SLOTS.map((slotId, i) => {
            const meta = slots[i] ?? null;
            return (
              <div
                key={slotId}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-sand-200 bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-bold">Slot {i + 1}</p>
                  {meta ? (
                    <p className="text-xs text-ink-soft">
                      Lv {meta.level} · {meta.cityName} · {meta.questsCompleted} quests ·{" "}
                      {formatDate(meta.savedAt)}
                      {meta.ngPlusCycle > 0 && ` · NG+${meta.ngPlusCycle}`}
                    </p>
                  ) : (
                    <p className="text-xs text-ink-soft">Empty</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={!snapshot} onClick={() => handleSave(slotId)}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={!meta}
                    onClick={() => handleLoad(slotId)}
                  >
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={!meta}
                    onClick={() => handleDelete(slotId)}
                  >
                    🗑
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="mb-3 font-display text-xl font-bold">🚪 Session</h2>
        <Button
          variant="danger"
          onClick={() => {
            quitToMenu();
            router.push("/");
          }}
        >
          Quit to main menu
        </Button>
        <p className="mt-2 text-xs text-ink-soft">
          Progress is auto-saved — quitting is safe.
        </p>
      </Card>
    </div>
  );
}
