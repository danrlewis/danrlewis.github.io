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
 * Six-pointed asterisk — extracted from SF Symbols asterisk.circle.
 * The path is the asterisk sub-path only (circle removed).
 */
function SunIcon({ size }: { size: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="14.5 16 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <g fill="currentColor" transform="scale(1,-1) translate(0,-52.228515625)">
        <path d="
          M 24.599609375,17.037109375
          C 25.0078125,17.037109375 25.201171875,17.251953125 25.201171875,17.638671875
          L 25.1796875,25.22265625
          L 31.861328125,21.0546875
          C 32.033203125,20.947265625 32.119140625,20.904296875 32.3125,20.904296875
          C 32.591796875,20.904296875 32.87109375,21.162109375 32.87109375,21.484375
          C 32.87109375,21.7421875 32.78515625,21.892578125 32.52734375,22.04296875
          L 25.759765625,26.16796875
          L 32.52734375,30.271484375
          C 32.806640625,30.443359375 32.892578125,30.59375 32.892578125,30.830078125
          C 32.892578125,31.15234375 32.65625,31.431640625 32.3125,31.431640625
          C 32.140625,31.431640625 32.01171875,31.388671875 31.861328125,31.28125
          L 25.1796875,27.134765625
          L 25.158203125,34.6328125
          C 25.158203125,34.998046875 24.986328125,35.234375 24.599609375,35.234375
          C 24.234375,35.234375 24.01953125,34.998046875 24.01953125,34.6328125
          L 24.01953125,27.134765625
          L 17.509765625,31.173828125
          C 17.380859375,31.23828125 17.2734375,31.302734375 17.080078125,31.302734375
          C 16.7578125,31.302734375 16.478515625,31.06640625 16.478515625,30.701171875
          C 16.478515625,30.443359375 16.607421875,30.29296875 16.822265625,30.1640625
          L 23.4609375,26.146484375
          L 16.865234375,22.12890625
          C 16.607421875,21.95703125 16.5,21.806640625 16.5,21.5703125
          C 16.5,21.248046875 16.736328125,21.01171875 17.037109375,21.01171875
          C 17.208984375,21.01171875 17.31640625,21.076171875 17.509765625,21.18359375
          L 24.01953125,25.22265625
          L 24.01953125,17.638671875
          C 24.01953125,17.251953125 24.234375,17.037109375 24.599609375,17.037109375
          Z
        " />
      </g>
    </svg>
  );
}

/**
 * Stroked crescent moon — Myna UI icon (32×32 variant, 1.5px stroke).
 * Simple bezier path, stroke-only for a thin elegant line.
 */
function MoonIcon({ size }: { size: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M28.0009 17.0773C27.3342 24.2067 20.2022 29.264 13.1916 27.7213C-0.103102 24.8 1.53423 5.212 14.8142 4C8.52756 12.3947 19.4929 23.2827 28.0009 17.0773Z"
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
          "transition-transform duration-[var(--duration-flourish)]",
          "ease-[var(--ease-out)]",
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
