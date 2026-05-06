/**
 * Design system primitives — React components that wrap the recipes.
 *
 * Each component here is a thin shell over a recipe (or a coordinated
 * set of recipes), so most variant logic stays in `recipes.ts` and the
 * component just plumbs props through.
 *
 * These are re-exported from `@/lib/design-system` (the package surface)
 * AND from `@/components/ui` (a local convenience alias to keep
 * existing imports valid as the directory layout evolves).
 */

export { Container } from "./container";
export { DisplayHeading } from "./display-heading";
export { Eyebrow } from "./eyebrow";
export { FadeUp } from "./fade-up";
export { Mark } from "./mark";
export { Masthead } from "./masthead";
export { Wordmark } from "./wordmark";
