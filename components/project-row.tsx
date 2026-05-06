"use client";

import { clsx } from "clsx";
import type React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/lib/projects";
import { ease } from "@/lib/motion";
import { slabHoverRecipe, shiftTransition } from "@/lib/design-system";

type ProjectRowProps = {
  project: Project;
  delay?: number;
};

/**
 * Brutalist archive row. Heavy sans for the client name, mono for everything
 * else. Hover blooms a clip-path circle from the cursor's entry point and
 * fades in place on exit (no contraction back to cursor) — matches the
 * menu item interaction.
 */
export function ProjectRow({ project, delay = 0 }: ProjectRowProps) {
  const setOrigin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--slab-x", `${x}%`);
    e.currentTarget.style.setProperty("--slab-y", `${y}%`);
  };

  const slab = slabHoverRecipe({ bg: "bg-fg" });

  return (
    <motion.li
      initial={{ y: 28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.7, ease: ease.out }}
      className="border-b last:border-b-0 relative overflow-hidden"
    >
      <Link
        href={`/work/${project.slug}`}
        onMouseEnter={setOrigin}
        className="group isolate relative grid grid-cols-12 gap-4 items-baseline py-5 md:py-7"
        style={{
          ["--slab-x" as string]: "50%",
          ["--slab-y" as string]: "50%",
        }}
      >
        {/* Bloom slab — clip-path circle grows from cursor on enter,
            fades in place on exit. Recipe encapsulates the asymmetric
            transition timings. */}
        <span aria-hidden className={slab.slab} />

        {/* Index number */}
        <span
          className={clsx(
            "col-span-1 font-mono text-[11px] uppercase text-ink-label tabular-nums pt-2",
            shiftTransition,
            "group-hover:text-bg",
          )}
        >
          {project.index}
        </span>

        {/* Client name (massive, heavy sans) */}
        <div className="col-span-7 md:col-span-6">
          <h3
            className={clsx(
              "font-black text-3xl md:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.04em] uppercase",
              shiftTransition,
              "group-hover:text-bg",
            )}
          >
            {project.client}
          </h3>
          <p
            className={clsx(
              "font-mono text-[11px] uppercase text-ink-secondary mt-2",
              shiftTransition,
              "group-hover:text-bg/80",
            )}
          >
            {project.subtitle}
          </p>
        </div>

        {/* Category */}
        <span
          className={clsx(
            "col-span-2 font-mono text-[11px] uppercase text-ink-secondary self-end pb-2",
            shiftTransition,
            "group-hover:text-bg/80",
          )}
        >
          {project.category}
        </span>

        {/* Year */}
        <span
          className={clsx(
            "col-span-2 md:col-span-3 text-right self-end pb-2 font-mono text-[11px] uppercase text-ink-secondary tabular-nums",
            shiftTransition,
            "group-hover:text-bg/80",
          )}
        >
          {project.year}
        </span>
      </Link>
    </motion.li>
  );
}
