import { Container, Mark } from "@/components/ui";
import { MoodToggle } from "./mood-toggle";

/**
 * Slim global colophon — credits + © year on the left, mood toggle on the
 * right. Replaces the old multi-section footer.
 */
export function Colophon() {
  const year = new Date().getFullYear();
  return (
    <div className="border-t mt-32 md:mt-40">
      <Container className="py-6 md:py-8">
        <div className="grid grid-cols-12 gap-4 md:items-end">
          <p className="col-span-12 md:col-span-9 font-mono text-fg/55 text-[11px] uppercase leading-[1.7] max-w-3xl">
            <span className="text-fg/40 mr-2">(Colophon)</span>
            Set in Geist and Geist Mono. Built with Next.js, Tailwind, and
            Motion. Designed and engineered by myself with the aid of Cursor and Claude Code.{" "}
            <span className="text-fg/40">
              © {year}{" "}
              <Mark size="13px" hoverRotate={false} />
            </span>
          </p>

          <div className="col-span-12 md:col-span-3 md:col-start-10 md:flex md:justify-end mt-4 md:mt-0">
            <MoodToggle />
          </div>
        </div>
      </Container>
    </div>
  );
}
