"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Lift on hover (for interactive cards). */
  interactive?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", interactive = false, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={interactive ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={`rounded-2xl border border-sand-200 bg-white/80 shadow-cozy backdrop-blur-sm ${
        interactive ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
