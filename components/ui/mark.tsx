"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { clsx } from "clsx";

type MarkProps = {
  className?: string;
  /** CSS size value for the SVG width/height. */
  size?: string;
  /** When true, the mark rotates 180° on parent group-hover (motion-safe). */
  hoverRotate?: boolean;
  /**
   * When this number changes (and is > 0), the mark plays its flourish
   * animation: sun spins multiple turns with inertia, moon flips multiple
   * times. Used by the home-page Wordmark for an easter egg.
   */
  flourishKey?: number;
};

/**
 * Pixelarticons sun — pixel-art sun on a 24×24 grid. A central hollow
 * square with four orthogonal rays and four diagonal corner dots. The
 * sun glyph from pixelarticons.com (pro/site set, not in the public
 * `moon.svg` peer); inlined here for zero runtime dependency, identical
 * cross-browser rendering, and drop-in `currentColor` fill.
 */
function SunIcon({ size }: { size: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        fill="currentColor"
        d="M13 22H11V19H13V22ZM7 19H5V17H7V19ZM19 19H17V17H19V19ZM15 17H9V15H15V17ZM9 15H7V9H9V15ZM17 15H15V9H17V15ZM5 13H2V11H5V13ZM22 13H19V11H22V13ZM15 9H9V7H15V9ZM7 7H5V5H7V7ZM19 7H17V5H19V7ZM13 5H11V2H13V5Z"
      />
    </svg>
  );
}

/**
 * Pixelarticons moon — pixel-art crescent on a 24×24 grid (the
 * `moon.svg` from github.com/halfmage/pixelarticons). Solid pixel
 * staircase rather than the previous thin stroke; pairs with the
 * pixel-art sun above. `currentColor` fill follows theme.
 */
function MoonIcon({ size }: { size: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        fill="currentColor"
        d="M18 22H8v-2h10v2ZM8 20H6v-2h2v2Zm12 0h-2v-2h2v2ZM6 18H4v-2h2v2Zm16 0h-2v-4h-2v-2h2v-2h2v8ZM4 16H2V6h2v10Zm14 0h-6v-2h6v2Zm-6-2h-2v-2h2v2Zm-2-2H8V6h2v6ZM6 6H4V4h2v2Zm8-2h-2v2h-2V4H6V2h8v2Z"
      />
    </svg>
  );
}

/**
 * The brand mark. Mood-aware: asterisk (sun) for Day, crescent (moon) for
 * Night. Server-renders the Day glyph (matches the default theme) so there's
 * no hydration mismatch; switches client-side after mount.
 *
 * Uses inline SVGs sourced from SF Symbols for guaranteed identical
 * rendering across all browsers, operating systems, and fonts.
 */
export function Mark({
  className,
  size = "22px",
  hoverRotate = true,
  flourishKey = 0,
}: MarkProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => setMounted(true), []);

  // Pre-mount default matches the layout default (Day). After mount we read
  // the actual theme.
  const isDay = !mounted || resolvedTheme === "light";
  const ariaLabel = isDay ? "Sun mark" : "Moon mark";

  // Trigger CSS keyframe by toggling a class. We add it imperatively (rather
  // than through React state) so the change doesn't cause a re-render that
  // would clobber the class via reconciliation. The CSS animation transform
  // overrides the hover-class transform while it runs.
  const playFlourish = (forDay: boolean) => {
    const el = ref.current;
    if (!el) return;
    const cls = forDay ? "mark-flourish-sun" : "mark-flourish-moon";
    el.classList.remove("mark-flourish-sun", "mark-flourish-moon");
    // Force reflow so re-adding the class restarts the keyframe animation
    // mid-flight (otherwise consecutive clicks wouldn't replay).
    void el.offsetWidth;
    el.classList.add(cls);
  };

  // Click flourish — driven externally by Wordmark via the flourishKey prop.
  // playFlourish only reads ref.current, so the dep list intentionally
  // excludes it.
  useEffect(() => {
    if (flourishKey === 0) return;
    playFlourish(isDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flourishKey, isDay]);

  // Auto-flourish on theme change — when the user flips the mood toggle,
  // every Mark on the page spins/flips in sync with the wipe.
  const prevThemeRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!mounted) return;
    if (prevThemeRef.current === undefined) {
      prevThemeRef.current = resolvedTheme;
      return;
    }
    if (prevThemeRef.current === resolvedTheme) return;
    prevThemeRef.current = resolvedTheme;
    playFlourish(isDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, resolvedTheme, isDay]);

  return (
    <span
      ref={ref}
      role="img"
      aria-label={ariaLabel}
      onAnimationEnd={() => {
        ref.current?.classList.remove(
          "mark-flourish-sun",
          "mark-flourish-moon"
        );
      }}
      className={clsx(
        "inline-block text-accent leading-none select-none",
        hoverRotate && [
          "transition-transform duration-[600ms]",
          "ease-[cubic-bezier(0.22,1,0.36,1)]",
          "mark-hover-rotate",
        ],
        className
      )}
    >
      {/* Render both, toggle via CSS theme class to avoid flash on
          navigation. The .day/.night class is on <html> from first paint,
          so the correct icon is visible immediately — no JS needed. */}
      <span className="mark-sun">
        <SunIcon size={size} />
      </span>
      <span className="mark-moon">
        <MoonIcon size={size} />
      </span>
    </span>
  );
}
