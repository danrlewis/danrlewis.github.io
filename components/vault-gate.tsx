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
      // Timing rationale — cinematic ancient-vault crumble:
      //   0–1800ms: Ground shakes (body shake catalyst)
      //   300–1800ms: Mark explodes — relic breaks first
      //   900–2000ms: Mood toggle starts falling DURING shake
      //   1200–2300ms: Nav starts falling
      //   1300–1700ms: Form debris (Masthead, heading, labels) all
      //              start crumbling within the shake window. Heading
      //              "OPEN THE VAULT" early letters fall at 0.7s during
      //              the mark-spin while it still scrambles
      //   ~3100ms: Last letters cleared — dust settles
      //   3200–4910ms: AccessGranted parallel scramble (random lock order)
      //   4910–6260ms: ~1350ms hold
      //   6260–6810ms: scale+blur exit (550ms)
      //   6810–7660ms: seam line draws (creep + hesitate + spring overshoot)
      //   7660–7810ms: 150ms breathing beat after the snap
      //   7810–10360ms: door struggle animation (2500 + 50ms)
      setTimeout(() => setPhase("granted"), 3200);
      setTimeout(() => setPhase("dismiss"), 6260);
      setTimeout(() => setPhase("doors"), 7810);
      setTimeout(() => setPhase("open"), 10360);
      return;
    }
    setError(true);
    setValue("");
    setTimeout(() => setError(false), 700);
  };

  return (
    <>
      {/* Mark explosion filter — mounted only during the "melting"
          phase so SMIL fires fresh on each unlock. Holds at scale 0
          for the first ~60% (mark spinning + jittering with no
          displacement yet), then ramps the displacement up sharply so
          the pixels scatter outward as the mark scales up 3x and fades.
          The wide filter region accommodates the scale-up explosion. */}
      {phase === "melting" && (
        <svg aria-hidden className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <filter
              id="vault-mark-dissolve"
              x="-700%"
              y="-700%"
              width="1500%"
              height="1500%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.5"
                numOctaves="2"
                seed="11"
                stitchTiles="stitch"
              />
              <feDisplacementMap
                in="SourceGraphic"
                scale="0"
                xChannelSelector="R"
                yChannelSelector="G"
              >
                <animate
                  attributeName="scale"
                  values="0; 0; 80; 200"
                  keyTimes="0; 0.55; 0.85; 1"
                  dur="1.5s"
                  begin="0.3s"
                  fill="freeze"
                />
              </feDisplacementMap>
            </filter>

          </defs>
        </svg>
      )}

      {/* Form stays mounted during the "melting" phase so each letter
          can chaotically fall off the bottom of the screen. The form
          itself has no whole-element transform — each child handles
          its own animation so letter-level chaos isn't compounded. */}
      {(phase === "locked" || phase === "melting") && (
        <VaultForm
          falling={phase === "melting"}
          value={value}
          error={error}
          onValueChange={setValue}
          onSubmit={handleSubmit}
        />
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
          before the granted overlay fades out.

          No AnimatePresence wrap: the doors are at -100% / +100% (fully
          off-screen) at the moment phase flips to "open", so an opacity
          exit fade adds nothing visible — but it would freeze the inner
          seam lines (`{opening && ...}`) at the viewport edges for the
          full duration of the fade, leaving a faint 1px vertical
          artifact on the left and right of the screen. Unmount instantly
          instead. */}
      {(phase === "granted" || phase === "dismiss" || phase === "doors") && (
        <VaultDoors
          opening={phase === "doors"}
          showSeam={phase === "dismiss"}
        />
      )}

      {/* "ACCESS GRANTED" sits on top of everything (z-[60]) */}
      <AnimatePresence>
        {phase === "granted" && <AccessGranted key="granted" />}
      </AnimatePresence>
    </>
  );
}

/** The locked form screen. When `falling` flips true (melting phase),
 *  every text element disintegrates letter-by-letter off the bottom of
 *  the screen with chaotic randomized delays/drift/rotation. The input
 *  field falls as a whole (HTMLInputElement can't be split). */
