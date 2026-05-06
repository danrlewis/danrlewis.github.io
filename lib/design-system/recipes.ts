/**
 * Component recipes — the class-string source of truth for the
 * visual variants of each design-system primitive.
 *
 * Why recipes (and not just styled components)?
 *
 *   1. **Tailwind utilities stay in the markup**, which is the
 *      project's prevailing convention. Recipes return class strings
 *      ready to feed into `clsx()`.
 *   2. **Variants are typed**: when a primitive accepts `tone="muted"`
 *      or `size="lg"`, the recipe enumerates the legal values and
 *      hands back the right class string. No more drifting variants
 *      defined inline per-component.
 *   3. **Lift to a package without importing React**: this file is
 *      pure data + functions, so the design system can be consumed
 *      from any framework or even a plain `<script>` if needed.
 *
 * If a future need arises for theme-aware computed strings (e.g. a
 * `cva` integration), this file is where the contract lives and only
 * the implementation has to grow.
 */

import { clsx } from "clsx";

// ---------------------------------------------------------------------
// Eyebrow — small uppercase tracked label. Used for section eyebrows,
// metadata prefixes (e.g. "(STATUS)"), masthead corners.
// ---------------------------------------------------------------------

export type EyebrowTone = "default" | "muted" | "accent";

const eyebrowToneClass: Record<EyebrowTone, string> = {
  default: "text-fg",
  muted: "text-ink-muted",
  accent: "text-accent",
};

export function eyebrowRecipe({
  tone = "default",
}: { tone?: EyebrowTone } = {}) {
  return clsx(
    "inline-block font-mono text-[11px] uppercase",
    "tracking-[0.04em]",
    eyebrowToneClass[tone],
  );
}

// ---------------------------------------------------------------------
// Display heading — the brutalist heavy-sans recipe. `size` is the
// responsive viewport-width pair (sm / md+), tracking and leading are
// shared across sizes for type coherence.
// ---------------------------------------------------------------------

export type DisplaySize = "xl" | "lg" | "md" | "sm";

const displaySizeClass: Record<DisplaySize, string> = {
  xl: "text-[19vw] md:text-[16vw]",
  lg: "text-[16vw] md:text-[13vw]",
  md: "text-[14vw] md:text-[9vw]",
  sm: "text-[13vw] md:text-[9vw]",
};

export function displayHeadingRecipe({
  size = "xl",
}: { size?: DisplaySize } = {}) {
  return clsx(
    // Geist Pixel display font when --font-pixel is set, otherwise
    // falls through to font-black on Geist Sans.
    "font-[family-name:var(--font-pixel)] font-black",
    "leading-[0.85] tracking-[-0.045em] -ml-[0.04em]",
    displaySizeClass[size],
  );
}

// ---------------------------------------------------------------------
// Container — page-rail horizontal padding wrapper. Mirrors the
// existing `<Container>` component; exposed here so recipes can
// compose it without importing JSX.
// ---------------------------------------------------------------------

export function containerRecipe({ bleed = false }: { bleed?: boolean } = {}) {
  return clsx(!bleed && "px-[var(--rail)]");
}

// ---------------------------------------------------------------------
// Index row — bordered list-item link with the label/icon-on-the-right
// hover-translate pattern (used by the home (NEXT) cluster and the
// contact (Elsewhere) cluster). Pass classes to children via the
// returned `parts` map.
// ---------------------------------------------------------------------

export const indexRowRecipe = {
  /** The <a> wrapper. The `!`-suffixed border colors override the
      project-wide `* { border-color: var(--border) }` reset that
      otherwise wins via specificity. */
  link: clsx(
    "group flex items-center justify-between",
    "border-b border-ink-hairline! pb-2",
    "hover:border-accent! transition-colors",
  ),
  /** The label and the trailing icon both get this so they shift together. */
  cell: "transition-transform group-hover:translate-x-1",
};

// ---------------------------------------------------------------------
// Slab hover — the inverted color slab that grows from a cursor-anchored
// circle on hover. Two pieces:
//   - `slab` is the absolute-positioned filler that animates clip-path.
//   - `text` is the companion class for any text inside the same group
//     that should color-shift in step with the slab.
//   - The consumer is responsible for setting `--slab-x`, `--slab-y`
//     on pointer events (see project-row.tsx for the pattern).
//
// Pass a `bg` Tailwind class (default `bg-fg`) to flip what color the
// slab fills — `bg-accent` for the menu, `bg-fg` for project rows.
// ---------------------------------------------------------------------

export function slabHoverRecipe({
  bg = "bg-fg",
}: { bg?: string } = {}) {
  return {
    slab: clsx(
      "absolute inset-0 -z-10 opacity-0",
      bg,
      "[clip-path:circle(0%_at_var(--slab-x)_var(--slab-y))]",
      // Idle state: opacity fades over `shift`, clip-path snaps back instantly
      // (delayed by `shift` so the fade out completes first). Hover state
      // (group-hover): opacity flips instantly, clip-path expands over the
      // longer 850ms ink-bloom duration. The asymmetry sells the "ink-bloom".
      "[transition:opacity_var(--duration-shift)_var(--ease-out),clip-path_0ms_var(--duration-shift)]",
      "group-hover:opacity-100",
      "group-hover:[clip-path:circle(150%_at_var(--slab-x)_var(--slab-y))]",
      "group-hover:[transition:opacity_0ms,clip-path_850ms_var(--ease-out)]",
    ),
  };
}

// ---------------------------------------------------------------------
// Shift transition — the canonical color-shift transition tokens used
// across hover-aware text inside slabHover groups. Pull this in via
// `clsx(shiftTransition, ...)` instead of repeating
// `duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)]` inline.
// ---------------------------------------------------------------------

export const shiftTransition =
  "transition-colors duration-[var(--duration-shift)] ease-[var(--ease-out)]";
