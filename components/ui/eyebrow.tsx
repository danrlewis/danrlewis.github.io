import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

type EyebrowProps = HTMLAttributes<HTMLSpanElement> & {
  as?: "span" | "p" | "div" | "h2";
  tone?: "default" | "muted" | "accent";
};

const toneStyles: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  default: "text-fg",
  muted: "text-fg/60",
  accent: "text-accent",
};

/**
 * Small uppercase tracked text. Used for section labels, eyebrows,
 * metadata. Single source of truth for this typographic style.
 */
export function Eyebrow({
  as: Component = "span",
  tone = "default",
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <Component
      className={clsx(
        "inline-block font-mono text-[11px] uppercase",
        "tracking-[0.04em]",
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
