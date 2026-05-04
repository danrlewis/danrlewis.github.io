import type { Variants, Transition } from "motion/react";

/**
 * Shared motion vocabulary. Keep this small — every project component
 * should be able to compose from these. Add new variants only if reused.
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
  show: { y: 0, opacity: 1, transition: { duration: duration.slow, ease: ease.out } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
};

export const stagger = (gap = 0.08, delay = 0.1): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
});

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};
