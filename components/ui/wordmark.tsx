import Link from "next/link";
import { Mark } from "./mark";

type WordmarkProps = {
  /** Render as a Link to "/" — set false in static contexts (e.g. inside an open menu). */
  asLink?: boolean;
};

/**
 * The brand mark — a single mood-aware glyph (moon for Night, sun-asterisk
 * for Day) hover-rotates 180°. Persistent brand element across every page.
 *
 * Both variants (Link and span) use identical wrapper classes so the Mark
 * lands at exactly the same coordinates regardless of menu state. No 1px
 * shift when the menu opens/closes.
 */
export function Wordmark({ asLink = true }: WordmarkProps) {
  // Generous click target (~46px) without affecting layout. Same shape on
  // both variants so the Mark anchor doesn't move between renders.
  const wrapperClass =
    "group inline-flex items-center justify-center p-3 -m-3 hover:opacity-70 transition-opacity";

  if (!asLink) {
    return (
      <span className={wrapperClass}>
        <Mark />
      </span>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Daniel Lewis — Home"
      className={wrapperClass}
    >
      <Mark />
    </Link>
  );
}
