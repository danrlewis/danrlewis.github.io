"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { clsx } from "clsx";

type MarkProps = {
  className?: string;
  /** CSS font-size value applied to the glyph. */
  size?: string;
  /** When true, the mark rotates 180° on parent group-hover (motion-safe). */
  hoverRotate?: boolean;
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
}: MarkProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Pre-mount default matches the layout default (Day). After mount we read
  // the actual theme.
  const isDay = !mounted || resolvedTheme === "light";
  // Sun: ✲ U+2732 + VS-15 — the original asterisk Daniel kept, with VS-15
  // forcing text presentation (renders as the sun-like glyph he liked).
  // Moon: ☾ U+263E without VS-15 — the original system crescent.
  const glyph = isDay ? "✲︎" : "☾";
  const ariaLabel = isDay ? "Sun mark" : "Moon mark";

  return (
    <span
      role="img"
      aria-label={ariaLabel}
      className={clsx(
        "inline-block text-accent leading-none select-none",
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
