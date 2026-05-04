import type { Variants } from "motion/react";

/**
 * Shared motion vocabulary. Keep this small — every animated component
 * should be able to compose from these primitives.
 */

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
};

export const fadeUp: Variants = {
  hidden: { y: 28, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: duration.base, ease: ease.out },
  },
};

/**
 * Spread-ready props for a fade-up entry with a per-element delay. Variants
 * don't compose cleanly with arbitrary delays, so this helper is the
 * preferred way to use the recipe inline.
 */
export function fadeUpProps(delay = 0, customDuration = 0.9) {
  return {
    initial: { y: 28, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay, duration: customDuration, ease: ease.out },
  } as const;
}
