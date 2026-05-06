/**
 * Design system tokens — the typed surface of the portfolio's design
 * language. Every visual decision worth reusing lives here.
 *
 * ## Architecture
 *
 * This file is the TypeScript mirror of the runtime CSS custom
 * properties defined in `app/globals.css`. The split is deliberate:
 *
 * - **CSS custom properties** are the runtime source of truth. They
 *   theme via `:root` / `.day` / `.night`, ship to the browser, and
 *   participate in the cascade. Tailwind utilities like `bg-fg` or
 *   arbitrary values like `var(--rail)` resolve to these.
 *
 * - **TypeScript constants below** mirror those values so that:
 *     1. Components can refer to tokens with type-safety (no magic
 *        strings sprinkled across the codebase).
 *     2. Token names are discoverable via IDE autocomplete.
 *     3. When values reach JS (e.g. Motion's `transition` config) we
 *        don't have to read computed styles — we have the literal.
 *
 * The two sources are kept in sync by convention. If you change a
 * value here, change it in `globals.css` too (and vice versa). A
 * future build step could codegen one from the other.
 *
 * ## Categories
 *
 * - {@link colors}     — themed colors, swap on day/night
 * - {@link type}       — font families, sizes, tracking, line-heights
 * - {@link space}      — page rail, section padding, gaps
 * - {@link motion}     — durations + easing curves
 * - {@link radius}     — border radii
 * - {@link opacity}    — semantic opacity scale for ink + ornament
 * - {@link layer}      — z-index hierarchy
 *
 * ## Future
 *
 * When this module is lifted into its own package, `colors` will gain
 * a "themes" map with `day` and `night` records, and the consumer app
 * will pick which theme to install. For now, themes are baked into
 * `globals.css` and we just expose the var-name surface.
 */

// ---------------------------------------------------------------------
// Colors — referenced via CSS custom properties so day/night theming
// flows through automatically. Use these when you need to express a
// color in JS (e.g. Motion's `animate` props); otherwise prefer the
// Tailwind utility (`bg-fg`, `text-accent`, etc.).
// ---------------------------------------------------------------------

export const colors = {
  /** Page background. Cream in day, near-black in night. */
  bg: "var(--bg)",
  /** Slight panel surface above bg. Use sparingly. */
  surface: "var(--surface)",
  /** Foreground ink. Inverse of bg. */
  fg: "var(--fg)",
  /** Muted body copy / metadata. */
  muted: "var(--muted)",
  /** Default border color (resolved by the global `*` reset). */
  border: "var(--border)",
  /** Accent color for emphasis. Currently aliased to fg in mono. */
  accent: "var(--accent)",
  /** Foreground used on accent surfaces (inverts fg/bg). */
  accentFg: "var(--accent-fg)",
} as const;

export type ColorToken = keyof typeof colors;

// ---------------------------------------------------------------------
// Typography — three families, a discrete size scale for both UI text
// and display headings, and the tracking / line-height vocabulary used
// across the site.
// ---------------------------------------------------------------------

export const type = {
  family: {
    /** Geist Sans — body, UI, navigation. */
    sans: "var(--font-sans-family)",
    /** Geist Mono — eyebrows, metadata, archive aesthetic. */
    mono: "var(--font-mono-family)",
    /** Geist Pixel display family (when active). Falls back to sans. */
    pixel: "var(--font-pixel)",
  },

  /** Body / UI sizes. Use raw values; Tailwind's `text-xs` etc. don't map cleanly. */
  size: {
    /** 11px — eyebrows, masthead, colophon, menu meta. */
    eyebrow: "11px",
    /** 12px → 13px responsive — body copy, project meta. */
    body: { sm: "12px", md: "13px" },
  },

  /** Display heading sizes. `vw` so they scale with the viewport. */
  display: {
    /** Top of hero, work index, contact. */
    xl: { sm: "19vw", md: "16vw" },
    /** Slug project title. */
    lg: { sm: "16vw", md: "13vw" },
    /** Vault gate ("OPEN THE VAULT"). */
    md: { sm: "14vw", md: "9vw" },
    /** "Next project" callout. */
    sm: { sm: "13vw", md: "9vw" },
  },

  /** Letter-spacing scale. Negative values tighten display type. */
  tracking: {
    /** -0.045em — display headings (xl/lg/md). */
    display: "-0.045em",
    /** -0.04em — project row titles. */
    projectRow: "-0.04em",
    /** -0.02em — Access Granted overlay. */
    overlay: "-0.02em",
    /** 0.04em — eyebrow / mono labels. */
    eyebrow: "0.04em",
    /** 0.18em — wider eyebrow variant (currently used by --tracking-eyebrow). */
    eyebrowWide: "0.18em",
  },

  /** Line-height scale. */
  leading: {
    /** 0.85 — display headings (super tight). */
    display: 0.85,
    /** 0.9 — menu items. */
    menu: 0.9,
    /** 0.95 — project row titles. */
    projectRow: 0.95,
    /** 1 — single-line UI text (e.g. email link). */
    flat: 1,
    /** 1.5 — slug subtitle. */
    snug: 1.5,
    /** 1.6 — about copy. */
    body: 1.6,
    /** 1.7 — bio, colophon. */
    relaxed: 1.7,
  },
} as const;

export type TypeFamilyToken = keyof typeof type.family;
export type DisplaySizeToken = keyof typeof type.display;

