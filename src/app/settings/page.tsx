"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
import { SettingsPanel } from "@/features/settings/SettingsPanel";
import { NotificationToaster } from "@/components/ui/NotificationToaster";
import { Button } from "@/components/ui/Button";

/**
 * Settings lives outside the game shell so it is reachable from the
 * main menu as well as mid-game.
 */
export default function SettingsPage() {
  const router = useRouter();
  const hasGame = useGameStore((s) => s.snapshot !== null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <NotificationToaster />
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => (hasGame ? router.push("/game") : router.push("/"))}
      >
        ← Back to {hasGame ? "the game" : "the main menu"}
      </Button>
      <SettingsPanel />
    </div>
  );
}
