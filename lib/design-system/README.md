# Design system

Foundation for the portfolio's visual language. Designed to be liftable
into a standalone package once it stabilizes.

## What's here

```
lib/design-system/
├── tokens.ts          # Typed design tokens (colors, type, motion, etc.)
├── recipes.ts         # Class-string recipes for component variants
├── primitives/        # React components wrapping the recipes
│   ├── container.tsx
│   ├── display-heading.tsx
│   ├── eyebrow.tsx
│   ├── fade-up.tsx
│   ├── mark.tsx
│   ├── masthead.tsx
│   ├── wordmark.tsx
│   └── index.ts
├── index.ts           # Public barrel (tokens + recipes + primitives)
└── README.md          # This file
```

`components/ui/index.ts` is a compatibility shim that re-exports the
primitives, so existing `@/components/ui` imports keep working.

## What's next (not here yet)

```
└── tokens.css     # ⬅ canonical CSS-var source (currently in globals.css)
```

## Two surfaces, kept in sync

The design system has two parallel surfaces:

1. **CSS custom properties** in `app/globals.css` — runtime source of
   truth. They cascade, theme on `.day` / `.night`, and ship to the
   browser. Tailwind utilities like `bg-fg` and arbitrary values like
   `var(--rail)` resolve to these.

2. **TypeScript constants** in `tokens.ts` — typed mirror of the CSS
   side. Use these whenever a token reaches JS (Motion's `transition`
   config, inline styles, computed class strings).

Today these are kept in sync **by convention**. If you change a value
in one place, change it in the other. A future build step could
codegen `tokens.ts` from `tokens.css` (or vice versa) once the system
is stable enough to commit to a generator.

## Recipes vs. components

A **recipe** is a pure function (or constant) that returns a Tailwind
class string. It's variant-aware (`eyebrowRecipe({ tone: "muted" })`)
and framework-agnostic.

A **component** is a React wrapper around a recipe + JSX shell.
Components live in `components/ui/` for now. They will eventually
import from this folder rather than redefining variants inline.

This split means the recipes can be reused outside the React tree
(in MDX, in another framework, in a future Storybook), and the
component layer stays thin.

## Import patterns

Pick whichever shape reads best at the call site:

```ts
// Namespaced (good when using many tokens at once)
import { tokens } from "@/lib/design-system";
tokens.motion.duration.shift;
tokens.opacity.body;

// Granular (good for one or two tokens)
import { motion, opacity } from "@/lib/design-system";
motion.duration.shift;
opacity.body;

// Recipes
import { eyebrowRecipe } from "@/lib/design-system";
className={eyebrowRecipe({ tone: "muted" })}
```

## Migration path (high-level)

This system is being introduced **alongside** the existing components,
not as a hard cutover. The plan:

1. ✅ Stand up `tokens.ts` + `recipes.ts` (this commit).
2. Migrate `components/ui/` primitives to read from `recipes.ts`
   instead of redefining variants inline.
3. Audit the remaining hardcoded values (project-row, menu, hero,
   vault-gate) and route them through tokens.
4. Move primitives under `lib/design-system/primitives/` and have
   `components/ui/` re-export them (preserves existing imports).
5. (Future) Generate `tokens.css` from `tokens.ts`, then delete the
   tokens half of `globals.css` to keep one source of truth.
6. (Future) Lift the whole `lib/design-system/` directory into its
   own package.

Each step is independently shippable; nothing in the migration breaks
the live site.

## Token philosophy

A few rules of thumb that the current tokens reflect:

- **Name by intent, not appearance.** `motion.duration.shift` (480ms)
  describes "the slab/hover shift duration", not just "480 milliseconds".
  When the value changes, the name still makes sense.
- **Variants over magnitudes.** Most things have a small ordinal scale
  (xs, sm, md, lg, xl) rather than freeform values. Exceptions are the
  semantic layers — `accessGranted`, `chrome` — where the order is
  meaningful but the names earn their place.
- **Themed values reference CSS vars; static values are literals.**
  Colors are `var(--fg)`. Durations are `"480ms"`. This way themed
  values flow through the cascade and static values stay portable.