// ---------------------------------------------------------------------
// Space — page rail (horizontal padding), section spacing.
// Pixel/rem values; not the same scale as Tailwind's spacing.
// ---------------------------------------------------------------------

export const space = {
  /** Page-level horizontal padding. 24px / 40px responsive. Drives <Container>. */
  rail: "var(--rail)",

  /** Top padding for a page header (above the masthead/title). */
  pageTop: { sm: "6rem" /* pt-24 */, md: "8rem" /* md:pt-32 */ },

  /** Bottom padding closing a page header. */
  pageHeaderBottom: "4rem" /* pb-16 */,

  /** Vertical padding for a body section. */
  section: { sm: "5rem" /* py-20 */, md: "7rem" /* md:py-28 */ },

  /** Top margin for the colophon/footer. */
  footerTop: { sm: "8rem" /* mt-32 */, md: "10rem" /* md:mt-40 */ },

  /** List gap for interactive index rows (NEXT, Elsewhere). */
  listRow: "0.625rem" /* gap-2.5 */,
} as const;

// ---------------------------------------------------------------------
// Motion — durations and easing curves. The `Tuple` form for ease is
// what Motion expects directly; the `css` form is the cubic-bezier()
// string Tailwind / inline styles want.
// ---------------------------------------------------------------------

export const motion = {
  duration: {
    /** 200ms — micro feedback (currently unused; available). */
    fast: "200ms",
    /** 300ms — pop-in / pop-out (mood toggle, scramble). */
    pop: "300ms",
    /** 400ms — default bg/color transitions, theme settle. */
    base: "400ms",
    /** 480ms — slab fills, inverted block hovers, project rows. Highest reuse. */
    shift: "480ms",
    /** 550ms — overlay clip-path reveals (menu, granted slit). */
    overlay: "550ms",
    /** 600ms — mark hover-rotate. */
    flourish: "600ms",
    /** 800ms — long settling (currently --duration-slow). */
    slow: "800ms",
  },

  ease: {
    /** [0.22, 1, 0.36, 1] — primary "out" curve, fast start / smooth land. */
    out: {
      tuple: [0.22, 1, 0.36, 1] as const,
      css: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
    /** [0.65, 0, 0.35, 1] — symmetric in-out for menu blur etc. */
    inOut: {
      tuple: [0.65, 0, 0.35, 1] as const,
      css: "cubic-bezier(0.65, 0, 0.35, 1)",
    },
    /** [0.4, 0, 0.2, 1] — material-style emphasized curve, used in menu reel. */
    emerge: {
      tuple: [0.4, 0, 0.2, 1] as const,
      css: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    /** [0.34, 1.56, 0.64, 1] — overshoot spring used in the theme wipe and seam settle. */
    spring: {
      tuple: [0.34, 1.56, 0.64, 1] as const,
      css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    /** [0.4, 0, 1, 1] — fast-in / sustained, used for AG blur exit. */
    accelIn: {
      tuple: [0.4, 0, 1, 1] as const,
      css: "cubic-bezier(0.4, 0, 1, 1)",
    },
    /** [0.16, 1, 0.3, 1] — snappy slit reveal for the AG entrance. */
    snap: {
      tuple: [0.16, 1, 0.3, 1] as const,
      css: "cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
} as const;

export type MotionDurationToken = keyof typeof motion.duration;
export type MotionEaseToken = keyof typeof motion.ease;

// ---------------------------------------------------------------------
// Radius — border-radius scale.
// ---------------------------------------------------------------------

export const radius = {
  sm: "var(--radius-sm)" /* 4px */,
  md: "var(--radius-md)" /* 10px */,
  pill: "var(--radius-pill)" /* 999px */,
} as const;

// ---------------------------------------------------------------------
// Opacity — the semantic ink / ornament scale. Use these instead of
// raw Tailwind opacity modifiers (`text-fg/85` → `opacity.body`) for
// maintainable ink density.
// ---------------------------------------------------------------------

export const opacity = {
  /** 0.15 — barely-there ornamental dividers / hairlines. */
  hairline: 0.15,
  /** 0.30 — quiet borders / strokes. */
  border: 0.3,
  /** 0.45 — labels, parenthetical metadata prefixes. */
  label: 0.45,
  /** 0.55 — secondary copy / colophon ink. */
  secondary: 0.55,
  /** 0.6 — muted ink (see Eyebrow `tone="muted"`). */
  muted: 0.6,
  /** 0.7 — interactive hover dim (buttons / wordmark). */
  hover: 0.7,
  /** 0.85 — body copy default. */
  body: 0.85,
  /** 0.9 — emphasized body copy. */
  bodyEmphasis: 0.9,
} as const;

// ---------------------------------------------------------------------
// Layer — z-index hierarchy. Higher = closer to the user.
// ---------------------------------------------------------------------

export const layer = {
  /** Base / default flow. */
  base: 0,
  /** Inline emphasis (sticky bits, mid-page tooltips). */
  raise: 10,
  /** Menu overlay clip-path. */
  overlay: 50,
  /** Fixed nav + mood toggle. */
  chrome: 60,
  /** Vault main when blurred (above blur stacking context). */
  vaultMain: 70,
  /** Vault doors. */
  doors: 70,
  /** Access granted overlay (above doors). */
  accessGranted: 80,
} as const;

export type LayerToken = keyof typeof layer;
