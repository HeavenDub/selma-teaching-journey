"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { audioManager } from "@/lib/audio/audioManager";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "gold";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-zellige-500 text-white hover:bg-zellige-700 shadow-cozy disabled:bg-sand-300 disabled:text-sand-600",
  secondary:
    "bg-sand-100 text-ink border-2 border-sand-300 hover:border-zellige-500 hover:text-zellige-700 disabled:opacity-50",
  ghost: "bg-transparent text-ink-soft hover:bg-sand-100 hover:text-ink disabled:opacity-50",
  danger: "bg-terra-500 text-white hover:bg-terra-700 shadow-cozy disabled:opacity-50",
  gold: "bg-gold-500 text-ink hover:bg-gold-700 hover:text-white shadow-cozy disabled:opacity-50",
};

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const sizeClasses =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : size === "lg"
        ? "px-7 py-3.5 text-lg"
        : "px-5 py-2.5 text-base";
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`cursor-pointer rounded-xl font-semibold transition-colors disabled:cursor-not-allowed ${sizeClasses} ${VARIANT_CLASSES[variant]} ${className}`}
      onClick={(e) => {
        audioManager.play("click");
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
