"use client";

import type React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { Project } from "@/lib/projects";
import { ease } from "@/lib/motion";

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
            fades in place on exit (clip-path reset is delayed until the
            opacity fade completes, so the user only sees a fade). */}
        <span
          aria-hidden
          className="absolute inset-0 bg-fg -z-10 opacity-0 [clip-path:circle(0%_at_var(--slab-x)_var(--slab-y))] [transition:opacity_480ms_cubic-bezier(0.22,1,0.36,1),clip-path_0ms_480ms] group-hover:opacity-100 group-hover:[clip-path:circle(150%_at_var(--slab-x)_var(--slab-y))] group-hover:[transition:opacity_0ms,clip-path_850ms_cubic-bezier(0.22,1,0.36,1)]"
        />

        {/* Index number */}
        <span className="col-span-1 font-mono text-[11px] uppercase text-fg/45 tabular-nums pt-2 transition-colors duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-bg">
          {project.index}
        </span>

        {/* Client name (massive, heavy sans) */}
        <div className="col-span-7 md:col-span-6">
          <h3 className="font-black text-3xl md:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.04em] uppercase transition-colors duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-bg">
            {project.client}
          </h3>
          <p className="font-mono text-[11px] uppercase text-fg/55 mt-2 transition-colors duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-bg/80">
            {project.subtitle}
          </p>
        </div>

        {/* Category */}
        <span className="col-span-2 font-mono text-[11px] uppercase text-fg/55 self-end pb-2 transition-colors duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-bg/80">
          {project.category}
        </span>

        {/* Year */}
        <span className="col-span-2 md:col-span-3 text-right self-end pb-2 font-mono text-[11px] uppercase text-fg/55 tabular-nums transition-colors duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-bg/80">
          {project.year}
        </span>
      </Link>
    </motion.li>
  );
}
