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

type GatePhase =
  | "locked"
  | "melting"
  | "granted"
  | "dismiss"
  | "doors"
  | "open";

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

  // Drive global UI states from the unlock sequence:
  //   - "melting": nav + mood toggle blur and fade away alongside the
  //     vault form, leaving a blank screen for the takeover.
  //   - "active": doors / ACCESS GRANTED cover the nav and mood toggle
  //     (they stay in place behind the doors at z-70). Pointer events
  //     are disabled while covered.
  useEffect(() => {
    const html = document.documentElement;
    if (phase === "melting") {
      html.setAttribute("data-vault", "melting");
    } else if (
      phase === "granted" ||
      phase === "dismiss" ||
      phase === "doors"
    ) {
      html.setAttribute("data-vault", "active");
    } else {
      html.removeAttribute("data-vault");
    }
  }, [phase]);

  // Cleanup on unmount in case we navigate away mid-sequence
  useEffect(
    () => () => {
      document.documentElement.removeAttribute("data-vault");
    },
    [],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSPHRASE) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      // Snap to top so when the doors open the user is at the start of
      // the page, not wherever they happened to scroll while typing.
      window.scrollTo({ top: 0, behavior: "instant" });
      setPhase("melting");
      // Timing rationale (offsets relative to submit, +600ms melt prelude):
      //   0–600ms: UI melts away (form, nav, mood toggle blur+fade out)
      //   600–3010ms: AccessGranted stagger + 1.86s sequential scramble
      //   3010–3960ms: 950ms hold so "ACCESS GRANTED" fully registers
      //   3960–4660ms: scale+blur exit (700ms)
      //   4660–5460ms: seam line draws from top + bottom converging at center
      //   5460–5860ms: 400ms tension pause — line fully drawn, doors static
      //   5860–8410ms: door struggle animation (2500ms + 50ms right delay)
      setTimeout(() => setPhase("granted"), 600);
      setTimeout(() => setPhase("dismiss"), 3960);
      setTimeout(() => setPhase("doors"), 5860);
      setTimeout(() => setPhase("open"), 8410);
      return;
    }
    setError(true);
    setValue("");
    setTimeout(() => setError(false), 700);
  };

  return (
    <>
      {/* Form stays mounted during the "melting" phase so it can animate
          out (blur + fade) before the doors and ACCESS GRANTED appear. */}
      {(phase === "locked" || phase === "melting") && (
        <motion.div
          initial={false}
          animate={{
            filter: phase === "melting" ? "blur(48px)" : "blur(0px)",
            opacity: phase === "melting" ? 0 : 1,
          }}
          transition={{ duration: 0.6, ease: ease.out }}
        >
          <VaultForm
            value={value}
            error={error}
            onValueChange={setValue}
            onSubmit={handleSubmit}
          />
        </motion.div>
      )}

      {phase !== "locked" && (
        <motion.div
          className={phase !== "open" ? "pointer-events-none" : undefined}
          initial={false}
          // Content opacity coordinates with the unlock sequence:
          //   - "melting": invisible so the screen reads as blank
          //   - "granted" / "dismiss": dim, hidden behind doors
          //   - "doors": ramps 0.4 → 1 in step with the door burst
          //   - "open": fully visible
          animate={{
            opacity:
              phase === "melting"
                ? 0
                : phase === "doors"
                  ? [0.4, 0.42, 0.42, 0.42, 0.55, 0.55, 1]
                  : phase === "open"
                    ? 1
                    : 0.4,
          }}
          transition={{
            duration: phase === "doors" ? 2.5 : 0,
            ...(phase === "doors"
              ? { times: [0, 0.21, 0.34, 0.45, 0.63, 0.67, 1] }
              : {}),
          }}
        >
          {children}
        </motion.div>
      )}

      {/* Vault doors — mounted from "granted" phase onward as a static
          full-screen cover. Only starts sliding open in "doors" phase.
          This ensures no bleed-through: the doors are already in place
          before the granted overlay fades out. */}
      <AnimatePresence>
        {(phase === "granted" || phase === "dismiss" || phase === "doors") && (
          <VaultDoors
            key="doors"
            opening={phase === "doors"}
            showSeam={phase === "dismiss"}
          />
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
        <Masthead left="INDEX 001.02 / WORK / SEALED" />

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
 * Scramble-decode text effect. Each character is rendered separately
 * with its own staggered lifecycle: invisible → scrambling → locked.
 * Letters appear left-to-right with a slight overlap, like a security
 * system decoding one cipher position at a time.
 *
 * Pool excludes I/M/W (extreme widths) so the heavy display font
 * doesn't visibly jiggle as letters cycle.
 */
const SCRAMBLE_POOL = "ABCDEFGHJKLNOPQRSTUVXYZ";

function ScrambleText({
  text,
  delay = 0,
  stagger = 0.1,
  scrambleDuration = 0.2,
}: {
  text: string;
  delay?: number;
  stagger?: number;
  scrambleDuration?: number;
}) {
  return (
    <span aria-label={text}>
      {text.split("").map((char, i) => (
        <ScrambleChar
          key={i}
          finalChar={char}
          delay={delay + i * stagger}
          scrambleDuration={scrambleDuration}
        />
      ))}
    </span>
  );
}

function ScrambleChar({
  finalChar,
  delay,
  scrambleDuration,
}: {
  finalChar: string;
  delay: number;
  scrambleDuration: number;
}) {
  // Initialize with finalChar so the layout reserves correct width
  // even before the char becomes visible.
  const [display, setDisplay] = useState(finalChar);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const startMs = delay * 1000;
    const lockMs = startMs + scrambleDuration * 1000;
    const start = performance.now();
    let lastScramble = 0;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;

      if (elapsed < startMs) {
        // Before turn: invisible, layout-preserving
        raf = requestAnimationFrame(tick);
        return;
      }

      setVisible(true);

      // Spaces don't scramble — they just appear when their turn comes
      if (finalChar === " " || elapsed >= lockMs) {
        setDisplay(finalChar);
        return;
      }

      // Scrambling — cycle random chars at ~50ms throttle
      if (now - lastScramble >= 50) {
        setDisplay(
          SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)],
        );
        lastScramble = now;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finalChar, delay, scrambleDuration]);

  return <span style={{ opacity: visible ? 1 : 0 }}>{display}</span>;
}

