"use client";

import { motion } from "motion/react";
import { Container, DisplayHeading, Masthead } from "@/components/ui";
import { ProjectRow } from "@/components/project-row";
import { VaultGate } from "@/components/vault-gate";
import { fadeUpProps } from "@/lib/motion";
import { projectCount, projects, yearRange } from "@/lib/projects";

export default function WorkPage() {
  return (
    <VaultGate>
      <section className="relative flex flex-col">
        <Container className="pt-24 md:pt-32 pb-16">
          <Masthead
            left="INDEX 001.02 / WORK"
            right={`${projectCount} PROJECTS / ${yearRange}`}
          />

          <motion.div {...fadeUpProps(0.15)}>
            {/* lg (not xl) so "SELECTED." stays on one line at 375px —
                9 chars at 22vw overflows the content rail. */}
            <DisplayHeading size="lg">SELECTED.</DisplayHeading>
          </motion.div>

          {/* Project list */}
          <motion.div
            className="mt-16 md:mt-24 h-px bg-border"
            {...fadeUpProps(0.3, 0.7)}
          />
          <ul className="">
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
            (End / {projectCount})
          </motion.div>
        </Container>
      </section>
    </VaultGate>
  );
}
