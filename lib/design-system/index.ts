/**
 * Design system — public surface.
 *
 * Import shape:
 *   import { tokens, recipes } from "@/lib/design-system";
 *   // or, if you want narrow imports:
 *   import { motion, opacity } from "@/lib/design-system/tokens";
 *
 * Architecture:
 *   tokens.ts   — primitive design values (colors, type, motion, etc.)
 *   recipes.ts  — class-string recipes for component variants
 *
 * Components live one level up in `components/ui/` for now. As the
 * design system stabilizes, those primitives will move under
 * `lib/design-system/primitives/` and this index will re-export them
 * — at which point the system is fully extractable as a package.
 */

export * as tokens from "./tokens";
export * as recipes from "./recipes";

// Granular re-exports for ergonomic imports.
export {
  colors,
  type,
  space,
  motion,
  radius,
  opacity,
  layer,
} from "./tokens";

export {
  eyebrowRecipe,
  displayHeadingRecipe,
  containerRecipe,
  indexRowRecipe,
  slabHoverRecipe,
  shiftTransition,
} from "./recipes";

export type {
  ColorToken,
  TypeFamilyToken,
  DisplaySizeToken,
  MotionDurationToken,
  MotionEaseToken,
  LayerToken,
} from "./tokens";

export type { EyebrowTone, DisplaySize } from "./recipes";

// Primitives — React components that wrap the recipes.
export {
  Container,
  DisplayHeading,
  Eyebrow,
  FadeUp,
  Mark,
  Masthead,
  Wordmark,
} from "./primitives";
