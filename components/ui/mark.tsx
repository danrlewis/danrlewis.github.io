"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { clsx } from "clsx";

type MarkProps = {
  className?: string;
  /** CSS font-size value applied to the glyph. */
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
 * The brand mark. Mood-aware: asterisk (sun) for Day, crescent (moon) for
 * Night. Server-renders the Day glyph (matches the default theme) so there's
 * no hydration mismatch; switches client-side after mount.
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
  // Sun: ✲ U+2732 + VS-15 — the original asterisk Daniel kept, with VS-15
  // forcing text presentation (renders as the sun-like glyph he liked).
  // Moon: ☾ U+263E without VS-15 — the original system crescent.
  const glyph = isDay ? "✲︎" : "☾";
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
        // Force sans so the glyph stays visually consistent regardless of
        // parent font context (the colophon's <p> is font-mono).
        "inline-block font-sans text-accent leading-none select-none",
        hoverRotate && [
          "transition-transform duration-[600ms]",
          "ease-[cubic-bezier(0.22,1,0.36,1)]",
          // Sun is rotationally symmetric — Z-axis spin reads as "spinning
          // in place." Moon is asymmetric — Y-axis flip (rotated on its
          // vertical axis) reads as a coin/card flip ending in a true
          // horizontal mirror, with the tips staying at top and bottom.
          isDay
            ? "motion-safe:group-hover:rotate-[180deg]"
            : "motion-safe:group-hover:[transform:rotateY(180deg)]",
        ],
        className
      )}
      style={{ fontSize: size }}
    >
      {glyph}
    </span>
  );
}
