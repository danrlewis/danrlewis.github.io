"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Eyebrow } from "@/components/ui";
import { ease } from "@/lib/motion";
import { projects } from "@/lib/projects";

const ROUTES = [
  { href: "/", label: "HOME", index: "01", preview: "Bio · Selected work" },
  {
    href: "/work",
    label: "WORK",
    index: "02",
    preview: `${String(projects.length).padStart(2, "0")} Projects`,
  },
  {
    href: "/contact",
    label: "CONTACT",
    index: "03",
    preview: "hello@danrlewis.me",
  },
] as const;

export function Menu() {
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute("data-menu", "open");
    return () => {
      document.body.style.overflow = original;
      document.documentElement.removeAttribute("data-menu");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close]);

  return (
    <>
      <MenuTrigger open={open} onClick={() => {
        setOpen((s) => {
          if (!s) setOpenCount((c) => c + 1);
          return !s;
        });
      }} />
      {/* Portal the overlay to document.body so it sits OUTSIDE the page
          nav's stacking context. Otherwise the overlay (z-50) would render
          above the nav's wordmark and trigger (both descendants of the
          z-60 nav) — bumping the nav's z-index doesn't help when the
          overlay is itself a descendant of the nav. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && <MenuOverlay key={openCount} onClose={close} />}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function MenuTrigger({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  // Chaos scramble: when the vault unlock starts (data-vault="melting"
  // on the html element), rapidly cycle the visible scramble target so
  // the (MENU) reels jitter chaotically alongside the rest of the
  // disintegration. Decoupled from real menu open/close state.
  const [chaosTarget, setChaosTarget] = useState<"menu" | "close" | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    let interval: ReturnType<typeof setInterval> | null = null;

    const trigger = () => {
      if (interval) return;
      let count = 0;
      interval = setInterval(() => {
        setChaosTarget(count % 2 === 0 ? "close" : "menu");
        count++;
        if (count > 14) {
          if (interval) clearInterval(interval);
          interval = null;
          setChaosTarget(null);
        }
      }, 90);
    };

    const observer = new MutationObserver(() => {
      if (html.getAttribute("data-vault") === "melting") {
        trigger();
      }
    });
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-vault"],
    });

    // If page already mounted in melting state, fire once
    if (html.getAttribute("data-vault") === "melting") trigger();

    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  const labelState = chaosTarget ?? (open ? "close" : "menu");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      // p-3 -m-3 extends the tap target ~24px in every direction without
      // affecting layout. inset-3 on the absolute label keeps the visible
      // letterforms anchored to the original content rectangle.
      className="relative inline-flex items-center hover:opacity-70 transition-opacity overflow-hidden p-3 -m-3 cursor-pointer"
      style={{ minWidth: "3rem" }}
    >
      {/* Reserve a stable slot for the longest label so width doesn't jump */}
      <span className="invisible" aria-hidden>
        <Eyebrow>(Close)</Eyebrow>
      </span>
      <ScrambleLabel state={labelState} />
    </button>
  );
}

// MENU is right-aligned within CLOSE's 5-letter footprint. The leading slot
// is empty for the MENU state (animates between " " and "C"); the rest map
// each MENU letter to its CLOSE counterpart at the same horizontal slot.
const SCRAMBLE_SLOTS = [
  { menu: " ", close: "C" },
  { menu: "M", close: "L" },
  { menu: "E", close: "O" },
  { menu: "N", close: "S" },
  { menu: "U", close: "E" },
] as const;

function ScrambleLabel({ state }: { state: "menu" | "close" }) {
  return (
    <span
      aria-hidden
      className="absolute inset-3 flex items-center justify-end font-mono text-[11px] uppercase tracking-[0.04em] leading-none"
    >
      <span className="scramble-cell">(</span>
      {SCRAMBLE_SLOTS.map((slot, i) => (
        <ScrambleSlot
          key={i}
          menuChar={slot.menu}
          closeChar={slot.close}
          state={state}
          delay={i * 0.045}
        />
      ))}
      <span className="scramble-cell">)</span>
    </span>
  );
}

/**
 * One character "reel" — vertical column of [menuChar, ...random, closeChar]
 * that slides between the two rest positions. The intermediate random chars
 * are visible while the reel scrolls, giving the trigger a slot-machine /
 * flip-clock feel (and the empty leading slot on MENU "grows" a letter on
 * the way to CLOSE, which reads as a delightful side-effect).
 */
