"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * Thin client wrapper for fade-up entry animations. Useful in server
 * components that can't use motion directly — wrap a section in
 * <FadeUp> and it gets the standard staggered entrance.
 */
export function FadeUp({
  delay = 0,
  duration = 0.7,
  className,
  children,
}: {
  delay?: number;
  duration?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ y: 28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration, ease: ease.out }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
