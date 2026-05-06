import { type ElementType, type ReactNode } from "react";
import { clsx } from "clsx";
import {
  displayHeadingRecipe,
  type DisplaySize,
} from "@/lib/design-system";

type DisplayHeadingProps = {
  /**
   * Visual scale (small → large viewport-width pair):
   *   xl: 22vw / 18vw — top of hero, work, contact
   *   lg: 18vw / 14vw — slug project title
   *   md: 16vw / 10vw — vault gate
   *   sm: 14vw / 10vw — slug "next project" callout
   */
  size?: DisplaySize;
  /** Element type. Default h1; set h2/div when not the page's primary heading. */
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/**
 * The brutalist display heading recipe — heavy sans (or pixel when
 * --font-pixel is set), tight tracking, slight left optical inset.
 * Thin React shell over `displayHeadingRecipe` so the recipe stays
 * reusable outside JSX.
 */
export function DisplayHeading({
  size = "xl",
  as: Component = "h1",
  className,
  children,
}: DisplayHeadingProps) {
  return (
    <Component className={clsx(displayHeadingRecipe({ size }), className)}>
      {children}
    </Component>
  );
}
