"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color = "var(--color-zellige-500)",
  className = "",
  showLabel = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`relative h-3 w-full overflow-hidden rounded-full bg-sand-200 ${className}`}>
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink">
          {Math.round(value)}/{max}
        </span>
      )}
    </div>
  );
}
