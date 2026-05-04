"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui";
import { ease } from "@/lib/motion";

const YEAR = new Date().getFullYear();

export function Hero() {
  return (
    <section className="relative flex flex-col">
      <Container className="pt-32 md:pt-40 pb-16">
        {/* Single masthead row — archive index + edition */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-12 gap-4 mb-10 md:mb-16 font-mono text-[11px] uppercase text-fg/55"
        >
          <div className="col-span-6">INDEX 001.01</div>
          <div className="col-span-6 text-right">VOL. 01 / {YEAR}</div>
        </motion.div>

        {/* Massive identity headline — heavy sans, brutalist scale */}
        <motion.div
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.9, ease: ease.out }}
        >
          <h1 className="font-black text-[22vw] md:text-[18vw] leading-[0.85] tracking-[-0.045em] -ml-[0.04em]">
            <span className="block">DANIEL</span>
            <span className="block">LEWIS.</span>
          </h1>
        </motion.div>

        {/* Bio + Next — mono, info-dense, archive style */}
        <motion.div
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: ease.out }}
          className="mt-20 md:mt-28 pt-6 border-t grid grid-cols-12 gap-6"
        >
          <div className="col-span-12 md:col-span-7 font-mono text-[12px] md:text-[13px] uppercase leading-[1.7] text-fg/85">
            <p>
              <span className="text-fg/45 mr-2">(BIO)</span>
              Lead Experience Designer at Airbnb. Open to a small number of
              freelance engagements through {YEAR}. Product, design, and the
              front-end that ships them. Twenty-plus years of
              building software, expertise now accelerated by AI.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 md:col-start-9 font-mono text-[11px] uppercase">
            <div className="text-fg/45 mb-3">(NEXT)</div>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="/work"
                  className="group flex items-center justify-between border-b border-fg/15 pb-2 hover:border-accent transition-colors"
                >
                  <span>Selected Work</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="group flex items-center justify-between border-b border-fg/15 pb-2 hover:border-accent transition-colors"
                >
                  <span>Get in touch</span>
                  <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
