"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/ui";
import { springSnappy } from "@/lib/motion";

type MoodToggleProps = {
  /** When true, render only the switch + state label, no leading "Mood" eyebrow. */
  hideLabel?: boolean;
};

export function MoodToggle({ hideLabel = false }: MoodToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Until mounted, theme is unknown — render the neutral starting state
  // (Night) so server and client agree. Dynamic theme reads only after mount.
  const isDay = mounted && resolvedTheme === "light";
  const stateLabel = mounted ? (isDay ? "Day" : "Night") : "Night";
  const ariaLabel = mounted
    ? `Switch to ${isDay ? "Night" : "Day"} mood`
    : "Switch mood";

  const onToggle = () => {
    if (!mounted) return;
    setTheme(isDay ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      className="group flex items-center gap-2 hover:opacity-70 transition-opacity"
    >
      {!hideLabel && <Eyebrow tone="muted">Mood</Eyebrow>}
      <span className="relative inline-flex h-[18px] w-[42px] items-center rounded-[var(--radius-pill)] border border-fg/30 px-[2px]">
        <motion.span
          className="block h-3 w-3 rounded-[var(--radius-pill)] bg-fg"
          animate={{ x: isDay ? 22 : 0 }}
          transition={springSnappy}
        />
      </span>
      <Eyebrow tone="muted" className="w-8 text-left tabular-nums">
        {stateLabel}
      </Eyebrow>
    </button>
  );
}
