"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type * as Phaser from "phaser";
import type { MiniGameConfig } from "@/types";
import { CITIES } from "@/data/cities";
import { getDialogue } from "@/data/dialogues";
import { useAutoSave } from "@/hooks/useAutoSave";
import { usePlayClock } from "@/hooks/usePlayClock";
import { AUTOSAVE_SLOT, latestSave, loadFromSlot, saveToSlot } from "@/lib/save/saveSystem";
import { useGameStore } from "@/stores/gameStore";
import { Button } from "@/components/ui/Button";
import { DialoguePlayer } from "@/features/dialogue/DialoguePlayer";
import { MiniGameHost } from "@/features/minigames/MiniGameHost";
import { GameEventBus } from "./EventBus";
import { TouchControls } from "./TouchControls";
import { TravelCinematic } from "./TravelCinematic";

interface DialogueOverlayState {
  treeId: string;
  questId?: string;
}

interface MiniGameOverlayState {
  questId: string;
  config: MiniGameConfig;
}

interface TravelOverlayState {
  currentCityId: string;
  unlockedCityIds: string[];
}

interface TravelTripState {
  fromCityId: string;
  toCityId: string;
  unlockedCityIds: string[];
}

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const router = useRouter();
  const snapshot = useGameStore((s) => s.snapshot);
  const [dialogue, setDialogue] = useState<DialogueOverlayState | null>(null);
  const [miniGame, setMiniGame] = useState<MiniGameOverlayState | null>(null);
  const [travel, setTravel] = useState<TravelOverlayState | null>(null);
  const [trip, setTrip] = useState<TravelTripState | null>(null);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [bootStatus, setBootStatus] = useState("Starting Selma's world...");
  const [bootError, setBootError] = useState<string | null>(null);

  useAutoSave();
  usePlayClock();

  useEffect(() => {
    if (useGameStore.getState().snapshot) return;
    const meta = latestSave();
    const loaded = meta ? loadFromSlot(meta.slotId) : null;
    if (loaded) {
      useGameStore.getState().loadSnapshot(loaded);
    } else {
      useGameStore.getState().newGame();
    }
  }, []);

  useEffect(() => {
    const offDialogue = GameEventBus.on("dialogue:open", (payload) => {
      setDialogue(payload);
    });
    const offMiniGame = GameEventBus.on("minigame:open", (payload) => {
      setMiniGame(payload);
    });
    const offTravel = GameEventBus.on("travel:open", (payload) => {
      setTravel(payload);
    });
    const offReady = GameEventBus.on("game:ready", () => {
      setBootStatus("");
      setBootError(null);
    });
    const offPause = GameEventBus.on("app:pause-overlay", ({ open }) => {
      setPauseOpen(open);
    });
    const offNavigate = GameEventBus.on("app:navigate", ({ to }) => {
      router.push(to);
    });
    return () => {
      offDialogue();
      offMiniGame();
      offTravel();
      offReady();
      offPause();
      offNavigate();
    };
  }, [router]);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      setBootError(event.message || "A browser runtime error stopped the game.");
    };
    const onUnhandled = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      setBootError(reason instanceof Error ? reason.message : String(reason));
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootGame() {
      if (!containerRef.current || gameRef.current) return;
      try {
        setBootStatus("Preparing the 2D world...");
        const [{ createGameConfig }, PhaserRuntime] = await Promise.all([
          import("./createGameConfig"),
          import("phaser"),
        ]);
        if (cancelled || !containerRef.current) return;
        gameRef.current = new PhaserRuntime.Game(createGameConfig(containerRef.current));
        setBootStatus("Drawing Safi...");
      } catch (error) {
        setBootError(error instanceof Error ? error.message : String(error));
      }
    }

    void bootGame();
    return () => {
      cancelled = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const closePause = () => {
    setPauseOpen(false);
    GameEventBus.emit("app:pause-overlay", { open: false });
  };

  const manualSave = () => {
    const current = useGameStore.getState().snapshot;
    if (!current) return;
    const meta = saveToSlot("slot-1", current);
    setSaveMessage(meta ? `Saved to ${meta.label}` : "Save failed");
  };

  const quitToMenu = () => {
    const current = useGameStore.getState().snapshot;
    if (current) saveToSlot(AUTOSAVE_SLOT, current);
    useGameStore.getState().quitToMenu();
    router.push("/");
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#1f1d2b] text-white">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />

      {!bootStatus && !bootError && !dialogue && !miniGame && !travel && !trip && !pauseOpen && (
        <TouchControls />
      )}

      {bootStatus && !bootError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1f1d2b] text-sand-50">
          <div className="rounded-xl border border-sand-200/20 bg-white/10 px-5 py-3 text-sm font-semibold shadow-cozy backdrop-blur">
            {bootStatus}
          </div>
        </div>
      )}

      {bootError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#1f1d2b] px-4 text-sand-50">
          <div className="w-full max-w-xl rounded-2xl border border-terra-300 bg-[#2c2030] p-5 shadow-cozy-lg">
            <p className="font-display text-xl font-bold">The 2D world could not start</p>
            <p className="mt-2 text-sm text-sand-200">{bootError}</p>
            <Button
              className="mt-4"
              variant="secondary"
              onClick={() => {
                setBootError(null);
                window.location.reload();
              }}
            >
              Reload
            </Button>
          </div>
        </div>
      )}

      {dialogue && (
        <Overlay align="bottom">
          <DialoguePlayer
            key={dialogue.treeId}
            tree={getDialogue(dialogue.treeId)}
            onComplete={() => {
              GameEventBus.emit("dialogue:done", { treeId: dialogue.treeId });
              setDialogue(null);
            }}
          />
        </Overlay>
      )}

      {miniGame && (
        <Overlay wide>
          <MiniGameHost
            key={`${miniGame.questId}-${miniGame.config.title}`}
            config={miniGame.config}
            onComplete={(result) => {
              GameEventBus.emit("minigame:result", {
                questId: miniGame.questId,
                result,
              });
              setMiniGame(null);
            }}
          />
        </Overlay>
      )}

      {travel && !trip && (
        <Overlay>
          <div className="mx-auto w-full max-w-2xl rounded-2xl border border-sand-200 bg-white/95 p-5 text-ink shadow-cozy-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-zellige-700">
                  Bus Route
                </p>
                <h2 className="font-display text-2xl font-bold">Choose a destination</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  GameEventBus.emit("travel:cancelled", null);
                  setTravel(null);
                }}
              >
                Close
              </Button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {CITIES.map((city) => {
                const unlocked = travel.unlockedCityIds.includes(city.id);
                const current = travel.currentCityId === city.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => {
                      if (!unlocked) return;
                      if (current) {
                        GameEventBus.emit("travel:cancelled", null);
                        setTravel(null);
                        return;
                      }
                      setTrip({
                        fromCityId: travel.currentCityId,
                        toCityId: city.id,
                        unlockedCityIds: travel.unlockedCityIds,
                      });
                      setTravel(null);
                    }}
                    className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                      unlocked
                        ? "border-sand-300 bg-sand-50 hover:border-zellige-500"
                        : "cursor-not-allowed border-sand-200 bg-sand-100 text-sand-500"
                    }`}
                  >
                    <span className="block font-bold">
                      {city.emblem} {city.name}
                      {current && <span className="ml-2 text-xs text-zellige-700">Current</span>}
                    </span>
                    <span className="text-sm text-ink-soft">{city.tagline}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Overlay>
      )}

      {trip && (
        <Overlay wide>
          <TravelCinematic
            fromCityId={trip.fromCityId}
            toCityId={trip.toCityId}
            unlockedCityIds={trip.unlockedCityIds}
            onArrival={() => {
              GameEventBus.emit("travel:selected", { cityId: trip.toCityId });
              setTrip(null);
            }}
          />
        </Overlay>
      )}

      {pauseOpen && (
        <Overlay>
          <div className="mx-auto w-full max-w-md rounded-2xl border border-sand-200 bg-white/95 p-6 text-center text-ink shadow-cozy-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-zellige-700">
              Paused
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold">Selma takes a breath</h2>
            <p className="mt-2 text-sm text-ink-soft">
              {snapshot
                ? `Level ${snapshot.player.level} in ${CITIES.find((c) => c.id === snapshot.currentCityId)?.name ?? "Morocco"}`
                : "Preparing the journey..."}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button size="lg" onClick={closePause}>
                Resume
              </Button>
              <Button size="lg" variant="secondary" onClick={manualSave}>
                Save to Slot 1
              </Button>
              <Button size="lg" variant="ghost" onClick={() => router.push("/inventory")}>
                🎒 Travel Bag <span className="ml-1 text-xs text-ink-soft">(H)</span>
              </Button>
              <Button size="lg" variant="ghost" onClick={() => router.push("/journal")}>
                📓 Journal & Stats <span className="ml-1 text-xs text-ink-soft">(J)</span>
              </Button>
              <Button size="lg" variant="ghost" onClick={() => router.push("/settings")}>
                Settings
              </Button>
              <Button size="lg" variant="danger" onClick={quitToMenu}>
                Save & Quit
              </Button>
            </div>
            {saveMessage && <p className="mt-4 text-sm font-semibold text-zellige-700">{saveMessage}</p>}
          </div>
        </Overlay>
      )}
    </main>
  );
}

function Overlay({
  children,
  wide = false,
  align = "center",
}: Readonly<{ children: React.ReactNode; wide?: boolean; align?: "center" | "bottom" }>) {
  return (
    <div className="absolute inset-0 z-50 flex overflow-y-auto bg-[#1f1d2b]/70 px-4 py-6 backdrop-blur-sm">
      <div
        className={`mx-auto w-full text-ink ${align === "bottom" ? "mt-auto" : "my-auto"} ${
          wide ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
