"use client";

interface PortraitProps {
  emoji: string;
  background: string;
  size?: "sm" | "md" | "lg" | "xl";
  ring?: boolean;
  className?: string;
}

const SIZES = {
  sm: "h-10 w-10 text-xl",
  md: "h-14 w-14 text-3xl",
  lg: "h-20 w-20 text-4xl",
  xl: "h-28 w-28 text-6xl",
};

/** Stylized circular avatar used for Selma and every NPC. */
export function Portrait({ emoji, background, size = "md", ring = false, className = "" }: PortraitProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full shadow-cozy ${SIZES[size]} ${
        ring ? "ring-4 ring-gold-500" : ""
      } ${className}`}
      style={{
        background: `radial-gradient(circle at 30% 25%, ${background}cc, ${background})`,
      }}
    >
      <span className="translate-y-[1px] select-none drop-shadow-sm">{emoji}</span>
    </div>
  );
}

export const SELMA_PORTRAIT = { emoji: "👩🏽‍🏫", background: "#e07a5f" };
export const NARRATOR_PORTRAIT = { emoji: "📖", background: "#8a7a5c" };
