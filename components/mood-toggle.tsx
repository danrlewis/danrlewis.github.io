"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { Eyebrow } from "@/components/ui";

type MoodToggleProps = {
  /** When true, render only the switch + state label, no leading "Mood" eyebrow. */
  hideLabel?: boolean;
};

// View Transitions API — Chrome 111+, Safari 18+. Lets us drive a clip-path
// wipe between the old and new theme via ::view-transition-* pseudos in
// globals.css. Falls back to plain setTheme on unsupported browsers, where
// the existing CSS color transitions still produce a (less interesting)
// crossfade.
type DocumentWithViewTransitions = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export function MoodToggle({ hideLabel = false }: MoodToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // Pre-mount default matches the layout default (Day). The handle position
  // is driven by the CSS variable --toggle-x set on the html .day/.night
  // classes — that variable is correct from first paint (next-themes' inline
  // pre-hydration script sets the class before render), so the handle never
  // visibly "snaps" on load.
  const isDay = !mounted || resolvedTheme === "light";
  const stateLabel = isDay ? "Day" : "Night";
  const ariaLabel = mounted
    ? `Switch to ${isDay ? "Night" : "Day"} mood`
    : "Switch mood";

  const onToggle = () => {
    if (!mounted) return;
    const next = isDay ? "dark" : "light";
    const doc = document as DocumentWithViewTransitions;

    // The wipe emanates from the toggle button itself — both directions
    // start at the toggle's viewport position so the change feels like
    // it's radiating from the control the user just clicked.
    const rect = buttonRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight;
    const root = document.documentElement;
    root.style.setProperty("--wipe-x", `${cx}px`);
    root.style.setProperty("--wipe-y", `${cy}px`);

    if (typeof doc.startViewTransition === "function") {
      // flushSync inside the callback ensures next-themes' DOM mutation
      // (the html class swap) lands synchronously, so the API's "after"
      // snapshot captures the new theme.
      doc.startViewTransition(() => {
        flushSync(() => setTheme(next));
      });
      return;
    }
    setTheme(next);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      className="group flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer"
    >
      {!hideLabel && <Eyebrow tone="muted">Mood</Eyebrow>}
      <span className="relative inline-flex h-[18px] w-[42px] items-center rounded-[var(--radius-pill)] border border-fg/30 px-[2px]">
        <span
          className="block h-3 w-3 rounded-[var(--radius-pill)] bg-fg transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: "translateX(var(--toggle-x))" }}
        />
      </span>
      <Eyebrow tone="muted" className="w-8 text-left tabular-nums">
        {stateLabel}
      </Eyebrow>
    </button>
  );
}
