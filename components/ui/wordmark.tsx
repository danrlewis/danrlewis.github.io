"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "./mark";

type WordmarkProps = {
  /** Render as a Link to "/" — set false in static contexts (e.g. inside an open menu). */
  asLink?: boolean;
};

/**
 * The brand mark — a single mood-aware glyph (moon for Night, sun-asterisk
 * for Day) that hover-rotates 180°. Persistent brand element across pages.
 *
 * Click behavior:
 *   - On home (or whenever the wordmark renders without a link target —
 *     e.g. inside the open menu), clicking plays the flourish animation:
 *     sun spins down with inertia, moon flips a few times. "/" navigation
 *     would be a no-op anyway, so we use that click for delight instead.
 *   - Off home with a link target, it's a normal Link to "/".
 *
 * Both variants share identical wrapper classes so the Mark lands at exactly
 * the same coordinates across renders. No 1px shift.
 */
export function Wordmark({ asLink = true }: WordmarkProps) {
  const pathname = usePathname();
  const [flourishKey, setFlourishKey] = useState(0);

  // Trigger one flourish on initial page load — only when landing on
  // the homepage. Avoids the mark spinning every time the user navigates
  // to a different route from the menu.
  useEffect(() => {
    if (pathname === "/") {
      setFlourishKey((k) => k + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generous click target (~46px) without affecting layout. Same shape on
  // every variant. perspective gives the moon's rotateY hover (and the
  // flourish flip animation) a 3D card-flip feel rather than collapsing
  // to a flat scaleX.
  const wrapperClass =
    "group inline-flex items-center justify-center p-3 -m-3 [perspective:800px] hover:opacity-70 transition-opacity";

  // Interactive (button + flourish) when there's no useful link target —
  // either we've been told not to render a link (in-menu use), or we're
  // on home where "/" would be a no-op.
  const interactive = !asLink || pathname === "/";

  if (interactive) {
    return (
      <button
        type="button"
        aria-label="Daniel Lewis — flourish the mark"
        onClick={() => setFlourishKey((k) => k + 1)}
        className={`${wrapperClass} cursor-pointer`}
      >
        <Mark flourishKey={flourishKey} />
      </button>
    );
  }

  return (
    <Link href="/" aria-label="Daniel Lewis — Home" className={wrapperClass}>
      <Mark flourishKey={flourishKey} />
    </Link>
  );
}
