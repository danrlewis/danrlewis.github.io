"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Eyebrow, Wordmark } from "@/components/ui";
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
  const pathname = usePathname();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
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
      <MenuTrigger open={open} onClick={() => setOpen((s) => !s)} />
      <AnimatePresence mode="wait">
        {open && <MenuOverlay onClose={close} />}
      </AnimatePresence>
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
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className="relative inline-flex items-center hover:opacity-70 transition-opacity overflow-hidden"
      style={{ minWidth: "3rem" }}
    >
      {/* Reserve a stable slot for the longest label so width doesn't jump */}
      <span className="invisible" aria-hidden>
        <Eyebrow>Close</Eyebrow>
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={open ? "close" : "menu"}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.22, ease: ease.out }}
          className="absolute inset-0 flex items-center justify-end"
        >
          <Eyebrow>{open ? "Close" : "Menu"}</Eyebrow>
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-bg flex flex-col"
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{
        clipPath: "inset(0% 0% 0% 0%)",
        transition: { duration: 0.7, ease: ease.inOut },
      }}
      exit={{
        clipPath: "inset(0% 0% 100% 0%)",
        transition: { duration: 0.55, ease: ease.out },
      }}
    >
      {/* Top bar mirrors main nav so the close affordance stays in place */}
      <div className="flex items-center justify-between px-[var(--rail)] py-5 md:py-7">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <Wordmark asLink={false} />
        </motion.div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="hover:opacity-70 transition-opacity"
        >
          <Eyebrow>Close</Eyebrow>
        </button>
      </div>

      {/* Big nav items — brutalist scale, heavy sans */}
      <nav className="flex-1 flex flex-col justify-center px-[var(--rail)] py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
          className="grid grid-cols-12 gap-4 mb-10"
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
              delay={0.35 + i * 0.07}
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
}: {
  href: string;
  label: string;
  index: string;
  preview: string;
  delay: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { delay, duration: 0.7, ease: ease.out },
      }}
      exit={{
        opacity: 0,
        y: -20,
        filter: "blur(8px)",
        transition: { duration: 0.2 },
      }}
      className="border-b last:border-b-0 relative overflow-hidden"
    >
      <Link
        href={href}
        className="group isolate grid grid-cols-12 gap-4 items-baseline py-4 md:py-6 relative"
      >
        {/* Accent slab that slides in from the left on hover */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-0 bg-accent transition-all duration-[var(--duration-base)] ease-out group-hover:w-full -z-10"
        />

        <span className="col-span-1 font-mono text-[11px] uppercase text-fg/45 tabular-nums pt-3 transition-colors duration-[var(--duration-base)] group-hover:text-accent-fg">
          {index}
        </span>

        <span className="col-span-8 md:col-span-7 font-black text-[14vw] md:text-[10vw] lg:text-[8.5vw] leading-[0.9] tracking-[-0.045em] -ml-[0.02em] transition-[transform,color] duration-[var(--duration-base)] ease-out group-hover:translate-x-3 group-hover:text-accent-fg">
          {label}
        </span>

        <span className="col-span-3 md:col-span-4 text-right self-end pb-3 font-mono text-[11px] uppercase text-fg/55 transition-colors duration-[var(--duration-base)] group-hover:text-accent-fg">
          {preview}
        </span>
      </Link>
    </motion.li>
  );
}
