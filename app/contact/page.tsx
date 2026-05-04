"use client";

import { motion } from "motion/react";
import { Container, Eyebrow } from "@/components/ui";
import { ease } from "@/lib/motion";

const YEAR = new Date().getFullYear();

export const dynamic = "force-static";

export default function ContactPage() {
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
          <div className="col-span-6">INDEX 001.03 / CONTACT</div>
          <div className="col-span-6 text-right">(AVAILABLE {YEAR})</div>
        </motion.div>

        {/* Massive heading */}
        <motion.h1
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.9, ease: ease.out }}
          className="font-black text-[22vw] md:text-[18vw] leading-[0.85] tracking-[-0.045em] -ml-[0.04em]"
        >
          <span className="block">GET IN</span>
          <span className="block">TOUCH.</span>
        </motion.h1>

        {/* Three-column spec block */}
        <motion.div
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: ease.out }}
          className="mt-16 md:mt-24 pt-8 border-t grid grid-cols-12 gap-6 md:gap-4"
        >
          <div className="col-span-12 md:col-span-5">
            <Eyebrow tone="muted" className="block mb-3">
              (Direct)
            </Eyebrow>
            <a
              href="mailto:hello@danrlewis.me"
              className="block font-black text-2xl md:text-4xl leading-[1] tracking-tight uppercase break-all hover:text-accent transition-colors"
            >
              hello@danrlewis.me
            </a>
          </div>

          <div className="col-span-12 md:col-span-3 md:col-start-7">
            <Eyebrow tone="muted" className="block mb-3">
              (Best Fit)
            </Eyebrow>
            <p className="font-mono text-[11px] md:text-[13px] uppercase leading-[1.7] text-fg/85">
              Brand-defining product work. Design systems. Marketing sites that
              feel like an object. iOS launches that need to land. Engagements
              run small (you, me, maybe a partner) and ship in weeks, not
              quarters.
            </p>
          </div>

          <div className="col-span-12 md:col-span-3 md:col-start-10">
            <Eyebrow tone="muted" className="block mb-3">
              (Elsewhere)
            </Eyebrow>
            <ul className="flex flex-col gap-2 font-mono text-[11px] md:text-[13px] uppercase">
              <li>
                <a
                  href="https://linkedin.com/in/danrlewis"
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg/85 hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  LinkedIn <span aria-hidden>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://read.cv/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg/85 hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  Read.cv <span aria-hidden>↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg/85 hover:text-accent transition-colors inline-flex items-center gap-2"
                >
                  GitHub <span aria-hidden>↗</span>
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
