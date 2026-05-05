"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { clsx } from "clsx";

type MastheadProps = {
  /** Left cell — typically the index / section label. */
  left: ReactNode;
  /** Right cell — typically a meta/edition string or a back link. Optional. */
  right?: ReactNode;
  /** Fade in on mount. Set false in static contexts (e.g. server-rendered slug pages). */
  animate?: boolean;
  className?: string;
};

const baseClass =
  "grid grid-cols-12 gap-4 mb-10 md:mb-16 font-mono text-[11px] uppercase text-fg/55";

/**
 * The 12-col masthead row that sits above every page heading: small mono
 * label on the left, meta/edition string on the right. Single source of
 * truth for the typographic recipe used across hero, work, contact, slug,
 * and vault gate.
 */
export function Masthead({
  left,
  right,
  animate = true,
  className,
}: MastheadProps) {
  if (!animate) {
    return (
      <div className={clsx(baseClass, className)}>
        <div className="col-span-6">{left}</div>
        <div className="col-span-6 text-right">{right}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className={clsx(baseClass, className)}
    >
      <div className="col-span-6">{left}</div>
      <div className="col-span-6 text-right">{right}</div>
    </motion.div>
  );
}
