import { Container, Wordmark } from "@/components/ui";
import { Menu } from "./menu";

// z-60 puts the nav ABOVE the menu overlay (z-50). The trigger's slot-reel
// transition stays fully visible during open/close instead of being clipped
// behind the overlay. The overlay's top bar (wordmark + close button) is
// removed since the nav now provides both.
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-60">
      <Container className="flex items-center justify-between gap-4 py-5 md:py-7">
        <Wordmark />
        <Menu />
      </Container>
    </header>
  );
}
