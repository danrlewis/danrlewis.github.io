"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui";
import { ProjectRow } from "@/components/project-row";
import { ease } from "@/lib/motion";
import { projects } from "@/lib/projects";

const YEAR_RANGE = (() => {
  const years = projects.map((p) => p.year);
  return `${Math.min(...years)}–${Math.max(...years)}`;
})();

export default function WorkPage() {
  return (
    <section className="relative flex flex-col">
      <Container className="pt-32 md:pt-40 pb-16">
        {/* Masthead */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-12 gap-4 mb-10 md:mb-16 font-mono text-[11px] uppercase text-fg/55"
        >
          <div className="col-span-6">INDEX 001.02 / WORK</div>
          <div className="col-span-6 text-right">
            {String(projects.length).padStart(2, "0")} PROJECTS / {YEAR_RANGE}
          </div>
        </motion.div>

        {/* Massive heading */}
        <motion.h1
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.9, ease: ease.out }}
          className="font-black text-[22vw] md:text-[18vw] leading-[0.85] tracking-[-0.045em] -ml-[0.04em]"
        >
          SELECTED.
        </motion.h1>

        {/* Project list */}
        <ul className="mt-16 md:mt-24 border-t">
          {projects.map((project, i) => (
            <ProjectRow
              key={project.slug}
              project={project}
              delay={0.4 + i * 0.06}
            />
          ))}
        </ul>

        {/* End marker — quiet, no slab */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + projects.length * 0.06, duration: 0.6 }}
          className="mt-8 md:mt-10 font-mono text-[11px] uppercase text-fg/45"
        >
          (End / {String(projects.length).padStart(2, "0")})
        </motion.div>
      </Container>
    </section>
  );
}
