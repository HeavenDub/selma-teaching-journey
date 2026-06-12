"use client";

import { useCallback, useEffect, useState } from "react";
import {
  queueTouchInteract,
  queueTouchPause,
  resetTouchDirections,
  touchInput,
} from "./touchInput";

/**
 * On-screen controls for phones and tablets (tested layout target: Samsung
 * Note 10 Lite). Renders only on coarse-pointer devices: a D-pad on the
 * left thumb, Talk/Act and Pause on the right thumb. Multi-touch friendly.
 */

type Dir = "up" | "down" | "left" | "right";

function DPadButton({
  dir,
  label,
  className,
}: {
  dir: Dir;
  label: string;
  className: string;
}) {
  const press = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      touchInput[dir] = true;
    },
    [dir],
  );
  const release = useCallback(() => {
    touchInput[dir] = false;
  }, [dir]);
  return (
    <button
      type="button"
      aria-label={`Move ${dir}`}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onContextMenu={(e) => e.preventDefault()}
      className={`flex items-center justify-center rounded-xl border border-white/25 bg-white/15 text-2xl text-white/90 backdrop-blur-sm active:bg-white/35 ${className}`}
      style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none" }}
    >
      {label}
    </button>
  );
}

export function TouchControls() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const coarse =
      window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    setVisible(coarse);
    return () => resetTouchDirections();
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* D-pad — left thumb */}
      <div
        className="absolute bottom-5 left-4 z-40 grid grid-cols-3 grid-rows-3 gap-1"
        style={{ width: "10.5rem", height: "10.5rem" }}
      >
        <div />
        <DPadButton dir="up" label="▲" className="col-start-2 row-start-1" />
        <div />
        <DPadButton dir="left" label="◀" className="col-start-1 row-start-2" />
        <div className="col-start-2 row-start-2 rounded-xl border border-white/10 bg-white/5" />
        <DPadButton dir="right" label="▶" className="col-start-3 row-start-2" />
        <div />
        <DPadButton dir="down" label="▼" className="col-start-2 row-start-3" />
        <div />
      </div>

      {/* Action buttons — right thumb */}
      <div className="absolute bottom-6 right-4 z-40 flex flex-col items-center gap-3">
        <button
          type="button"
          aria-label="Pause"
          onPointerDown={(e) => {
            e.preventDefault();
            queueTouchPause();
          }}
          onContextMenu={(e) => e.preventDefault()}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/15 text-lg text-white/90 backdrop-blur-sm active:bg-white/35"
          style={{ touchAction: "none", userSelect: "none" }}
        >
          ⏸
        </button>
        <button
          type="button"
          aria-label="Talk / Act"
          onPointerDown={(e) => {
            e.preventDefault();
            queueTouchInteract();
          }}
          onContextMenu={(e) => e.preventDefault()}
          className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-500/70 bg-gold-500/30 font-display text-xl font-bold text-white backdrop-blur-sm active:bg-gold-500/60"
          style={{ touchAction: "none", userSelect: "none" }}
        >
          E
        </button>
      </div>

      {/* Rotate hint — portrait phones get a gentle nudge, CSS-only */}
      <div className="pointer-events-none absolute inset-x-0 top-14 z-40 hidden justify-center portrait:flex">
        <span className="rounded-full bg-[#1f1d2b]/80 px-4 py-2 text-sm font-semibold text-sand-50 shadow-cozy">
          🔄 Rotate your phone for the best view
        </span>
      </div>
    </>
  );
}
