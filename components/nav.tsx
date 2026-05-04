import { Container, Wordmark } from "@/components/ui";
import { Menu } from "./menu";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <Container className="flex items-center justify-between gap-4 py-5 md:py-7">
        <Wordmark />
        <Menu />
      </Container>
    </header>
  );
}
