"use client";

import { type ReactNode, useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Container,
  DisplayHeading,
  Eyebrow,
  Masthead,
} from "@/components/ui";
import { ease, fadeUpProps } from "@/lib/motion";

const PASSPHRASE = "please";
const STORAGE_KEY = "vault:work";

type GatePhase = "locked" | "granted" | "dismiss" | "doors" | "open";

/**
 * Soft gate for the work archive. Sparse single-input screen — type the
 * passphrase to unlock; state persists in sessionStorage so navigating
 * between /work and /work/[slug] in the same tab keeps the vault open.
 *
 * Unlock sequence: form → "ACCESS GRANTED" flash → vault doors split →
 * content revealed. The doors layer is mounted from the "granted" phase
 * onward (static, covering the screen) so there's never a frame where
 * children bleed through during transitions.
 */
export function VaultGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<GatePhase>("locked");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setPhase("open");
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSPHRASE) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setPhase("granted");
      setTimeout(() => setPhase("dismiss"), 1400);
      setTimeout(() => setPhase("doors"), 2000);
      setTimeout(() => setPhase("open"), 4550);
      return;
    }
    setError(true);
    setValue("");
    setTimeout(() => setError(false), 700);
  };

  return (
    <>
      {/* Form is page-flow content, only visible when locked */}
      {phase === "locked" && (
        <VaultForm
          value={value}
          error={error}
          onValueChange={setValue}
          onSubmit={handleSubmit}
        />
      )}

      {phase !== "locked" && (
        <div className={phase !== "open" ? "pointer-events-none" : undefined}>
          {children}
        </div>
      )}

      {/* Vault doors — mounted from "granted" phase onward as a static
          full-screen cover. Only starts sliding open in "doors" phase.
          This ensures no bleed-through: the doors are already in place
          before the granted overlay fades out. */}
      <AnimatePresence>
        {(phase === "granted" || phase === "dismiss" || phase === "doors") && (
          <VaultDoors key="doors" opening={phase === "doors"} />
        )}
      </AnimatePresence>

      {/* "ACCESS GRANTED" sits on top of everything (z-[60]) */}
      <AnimatePresence>
        {phase === "granted" && <AccessGranted key="granted" />}
      </AnimatePresence>
    </>
  );
}

/** The locked form screen */
function VaultForm({
  value,
  error,
  onValueChange,
  onSubmit,
}: {
  value: string;
  error: boolean;
  onValueChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <section className="relative flex flex-col">
      <Container className="pt-24 md:pt-32 pb-16">
        <Masthead left="INDEX 001.02 / WORK / SEALED" right="(LOCKED)" />

        <motion.div {...fadeUpProps(0.15)}>
          <DisplayHeading size="lg">
            <span className="block">OPEN THE</span>
            <span className="block">VAULT.</span>
          </DisplayHeading>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          {...fadeUpProps(0.5, 0.7)}
          className="mt-16 md:mt-24 max-w-md"
        >
          <Eyebrow as="div" tone="muted" className="mb-3">
            (Passphrase)
          </Eyebrow>
          <motion.input
            type="password"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
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

/**
 * "ACCESS GRANTED" — bold centered message on a solid bg overlay.
 * Sits at z-[60] above the vault doors so it exits to reveal
 * the static (not-yet-opening) doors underneath, never the children.
 *
 * Reveal sequence: bg fades in → horizontal rule expands from center →
 * text wipes up into view (overflow-hidden clip) → holds →
 * exit: entire overlay scales up + blurs out (rushing into the vault).
 */
function AccessGranted() {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-bg h-dvh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4, ease: ease.out } }}
      exit={{
        scale: 3,
        opacity: 0,
        filter: "blur(20px)",
        transition: { duration: 0.55, ease: [0.4, 0, 1, 1] },
      }}
    >
      <div className="text-center flex flex-col items-center">
        {/* Decorative rule — expands from center */}
        <motion.div
          className="w-16 md:w-24 h-px bg-fg/30 mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: ease.inOut, delay: 0.2 }}
        />

        {/* Status eyebrow — clips up into view */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.5, ease: ease.out, delay: 0.4 }}
          >
            <Eyebrow tone="muted" className="mb-4">
              (Status)
            </Eyebrow>
          </motion.div>
        </div>

        {/* Main text — clips up into view, staggered per word */}
        <div className="overflow-hidden">
          <motion.p
            className="font-black text-4xl md:text-6xl uppercase tracking-[-0.02em]"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.6, ease: ease.out, delay: 0.55 }}
          >
            Access Granted
          </motion.p>
        </div>

        {/* Bottom rule — expands from center, slightly delayed */}
        <motion.div
          className="w-16 md:w-24 h-px bg-fg/30 mt-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: ease.inOut, delay: 0.75 }}
        />
      </div>
    </motion.div>
  );
}

/**
 * Full-screen vault doors. Mounted as static covers during "granted"
 * phase (z-50, both halves in place). When `opening` flips to true,
 * the doors slide apart. Exit fades out after the animation completes.
 */
function VaultDoors({ opening }: { opening: boolean }) {
  // Staged keyframes: struggle → recoil → gather → struggle again → stick → burst
  //  0%  → closed
  //  6%  → first wedge (all strength spent)
  //  3%  → recoil (doors creep back from their own weight)
  //  3%  → hold (gathering strength — dramatic beat)
  // 12%  → second wedge (push further this time)
  // 12%  → stick (doors resist at peak effort)
  // 100% → burst open (door finally gives)
  const leftKeyframes = ["0%", "-6%", "-3%", "-3%", "-12%", "-12%", "-100%"];
  const rightKeyframes = ["0%", "6%", "3%", "3%", "12%", "12%", "100%"];
  const timings = {
    duration: 2.5,
    times: [0, 0.21, 0.34, 0.45, 0.63, 0.67, 1],
    ease: [
      [0.45, 0, 0.5, 1],    // struggle 1: build force, decelerate as doors resist
      [0.16, 0.7, 0.5, 1],  // recoil: brisk start, slow settle
      [0.5, 0, 0.5, 0.5],   // hold: linear pause
      [0.45, 0, 0.5, 1],    // struggle 2: same effortful arc
      [0.5, 0, 0.5, 0.5],   // stick: linear, doors resisting
      [0.12, 1, 0.2, 1],    // burst: explosive release
    ] as [number, number, number, number][],
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left door */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2 bg-bg"
        animate={{ x: opening ? leftKeyframes : "0%" }}
        transition={opening ? timings : { duration: 0 }}
      >
        {opening && <div className="absolute inset-y-0 right-0 w-px bg-fg/10" />}
      </motion.div>

      {/* Right door — trails slightly */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2 bg-bg"
        animate={{ x: opening ? rightKeyframes : "0%" }}
        transition={opening ? { ...timings, delay: 0.05 } : { duration: 0 }}
      >
        {opening && <div className="absolute inset-y-0 left-0 w-px bg-fg/10" />}
      </motion.div>

    </motion.div>
  );
}
