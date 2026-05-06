import { clsx } from "clsx";
import type { ElementType, HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  bleed?: boolean;
};

/**
 * Page-level horizontal padding rail. Use this everywhere a section
 * needs to align to the page grid. Pass `bleed` to remove the padding.
 */
export function Container({
  as: Component = "div",
  bleed = false,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={clsx(!bleed && "px-[var(--rail)]", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
