"use client";

import { type ReactNode, useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Container, Eyebrow } from "@/components/ui";
import { ease } from "@/lib/motion";

const PASSPHRASE = "please";
const STORAGE_KEY = "vault:work";

/**
 * Soft gate for the work archive. Sparse single-input screen — type the
 * passphrase to unlock; state persists in sessionStorage so navigating
 * between /work and /work/[slug] in the same tab keeps the vault open.
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
      <Container className="pt-32 md:pt-40 pb-24 min-h-[80vh] flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-12 gap-4 mb-10 md:mb-16 font-mono text-[11px] uppercase text-fg/55"
        >
          <div className="col-span-6">INDEX 001.02 / WORK / SEALED</div>
          <div className="col-span-6 text-right">(LOCKED)</div>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center">
          <motion.h1
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.9, ease: ease.out }}
            className="font-black text-[16vw] md:text-[10vw] leading-[0.85] tracking-[-0.045em] -ml-[0.04em]"
          >
            <span className="block">OPEN THE</span>
            <span className="block">VAULT.</span>
          </motion.h1>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: ease.out }}
            className="mt-12 md:mt-16 max-w-md"
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
        </div>
      </Container>
    </section>
  );
}
