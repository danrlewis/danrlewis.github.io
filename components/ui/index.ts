/**
 * Compatibility shim — re-exports the design system primitives so
 * existing `@/components/ui` imports keep working. The actual sources
 * live under `lib/design-system/primitives/`.
 *
 * New code can import directly from `@/lib/design-system` instead.
 */
export {
  Container,
  DisplayHeading,
  Eyebrow,
  FadeUp,
  Mark,
  Masthead,
  Wordmark,
} from "@/lib/design-system/primitives";
