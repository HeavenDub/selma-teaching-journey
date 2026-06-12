"use client";

import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { getItem } from "@/data/items";
import type { InventoryEntry, ItemCategory } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { RARITY_COLORS, RARITY_LABELS, formatDate } from "@/utils/format";

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  "observation-sheet": "Observation Sheets",
  "lesson-plan": "Lesson Plans",
  "teaching-material": "Teaching Materials",
  "reference-book": "Reference Books",
  certificate: "Certificates",
  "portfolio-entry": "Portfolio Entries",
  "assessment-tool": "Assessment Tools",
  "achievement-badge": "Achievement Badges",
};

export function InventoryGrid() {
  const snapshot = useGameStore((s) => s.snapshot);
  const [selected, setSelected] = useState<InventoryEntry | null>(null);

  if (!snapshot) return null;

  const byCategory = new Map<ItemCategory, InventoryEntry[]>();
  for (const entry of snapshot.inventory) {
    const item = getItem(entry.itemId);
    const list = byCategory.get(item.category) ?? [];
    list.push(entry);
    byCategory.set(item.category, list);
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold">Selma's Bag</h1>
      <p className="mb-5 text-ink-soft">
        {snapshot.inventory.length === 0
          ? "Empty for now — every quest leaves something behind."
          : `${snapshot.inventory.reduce((a, e) => a + e.quantity, 0)} treasures collected along the road`}
      </p>

      {snapshot.inventory.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-5xl">🎒</p>
          <p className="mt-3 text-ink-soft">
            Complete quests to fill the bag with observation sheets, lesson plans, and the
            occasional legendary certificate.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {[...byCategory.entries()].map(([category, entries]) => (
            <section key={category}>
              <h2 className="mb-3 font-display text-lg font-bold">{CATEGORY_LABELS[category]}</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((entry) => {
                  const item = getItem(entry.itemId);
                  return (
                    <Card
                      key={entry.itemId}
                      interactive
                      onClick={() => setSelected(entry)}
                      className="p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
                          style={{ backgroundColor: `${RARITY_COLORS[item.rarity]}22` }}
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-bold">{item.name}</p>
                          <Badge color={RARITY_COLORS[item.rarity]}>
                            {RARITY_LABELS[item.rarity]}
                          </Badge>
                          {entry.quantity > 1 && (
                            <span className="ml-2 text-xs font-bold text-ink-soft">
                              ×{entry.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <Modal open={selected !== null} onClose={() => setSelected(null)}>
        {selected &&
          (() => {
            const item = getItem(selected.itemId);
            return (
              <div className="text-center">
                <span
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl text-6xl shadow-cozy"
                  style={{ backgroundColor: `${RARITY_COLORS[item.rarity]}26` }}
                >
                  {item.icon}
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold">{item.name}</h2>
                <div className="mt-2 flex justify-center gap-2">
                  <Badge color={RARITY_COLORS[item.rarity]}>{RARITY_LABELS[item.rarity]}</Badge>
                  <Badge color="var(--color-ink-soft)">{CATEGORY_LABELS[item.category]}</Badge>
                </div>
                <p className="mt-4 leading-relaxed text-ink-soft">{item.description}</p>
                <div className="mt-4 space-y-2 text-left">
                  {item.effects.map((effect, i) => (
                    <p
                      key={i}
                      className="rounded-xl border border-gold-300 bg-gold-500/10 p-3 text-sm font-medium"
                    >
                      ✨ {effect.description}
                    </p>
                  ))}
                </div>
                <p className="mt-4 text-xs text-ink-soft">
                  Acquired {formatDate(selected.acquiredAt)}
                </p>
              </div>
            );
          })()}
      </Modal>
    </div>
  );
}
