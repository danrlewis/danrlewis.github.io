/**
 * Motion helpers — the JS-shaped surface for the Motion library.
 *
 * Tuples are sourced from the design system so they stay in sync with
 * the `--ease-*` CSS custom properties (CSS uses the `.css` form, JS
 * uses the `.tuple` form). Components reach for whichever shape fits
 * their context.
 */

import { motion as motionTokens } from "@/lib/design-system";

export const ease = {
  /** Primary "out" curve — fast start, smooth land. CSS: --ease-out. */
  out: motionTokens.ease.out.tuple,
  /** Symmetric in-out for blur/scale transitions. CSS: --ease-in-out. */
  inOut: motionTokens.ease.inOut.tuple,
  /** Material-style emphasized curve. CSS: --ease-emerge. */
  emerge: motionTokens.ease.emerge.tuple,
  /** Overshoot spring. CSS: --ease-spring. */
  spring: motionTokens.ease.spring.tuple,
  /** Fast-in / sustained, used for blur/scale exits. CSS: --ease-accel-in. */
  accelIn: motionTokens.ease.accelIn.tuple,
  /** Snappy slit-reveal curve. CSS: --ease-snap. */
  snap: motionTokens.ease.snap.tuple,
};

/**
 * Standard fade-up entrance props for `motion.*` components.
 * `delay` and `duration` are in seconds (Motion convention).
 */
export function fadeUpProps(delay = 0, duration = 0.9) {
  return {
    initial: { y: 28, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay, duration, ease: ease.out },
  } as const;
}
