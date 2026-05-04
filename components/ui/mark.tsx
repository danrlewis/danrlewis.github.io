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
 * Night. Server-renders the Night glyph (matches the default theme) so there's
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

  const isDay = mounted && resolvedTheme === "light";
  const glyph = isDay ? "✲" : "☾";
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
          "motion-safe:group-hover:rotate-[180deg]",
        ],
        className
      )}
      style={{ fontSize: size }}
    >
      {glyph}
    </span>
  );
}