/**
 * "ACCESS GRANTED" — bold centered message on a solid bg overlay.
 * Sits at z-[60] above the vault doors so it exits to reveal
 * the static (not-yet-opening) doors underneath, never the children.
 *
 * Reveal sequence: bg fades in → horizontal rule expands from center →
 * status eyebrow clips up → main text fades in and scramble-decodes →
 * exit: entire overlay scales up + blurs out (rushing into the vault).
 */
function AccessGranted() {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-bg h-dvh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4, ease: ease.out } }}
      exit={{
        scale: 3,
        opacity: 0,
        filter: "blur(20px)",
        transition: { duration: 0.7, ease: [0.4, 0, 1, 1] },
      }}
    >
      <div className="text-center flex flex-col items-center">
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

        {/* Main text — sequential per-letter scramble decode */}
        <p className="font-black text-4xl md:text-6xl uppercase tracking-[-0.02em]">
          <ScrambleText
            text="Access Granted"
            delay={0.55}
            stagger={0.12}
            scrambleDuration={0.3}
          />
        </p>

      </div>
    </motion.div>
  );
}

/**
 * Full-screen vault doors. Mounted as static covers during "granted"
 * phase (z-50, both halves in place). When `opening` flips to true,
 * the doors slide apart. Exit fades out after the animation completes.
 *
 * When `showSeam` is true, a centered vertical hairline animates in
 * (scaleY 0→1 with a brightness pulse) — a "crack of light" through
 * the closed doors that foreshadows the split.
 */
function VaultDoors({
  opening,
  showSeam,
}: {
  opening: boolean;
  showSeam: boolean;
}) {
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
      className="fixed inset-0 z-[70]"
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

      {/* Seam line — two vertical hairlines that draw from top and
          bottom edges simultaneously, meeting at center. Same fg/10
          color as the door edge lines. Renders during "dismiss" phase
          with a 0.7s delay (matches AccessGranted exit duration) so
          the lines only start drawing after the overlay has cleared. */}
      <AnimatePresence>
        {showSeam && (
          <>
            <motion.div
              key="seam-top"
              className="absolute top-0 left-1/2 w-px h-1/2 -translate-x-1/2 bg-fg/10 origin-top"
              initial={{ scaleY: 0 }}
              animate={{
                scaleY: 1,
                transition: { delay: 0.7, duration: 0.8, ease: ease.out },
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            />
            <motion.div
              key="seam-bottom"
              className="absolute bottom-0 left-1/2 w-px h-1/2 -translate-x-1/2 bg-fg/10 origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{
                scaleY: 1,
                transition: { delay: 0.7, duration: 0.8, ease: ease.out },
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
