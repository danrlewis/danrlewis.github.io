"use client";

import { type ReactNode, useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  Container,
  DisplayHeading,
  Eyebrow,
  Masthead,
} from "@/components/ui";
import { fadeUpProps } from "@/lib/motion";

const PASSPHRASE = "please";
const STORAGE_KEY = "vault:work";

/**
 * Soft gate for the work archive. Sparse single-input screen — type the
 * passphrase to unlock; state persists in sessionStorage so navigating
 * between /work and /work/[slug] in the same tab keeps the vault open.
 *
 * Layout mirrors the rest of the site (same Container padding, Masthead,
 * DisplayHeading) so it doesn't read as a foreign route.
 *
 * This is decorative, not security. Children are part of the React tree
 * either way; the gate just visually withholds them.
 */
export function VaultGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSPHRASE) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      return;
    }
    setError(true);
    setValue("");
    setTimeout(() => setError(false), 700);
  };

  return (
    <section className="relative flex flex-col">
      <Container className="pt-32 md:pt-40 pb-16">
        <Masthead
          left="INDEX 001.02 / WORK / SEALED"
          right="(LOCKED)"
        />

        <motion.div {...fadeUpProps(0.15)}>
          <DisplayHeading>
            <span className="block">OPEN THE</span>
            <span className="block">VAULT.</span>
          </DisplayHeading>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          {...fadeUpProps(0.5, 0.7)}
          className="mt-16 md:mt-24 max-w-md"
        >
          <Eyebrow as="div" tone="muted" className="mb-3">
            (Passphrase)
          </Eyebrow>
          <motion.input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            animate={error ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full bg-transparent border-b-2 border-fg/30 focus:border-fg outline-none font-mono text-2xl md:text-3xl py-3 transition-colors caret-fg"
            aria-label="Vault passphrase"
            aria-invalid={error}
          />
          <Eyebrow tone="muted" className="mt-4 block">
            {error ? "(Denied. Try again.)" : "(Press ↵ to enter.)"}
          </Eyebrow>
        </motion.form>
      </Container>
    </section>
  );
}