function ScrambleSlot({
  menuChar,
  closeChar,
  state,
  delay,
}: {
  menuChar: string;
  closeChar: string;
  state: "menu" | "close";
  delay: number;
}) {
  // Initial reel uses deterministic placeholder chars so SSR and client
  // first-render produce identical HTML (no hydration mismatch). After
  // mount, replace the middle slots with random chars — by the time the
  // user clicks the trigger, the random values are in place and the reel
  // animation reads as a proper scramble.
  const [reel, setReel] = useState<string[]>([
    menuChar,
    menuChar,
    closeChar,
    closeChar,
    closeChar,
  ]);
  useEffect(() => {
    const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const r = () => pool[Math.floor(Math.random() * pool.length)];
    setReel([menuChar, r(), r(), r(), closeChar]);
  }, [menuChar, closeChar]);

  const targetIndex = state === "menu" ? 0 : reel.length - 1;

  // Collapse the slot to zero width when the space character is showing
  // (MENU state on the padding slot). Animates open during the scramble.
  const collapsible = menuChar === " ";

  return (
    <span
      className="relative inline-block overflow-hidden h-[1em] leading-none transition-[max-width] duration-300 ease-out"
      style={{ maxWidth: collapsible && state === "menu" ? 0 : "1ch" }}
    >
      <motion.span
        className="block"
        initial={false}
        animate={{ y: `-${targetIndex}em` }}
        transition={{ duration: 0.55, ease: ease.out, delay }}
      >
        {reel.map((c, i) => (
          <span key={i} className="scramble-cell">
            {c === " " ? "​" : c}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      style={{ willChange: "clip-path", backfaceVisibility: "hidden", transform: "translateZ(0)" }}
      className="fixed inset-0 z-50 bg-bg overflow-y-auto"
      initial={{ clipPath: "circle(0px at calc(100% - var(--rail) - 1.5rem) 2rem)" }}
      animate={{
        clipPath: "circle(150vmax at calc(100% - var(--rail) - 1.5rem) 2rem)",
        transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
      }}
      exit={{
        clipPath: "circle(0px at calc(100% - var(--rail) - 1.5rem) 2rem)",
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* No top bar — the page nav (z-60) sits above this overlay and
          provides both the wordmark (flourish trigger) and the menu/close
          slot-reel button. That keeps the trigger's transition visible
          throughout open/close instead of being clipped by the overlay. */}

      {/* Body — same top padding as page content (pt-24 md:pt-32) so the
          (Index) masthead row aligns with each page's masthead row exactly. */}
      <nav className="px-[var(--rail)] pt-24 md:pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.08, duration: 0.25 } }}
          className="grid grid-cols-12 gap-4 mb-10 md:mb-16"
        >
          <Eyebrow tone="muted" className="col-span-6">
            (Index)
          </Eyebrow>
          <Eyebrow tone="muted" className="col-span-6 text-right">
            03 Routes
          </Eyebrow>
        </motion.div>

        <ul className="flex flex-col border-t">
          {ROUTES.map((route, i) => (
            <MenuItem
              key={route.href}
              href={route.href}
              label={route.label}
              index={route.index}
              preview={route.preview}
              delay={0.1 + i * 0.04}
              onClose={onClose}
            />
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}

function MenuItem({
  href,
  label,
  index,
  preview,
  delay,
  onClose,
}: {
  href: string;
  label: string;
  index: string;
  preview: string;
  delay: number;
  onClose: () => void;
}) {
  // Cursor-aware accent bloom: the clip-path circle grows from where the
  // cursor entered the row (round → flat-sided as it exceeds the row's
  // bounds). On exit the slab fades in place via opacity rather than
  // contracting back to the cursor — the clip-path resets only after the
  // fade has finished, so the reset is invisible.
  const setOrigin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--slab-x", `${x}%`);
    e.currentTarget.style.setProperty("--slab-y", `${y}%`);
  };

  return (
    <motion.li
      exit={{
        opacity: 0,
        transition: { duration: 0.15 },
      }}
      className="border-b last:border-b-0 relative overflow-hidden"
    >
      <Link
        href={href}
        // Close the menu on every click — covers the case where the user
        // taps the route they're already on (no pathname change → the
        // pathname-effect close wouldn't fire).
        onClick={onClose}
        onMouseEnter={setOrigin}
        className="group isolate grid grid-cols-12 gap-4 items-baseline py-4 md:py-6 relative"
        style={{
          ["--slab-x" as string]: "50%",
          ["--slab-y" as string]: "50%",
        }}
      >
        {/* Accent bloom. Two distinct transitions:
            - In (going to :hover): opacity snaps to 1, clip-path blooms
              from the cursor over 850ms with a slow-finish curve.
            - Out (leaving :hover): opacity fades to 0 over 480ms; the
              clip-path reset is delayed until the fade is complete so
              the user only sees a fade, never a contraction. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-accent -z-10 opacity-0 [clip-path:circle(0%_at_var(--slab-x)_var(--slab-y))] [transition:opacity_480ms_cubic-bezier(0.22,1,0.36,1),clip-path_0ms_480ms] group-hover:opacity-100 group-hover:[clip-path:circle(150%_at_var(--slab-x)_var(--slab-y))] group-hover:[transition:opacity_0ms,clip-path_850ms_cubic-bezier(0.22,1,0.36,1)]"
        />

        <span className="col-span-1 font-mono text-[11px] uppercase text-fg/45 tabular-nums pt-3 transition-colors duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-accent-fg">
          {index}
        </span>

        <span className="col-span-11 md:col-span-7 font-black text-[11vw] sm:text-[10vw] md:text-[9.5vw] lg:text-[8.5vw] leading-[0.9] tracking-[-0.045em] -ml-[0.02em] transition-colors duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-accent-fg">
          {label}
        </span>

        <span className="hidden md:block col-span-4 text-right self-end pb-3 font-mono text-[11px] uppercase text-fg/55 transition-colors duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-accent-fg">
          {preview}
        </span>
      </Link>
    </motion.li>
  );
}
