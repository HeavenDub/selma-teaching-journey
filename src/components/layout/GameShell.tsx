"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
import { latestSave, loadFromSlot } from "@/lib/save/saveSystem";
import { useAutoSave } from "@/hooks/useAutoSave";
import { usePlayClock } from "@/hooks/usePlayClock";
import { NotificationToaster } from "@/components/ui/NotificationToaster";
import { Portrait, SELMA_PORTRAIT } from "@/components/ui/Portrait";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LEVELS, nextLevel } from "@/data/levels";

const NAV_ITEMS = [
  { href: "/game", label: "Play", icon: "🎮" },
  { href: "/map", label: "Map", icon: "🗺️" },
  { href: "/quests", label: "Quests", icon: "📜" },
  { href: "/character", label: "Selma", icon: "🌱" },
  { href: "/inventory", label: "Bag", icon: "🎒" },
  { href: "/journal", label: "Journal", icon: "📓" },
  { href: "/achievements", label: "Awards", icon: "🏆" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

/**
 * Persistent in-game chrome: HUD with level/XP/energy and the bottom nav.
 * Redirects to the main menu when no game is loaded.
 */
export function GameShell({ children }: { children: ReactNode }) {
  const snapshot = useGameStore((s) => s.snapshot);
  const router = useRouter();
  const pathname = usePathname();
  useAutoSave();
  usePlayClock();

  // On refresh, resume seamlessly from the most recent save; only fall
  // back to the menu when no save exists at all.
  useEffect(() => {
    if (snapshot) return;
    const meta = latestSave();
    if (meta) {
      const loaded = loadFromSlot(meta.slotId);
      if (loaded) {
        useGameStore.getState().loadSnapshot(loaded);
        return;
      }
    }
    router.replace("/");
  }, [snapshot, router]);

  if (!snapshot) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-soft">
        Returning to the main menu…
      </div>
    );
  }

  const { player } = snapshot;
  const current = LEVELS.find((l) => l.level === player.level)!;
  const next = nextLevel(player.level);
  const xpIntoLevel = player.experience - current.xpRequired;
  const xpForNext = next ? next.xpRequired - current.xpRequired : 1;

  return (
    <div className="flex min-h-screen flex-col">
      <NotificationToaster />

      <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
          <Link href="/character" className="flex items-center gap-3">
            <Portrait {...SELMA_PORTRAIT} size="sm" />
            <span className="hidden sm:block">
              <span className="block text-sm font-bold leading-tight">Selma</span>
              <span className="block text-xs text-ink-soft leading-tight">
                Lv {player.level} · {current.title}
                {snapshot.ngPlusCycle > 0 && (
                  <span className="ml-1 font-bold text-terra-500">NG+{snapshot.ngPlusCycle}</span>
                )}
              </span>
            </span>
          </Link>

          <div className="ml-2 flex-1 max-w-xs">
            <div className="flex items-center justify-between text-[10px] font-semibold text-ink-soft">
              <span>XP</span>
              <span>
                {next ? `${xpIntoLevel}/${xpForNext}` : "MAX"}
              </span>
            </div>
            <ProgressBar
              value={next ? xpIntoLevel : 1}
              max={next ? xpForNext : 1}
              color="var(--color-gold-500)"
              className="h-2"
            />
          </div>

          <div className="ml-auto flex items-center gap-3 text-sm">
            <span title="Energy" className="flex items-center gap-1 font-semibold">
              ⚡ {player.stats.energy}
            </span>
            <span title="Confidence" className="hidden items-center gap-1 font-semibold sm:flex">
              💪 {player.stats.confidence}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-sand-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-stretch justify-between px-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-t-xl px-1 py-2 text-[11px] font-semibold transition-colors ${
                  active
                    ? "bg-sand-100 text-zellige-700"
                    : "text-ink-soft hover:bg-sand-100 hover:text-ink"
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