function VaultForm({
  falling,
  value,
  error,
  onValueChange,
  onSubmit,
}: {
  falling: boolean;
  value: string;
  error: boolean;
  onValueChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  // Whole-element fall for the input. Cascade is tight — every piece
  // of "ancient debris" starts crumbling within the 1.8s shake window.
  const wholeFall = {
    initial: false,
    animate: {
      y: falling ? "120vh" : 0,
      opacity: falling ? 0 : 1,
      filter: falling ? "blur(8px)" : "blur(0px)",
    },
    transition: {
      y: { delay: 1.55, duration: 1.0, ease: [0.55, 0.085, 0.68, 0.53] },
      opacity: { delay: 2.05, duration: 0.5, ease: [0.6, 0, 0.4, 1] },
      filter: { delay: 1.55, duration: 0.4, ease: ease.out },
    },
  } as const;

  return (
    <section className="relative flex flex-col">
      <Container className="pt-24 md:pt-32 pb-16">
        <Masthead
          left={
            <FallingText
              text="INDEX 001.02 / WORK / SEALED"
              falling={falling}
              baseDelay={1.3}
            />
          }
        />

        <motion.div {...fadeUpProps(0.15)}>
          <DisplayHeading size="lg">
            <span className="block">
              <FallingText
                text="OPEN THE"
                falling={falling}
                baseDelay={1.4}
                scrambleDuration={1.5}
                scrambleDelay={0.25}
                earlyFallChance={0.35}
                earlyBaseDelay={0.7}
              />
            </span>
            <span className="block">
              <FallingText
                text="VAULT."
                falling={falling}
                baseDelay={1.45}
                scrambleDuration={1.5}
                scrambleDelay={0.3}
                earlyFallChance={0.35}
                earlyBaseDelay={0.85}
              />
            </span>
          </DisplayHeading>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          {...fadeUpProps(0.5, 0.7)}
          className="mt-16 md:mt-24 max-w-md"
        >
          <Eyebrow as="div" tone="muted" className="mb-3">
            <FallingText
              text="(Passphrase)"
              falling={falling}
              baseDelay={1.5}
            />
          </Eyebrow>
          <motion.input
            type="password"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            autoFocus
            {...(falling
              ? wholeFall
              : {
                  animate: error
                    ? { x: [-8, 8, -6, 6, -3, 3, 0] }
                    : { x: 0 },
                  transition: { duration: 0.45 },
                })}
            className="w-full bg-transparent border-b-2 border-fg/30 focus:border-fg outline-none font-mono text-2xl md:text-3xl py-3 transition-colors caret-fg"
            aria-label="Vault passphrase"
            aria-invalid={error}
          />
          <Eyebrow tone="muted" className="mt-4 block">
            <FallingText
              text={error ? "(Denied. Try again.)" : "(Press ↵ to enter.)"}
              falling={falling}
              baseDelay={1.6}
            />
          </Eyebrow>
        </motion.form>
      </Container>
    </section>
  );
}

/**
 * Pseudo-random per-character helper. Produces a deterministic 0–1
 * value for character `i` and a `seed`, so we can derive multiple
 * independent "random" values per letter without an actual RNG.
 */
function chaos(i: number, seed: number) {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Letters-only pool for the AG scramble-decode (intermediate chars
 *  during the reveal). Excludes I/M/W (extreme widths) so the heavy
 *  display font doesn't visibly jiggle as letters cycle. */
const SCRAMBLE_POOL = "ABCDEFGHJKLNOPQRSTUVXYZ";

/** Chaos pool — letters, numbers, and a few symbols for the disjointed
 *  malfunction scramble during the unlock catalyst. Mixing in digits
 *  and symbols makes it feel like a glitched display, not just letters. */
const CHAOS_POOL = "ABCDEFGHJKLNOPQRSTUVXYZ0123456789#@&%*+";

/**
 * Letter-by-letter fall-off-screen effect. Splits text into spans;
 * each letter gets its own randomized delay, fall duration, horizontal
 * drift, and rotation so the whole word disintegrates chaotically off
 * the bottom of the screen with motion blur. Non-letter chars (spaces,
 * parens, punctuation) animate the same way so the layout doesn't
 * break.
 */
function FallingText({
  text,
  falling,
  baseDelay = 0,
  scrambleDuration = 0,
  scrambleDelay = 0,
  earlyFallChance = 0,
  earlyBaseDelay = 0,
}: {
  text: string;
  falling: boolean;
  baseDelay?: number;
  /** When > 0, pre-fall scramble runs (disjointed malfunction) */
  scrambleDuration?: number;
  /** Seconds to wait after `falling` becomes true before scramble starts */
  scrambleDelay?: number;
  /** Probability (0–1) that a given letter falls EARLY (mid-scramble)
   *  instead of waiting for the main cascade. */
  earlyFallChance?: number;
  /** Base delay used when a letter is chosen to fall early. */
  earlyBaseDelay?: number;
}) {
  return (
    <span aria-label={text}>
      {text.split("").map((char, i) => {
        const r1 = chaos(i, 1);
        const r2 = chaos(i, 2);
        const r3 = chaos(i, 3);
        const r4 = chaos(i, 4);
        const r6 = chaos(i, 6);
        // Some letters break free early while others keep scrambling
        // in place — visible "malfunction shedding letters" effect.
        const isEarly = earlyFallChance > 0 && r6 < earlyFallChance;
        const fallStart = isEarly ? earlyBaseDelay : baseDelay;
        // Sequential per-letter stagger (0.03s/letter) + small random
        // jitter (0.15s) — tight clustering so letters cascade quickly.
        const delay = fallStart + i * 0.03 + r1 * 0.15;
        // Faster fall duration so letters reach the bottom before
        // the shake ends.
        const duration = 0.7 + r2 * 0.4;
        const xDrift = (r3 - 0.5) * 60;
        const rotate = (r4 - 0.5) * 24;
        return (
          <FallingChar
            key={i}
            finalChar={char}
            falling={falling}
            scrambleDuration={scrambleDuration}
            scrambleDelay={scrambleDelay + chaos(i, 5) * 0.15}
            delay={delay}
            duration={duration}
            xDrift={xDrift}
            rotate={rotate}
          />
        );
      })}
    </span>
  );
}

function FallingChar({
  finalChar,
  falling,
  scrambleDuration,
  scrambleDelay,
  delay,
  duration,
  xDrift,
  rotate,
}: {
  finalChar: string;
  falling: boolean;
  scrambleDuration: number;
  scrambleDelay: number;
  delay: number;
  duration: number;
  xDrift: number;
  rotate: number;
}) {
  const [display, setDisplay] = useState(finalChar);

  // Disjointed-malfunction scramble: each letter cycles random chars
  // (including digits and symbols for extra confusion) with irregular
  // per-letter timing. Most changes are slow (200–500ms), sometimes a
  // quick flicker (80–180ms), occasionally a long stuck hold (700–
  // 2000ms). Different letters change at different rhythms, creating
  // a glitchy "broken machine" feel. Letters never resolve to the real
  // char — they fall while still showing their last random value.
  // `scrambleDelay` waits N seconds after `falling` before any change.
  useEffect(() => {
    if (!falling || scrambleDuration === 0) {
      setDisplay(finalChar);
      return;
    }
    const isLetter = /^[a-zA-Z]$/.test(finalChar);
    if (!isLetter) {
      setDisplay(finalChar);
      return;
    }
    const start = performance.now();
    const beginAt = start + scrambleDelay * 1000;
    let nextChange = beginAt;
    let raf = 0;
    const tick = (now: number) => {
      if (now < beginAt) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (now >= nextChange) {
        setDisplay(
          CHAOS_POOL[Math.floor(Math.random() * CHAOS_POOL.length)],
        );
        // Irregular per-change interval — three buckets of timing
        const variance = Math.random();
        let interval: number;
        if (variance < 0.12) {
          interval = 700 + Math.random() * 1300; // stuck hold (12%)
        } else if (variance < 0.32) {
          interval = 80 + Math.random() * 100; // quick flicker (20%)
        } else {
          interval = 220 + Math.random() * 300; // disjointed normal (68%)
        }
        nextChange = now + interval;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setDisplay(finalChar);
    };
  }, [falling, finalChar, scrambleDuration, scrambleDelay]);

  return (
    <motion.span
      style={{ display: "inline-block" }}
      initial={false}
      animate={{
        y: falling ? "120vh" : 0,
        x: falling ? xDrift : 0,
        rotate: falling ? rotate : 0,
        opacity: falling ? 0 : 1,
        filter: falling ? "blur(6px)" : "blur(0px)",
      }}
      transition={{
        y: { delay, duration, ease: [0.55, 0.085, 0.68, 0.53] },
        x: { delay, duration, ease: ease.out },
        rotate: { delay, duration, ease: ease.out },
        opacity: {
          delay: delay + duration * 0.5,
          duration: duration * 0.5,
          ease: [0.6, 0, 0.4, 1],
        },
        filter: { delay, duration: 0.4, ease: ease.out },
      }}
    >
      {display === " " ? " " : display}
    </motion.span>
  );
}

/**
 * Scramble-decode text effect. All characters become visible together
 * at `delay` and scramble in parallel; each letter locks at a randomized
 * time within `totalWindow`, so they snap into place in random order
 * rather than left-to-right. Cycle rate is fast (~30ms) so each letter
 * flickers densely during its scramble portion.
 */
function ScrambleText({
  text,
  delay = 0,
  totalWindow = 1.0,
  minScrambleTime = 0.2,
  scrambleSeed = 1,
}: {
  text: string;
  delay?: number;
  /** Time from `delay` until the LAST letter must be locked. */
  totalWindow?: number;
  /** Minimum scramble time per letter before it can lock. */
  minScrambleTime?: number;
  /** Seed for the per-letter pseudo-random lock-order distribution. */
  scrambleSeed?: number;
}) {
  return (
    <span aria-label={text}>
      {text.split("").map((char, i) => {
        // Per-char lock offset distributed across the window. chaos(i,
        // seed) is deterministic so the shuffle order is stable across
        // renders but reads as random.
        const lockOffset =
          minScrambleTime +
          chaos(i, scrambleSeed) * Math.max(0, totalWindow - minScrambleTime);
        return (
          <ScrambleChar
            key={i}
            finalChar={char}
            delay={delay}
            lockAt={delay + lockOffset}
          />
        );
      })}
    </span>
  );
}

function ScrambleChar({
  finalChar,
  delay,
  lockAt,
}: {
  finalChar: string;
  delay: number;
  /** Absolute time (in seconds from mount) when this char snaps to its final glyph. */
  lockAt: number;
}) {
  // Initialize with finalChar so the layout reserves correct width
  // even before the char becomes visible.
  const [display, setDisplay] = useState(finalChar);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const startMs = delay * 1000;
    const lockMs = lockAt * 1000;
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

      // Non-letters (spaces, parens, etc.) don't scramble — they just
      // appear when their turn comes. Letters cycle until lock time.
      const isLetter = /^[a-zA-Z]$/.test(finalChar);
      if (!isLetter || elapsed >= lockMs) {
        setDisplay(finalChar);
        return;
      }

      // Scrambling — cycle random chars at ~30ms throttle (faster than
      // the previous sequential version since each letter now scrambles
      // for longer; the denser flicker keeps the kinetic feel).
      if (now - lastScramble >= 30) {
        setDisplay(
          SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)],
        );
        lastScramble = now;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finalChar, delay, lockAt]);

  return <span style={{ opacity: visible ? 1 : 0 }}>{display}</span>;
}

