import Link from "next/link";
import { Mark } from "./mark";

type WordmarkProps = {
  /** Render as a Link to "/" — set false in static contexts (e.g. inside an open menu). */
  asLink?: boolean;
};

/**
 * The brand mark — a single mood-aware glyph (moon for Night, sun-asterisk
 * for Day) hover-rotates 180°. Persistent brand element across every page.
 */
export function Wordmark({ asLink = true }: WordmarkProps) {
  if (!asLink) {
    return (
      <span className="group inline-block">
        <Mark />
      </span>
    );
  }

  return (
    <Link
      href="/"
      className="group inline-block hover:opacity-70 transition-opacity"
    >
      <Mark />
    </Link>
  );
}
