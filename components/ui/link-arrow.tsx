import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentProps } from "react";

type LinkArrowProps = ComponentProps<typeof Link> & {
  arrow?: "right" | "up-right";
  size?: "sm" | "md";
};

const arrowChar = {
  right: "→",
  "up-right": "↗",
};

const sizeStyles = {
  sm: "text-[11px] uppercase tracking-[var(--tracking-eyebrow)]",
  md: "text-sm uppercase tracking-[var(--tracking-eyebrow)]",
};

/**
 * Editorial CTA link with a hover-shifting arrow and an underline rule.
 * Used everywhere in the site for primary inline CTAs.
 */
export function LinkArrow({
  arrow = "right",
  size = "sm",
  className,
  children,
  ...props
}: LinkArrowProps) {
  return (
    <Link
      className={clsx(
        "group flex items-center justify-between gap-4",
        "border-b border-fg/20 pb-2 hover:border-fg",
        "transition-colors duration-[var(--duration-fast)]",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <span
        className={clsx(
          "transition-transform duration-[var(--duration-fast)] ease-out",
          arrow === "right" && "group-hover:translate-x-1",
          arrow === "up-right" && "text-[1.8em] group-hover:translate-x-1 group-hover:-translate-y-1"
        )}
      >
        {arrowChar[arrow]}
      </span>
    </Link>
  );
}