/**
 * "ACCESS GRANTED" — bold centered message on a solid bg overlay.
 * Sits at z-[80] above the vault doors so it exits to reveal
 * the static (not-yet-opening) doors underneath, never the children.
 *
 * Reveal sequence:
 * 1. Background fades in (0.3s).
 * 2. The text container has a horizontal-slit clip-path collapsed at
 *    center; it opens vertically over 0.55s with a snappy ease.
 * 3. Crucially, the scramble starts AT THE SAME TIME as the clip
 *    begins opening — chars under the unrevealed area are clipped, but
 *    they're already cycling. As the slit grows the user sees a band
 *    of scrambling letters that expands into the full title; by the
 *    time the clip is fully open the scramble is mid-flight, and the
 *    random per-letter lock-in completes from there. The entrance and
 *    the scramble become a single continuous gesture instead of two
 *    sequential beats.
 *
 * End times for the scramble match the old sequential version
 * (status 0.95s, title 1.71s) so the door choreography downstream
 * doesn't shift.
 *
 * Exit: entire overlay scales up + blurs out (rushing into the vault).
 */
function AccessGranted() {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-bg h-dvh"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, ease: ease.out } }}
      exit={{
        scale: 3,
        opacity: 0,
        filter: "blur(20px)",
        transition: { duration: 0.55, ease: [0.4, 0, 1, 1] },
      }}
    >
      <div className="text-center flex flex-col items-center">
        {/* Status eyebrow — its OWN slit-reveal centered on this line.
            Wrapping each line individually (rather than the container)
            means each reveal expands from the middle of THAT line, not
            from somewhere between them. Scramble starts at the same
            instant the clip starts opening, so the user sees a sliver
            of cycling letters that grows into the full word. */}
        <motion.div
          className="mb-4"
          initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
            transition: {
              delay: 0.05,
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
        >
          <Eyebrow tone="muted">
            <ScrambleText
              text="(Status)"
              delay={0.05}
              totalWindow={0.9}
              scrambleSeed={3}
            />
          </Eyebrow>
        </motion.div>

        {/* Main text — same per-line slit reveal, staggered 100ms
            after the eyebrow so the two lines arrive in a layered
            cascade. Slightly longer slit duration since the title is
            much taller. End time (delay 0.15 + window 1.56 = 1.71s)
            matches the prior choreography so the doors still fire on
            schedule. */}
        <motion.p
          className="font-black text-4xl md:text-6xl uppercase tracking-[-0.02em]"
          initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
            transition: {
              delay: 0.15,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            },
          }}
        >
          <ScrambleText
            text="Access Granted"
            delay={0.15}
            totalWindow={1.56}
            scrambleSeed={7}
          />
        </motion.p>
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
    <div className="fixed inset-0 z-[70]">
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
          bottom edges simultaneously, meeting at center with a hesitant
          creep, then a spring overshoot as they "snap" together. Renders
          during "dismiss" phase with a 0.55s delay (matches the
          AccessGranted exit duration) so the lines only start drawing
          after the overlay has cleared.

          Keyframe choreography (scaleY 0 → 1, where 1 == reaching
          the center; values >1 briefly extend past it):
          - 0 → 0.15 (25% of duration): quick initial creep — lines
            appear and start drawing
          - 0.15 → 0.18 (15%): nearly stall — the hesitancy beat,
            like the lines pause before committing
          - 0.18 → 1.08 (38%): snap forward and overshoot the center
          - 1.08 → 0.96 (12%): pull back from overshoot
          - 0.96 → 1 (10%): final settle */}
      <AnimatePresence>
        {showSeam && (
          <>
            <motion.div
              key="seam-top"
              className="absolute top-0 left-1/2 w-px h-1/2 -translate-x-1/2 bg-fg/10 origin-top"
              initial={{ scaleY: 0 }}
              animate={{
                scaleY: [0, 0.15, 0.18, 1.08, 0.96, 1],
                transition: {
                  delay: 0.55,
                  duration: 0.85,
                  times: [0, 0.25, 0.4, 0.78, 0.9, 1],
                },
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            />
            <motion.div
              key="seam-bottom"
              className="absolute bottom-0 left-1/2 w-px h-1/2 -translate-x-1/2 bg-fg/10 origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{
                scaleY: [0, 0.15, 0.18, 1.08, 0.96, 1],
                transition: {
                  delay: 0.55,
                  duration: 0.85,
                  times: [0, 0.25, 0.4, 0.78, 0.9, 1],
                },
              }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
