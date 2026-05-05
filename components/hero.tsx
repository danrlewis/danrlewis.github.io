"use client";

import { motion } from "motion/react";
import { Container, DisplayHeading, Masthead } from "@/components/ui";
import { fadeUpProps } from "@/lib/motion";

const YEAR = new Date().getFullYear();

export function Hero() {
  return (
    <section className="relative flex flex-col">
      <Container className="pt-24 md:pt-32 pb-16">
        <Masthead left="INDEX 001.01" right={`VOL. 01 / ${YEAR}`} />

        {/* Massive identity headline — heavy sans, brutalist scale */}
        <motion.div {...fadeUpProps(0.15)}>
          <DisplayHeading>
            <span className="block">DANIEL</span>
            <span className="block">LEWIS.</span>
          </DisplayHeading>
        </motion.div>

        {/* Bio + Next — mono, info-dense, archive style */}
        <motion.div
          {...fadeUpProps(0.7, 0.8)}
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
                  <span className="transition-transform group-hover:translate-x-1">Selected Work</span>
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
                  <span className="transition-transform group-hover:translate-x-1">Get in touch</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
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
