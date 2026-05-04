"use client";

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
 * else. Hover floods the row with the project's swatch color.
 */
export function ProjectRow({ project, delay = 0 }: ProjectRowProps) {
  return (
    <motion.li
      initial={{ y: 28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.7, ease: ease.out }}
      className="border-b last:border-b-0 relative overflow-hidden"
    >
      <Link
        href={`/work/${project.slug}`}
        className="group isolate relative grid grid-cols-12 gap-4 items-baseline py-5 md:py-7"
      >
        {/* Mono slab slides in from left on hover — flips fg/bg */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-0 bg-fg transition-all duration-[var(--duration-base)] ease-out group-hover:w-full -z-10"
        />

        {/* Index number */}
        <span className="col-span-1 font-mono text-[11px] uppercase text-fg/45 tabular-nums pt-2 transition-colors duration-[var(--duration-base)] group-hover:text-bg">
          {project.index}
        </span>

        {/* Client name (massive, heavy sans) */}
        <div className="col-span-7 md:col-span-6">
          <h3 className="font-black text-3xl md:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.04em] uppercase transition-colors duration-[var(--duration-base)] group-hover:text-bg">
            {project.client}
          </h3>
          <p className="font-mono text-[11px] uppercase text-fg/55 mt-2 transition-colors duration-[var(--duration-base)] group-hover:text-bg/80">
            {project.subtitle}
          </p>
        </div>

        {/* Category */}
        <span className="col-span-2 font-mono text-[11px] uppercase text-fg/55 self-end pb-2 transition-colors duration-[var(--duration-base)] group-hover:text-bg/80">
          {project.category}
        </span>

        {/* Year */}
        <span className="col-span-2 md:col-span-3 text-right self-end pb-2 font-mono text-[11px] uppercase text-fg/55 tabular-nums transition-colors duration-[var(--duration-base)] group-hover:text-bg/80">
          {project.year}
        </span>
      </Link>
    </motion.li>
  );
}
