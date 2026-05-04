import { type ElementType, type ReactNode } from "react";
import { clsx } from "clsx";

type DisplayHeadingSize = "xl" | "lg" | "md" | "sm";

type DisplayHeadingProps = {
  /**
   * Visual scale (small → large viewport-width pair):
   *   xl: 22vw / 18vw — top of hero, work, contact
   *   lg: 18vw / 14vw — slug project title
   *   md: 16vw / 10vw — vault gate
   *   sm: 14vw / 10vw — slug "next project" callout
   */
  size?: DisplayHeadingSize;
  /** Element type. Default h1; set h2/div when not the page's primary heading. */
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

const sizeClasses: Record<DisplayHeadingSize, string> = {
  xl: "text-[22vw] md:text-[18vw]",
  lg: "text-[18vw] md:text-[14vw]",
  md: "text-[16vw] md:text-[10vw]",
  sm: "text-[14vw] md:text-[10vw]",
};

/**
 * The brutalist display heading recipe — heavy sans, tight tracking, slight
 * left optical inset. Single source of truth across pages so the type stays
 * coherent if the recipe is later tweaked (or extracted into a design pkg).
 */
export function DisplayHeading({
  size = "xl",
  as: Component = "h1",
  className,
  children,
}: DisplayHeadingProps) {
  return (
    <Component
      className={clsx(
        "font-black leading-[0.85] tracking-[-0.045em] -ml-[0.04em]",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  );
}
