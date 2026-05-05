import { Container } from "@/components/ui";

/**
 * Slim global colophon — credits + © year. The mood toggle lives in its own
 * fixed position at the bottom-right of the viewport.
 */
export function Colophon() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t mt-32 md:mt-40">
      <Container className="py-6 md:py-8">
        <p className="font-mono text-fg/55 text-[11px] uppercase leading-[1.7] max-w-3xl pr-28 md:pr-0 text-balance">
          <span className="text-fg/45 mr-2">(Colophon)</span>
          Set in Geist and Geist Mono. Built with Next.js, Tailwind, and
          Motion. Made in Vancouver, WA with Cursor and Claude Code.{" "}
          <span className="text-fg/45">© {year}</span>
        </p>
      </Container>
    </footer>
  );
}
