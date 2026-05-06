"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Container, DisplayHeading, Masthead } from "@/components/ui";
import { fadeUpProps } from "@/lib/motion";
import { indexRowRecipe } from "@/lib/design-system";

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
          className="mt-20 md:mt-28 h-px bg-border"
          {...fadeUpProps(0.4, 0.7)}
        />
        <div className="pt-6 grid grid-cols-12 gap-6">
          <motion.div
            {...fadeUpProps(0.5, 0.7)}
            className="col-span-12 md:col-span-7 font-mono text-[12px] md:text-[13px] uppercase leading-[1.7] text-ink-body"
          >
            <p>
              <span className="text-ink-label mr-2">(BIO)</span>
              Lead Experience Designer at Airbnb. Open to a small number of
              freelance engagements through {YEAR}. Product, design, and the
              front-end that ships them. Twenty-plus years of
              building software, expertise now accelerated by AI.
            </p>
          </motion.div>

          <motion.div
            {...fadeUpProps(0.6, 0.7)}
            className="col-span-12 md:col-span-4 md:col-start-9 font-mono text-[11px] uppercase"
          >
            <div className="text-ink-label mb-3">(NEXT)</div>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/work" className={indexRowRecipe.link}>
                  <span className={indexRowRecipe.cell}>Selected Work</span>
                  <span className={indexRowRecipe.cell}>→</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className={indexRowRecipe.link}>
                  <span className={indexRowRecipe.cell}>Get in touch</span>
                  <span className={indexRowRecipe.cell}>→</span>
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
