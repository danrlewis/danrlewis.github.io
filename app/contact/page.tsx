"use client";

import { motion } from "motion/react";
import { Container, DisplayHeading, Eyebrow, Masthead } from "@/components/ui";
import { fadeUpProps } from "@/lib/motion";

const YEAR = new Date().getFullYear();

export default function ContactPage() {
  return (
    <section className="relative flex flex-col">
      <Container className="pt-24 md:pt-32 pb-16">
        <Masthead
          left="INDEX 001.03 / CONTACT"
          right={`(AVAILABLE ${YEAR})`}
        />

        <motion.div {...fadeUpProps(0.15)}>
          <DisplayHeading>
            <span className="block">GET IN</span>
            <span className="block">TOUCH.</span>
          </DisplayHeading>
        </motion.div>

        {/* Two-column spec block — Direct + Elsewhere */}
        <motion.div
          className="mt-16 md:mt-24 h-px bg-border"
          {...fadeUpProps(0.35, 0.7)}
        />
        <div className="pt-8 grid grid-cols-12 gap-6 md:gap-4">
          <motion.div
            {...fadeUpProps(0.45, 0.7)}
            className="col-span-12 md:col-span-7"
          >
            <Eyebrow tone="muted" className="block mb-3">
              (Direct)
            </Eyebrow>
            <a
              href="mailto:hello@danrlewis.me"
              className="block font-[family-name:var(--font-pixel)] font-black text-2xl md:text-4xl leading-[1] tracking-tight uppercase break-all hover:text-accent transition-colors"
            >
              hello@danrlewis.me
            </a>
          </motion.div>

          <motion.div
            {...fadeUpProps(0.55, 0.7)}
            className="col-span-12 md:col-span-4 md:col-start-9 font-mono text-[11px] uppercase"
          >
            <Eyebrow tone="muted" className="block mb-3">
              (Elsewhere)
            </Eyebrow>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="https://linkedin.com/in/danrlewis"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between border-b border-fg/15 pb-2 hover:border-accent transition-colors"
                >
                  <span className="transition-transform group-hover:translate-x-1">
                    LinkedIn
                  </span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between border-b border-fg/15 pb-2 hover:border-accent transition-colors"
                >
                  <span className="transition-transform group-hover:translate-x-1">
                    GitHub
                  </span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
