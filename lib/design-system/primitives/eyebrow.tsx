import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { eyebrowRecipe, type EyebrowTone } from "@/lib/design-system";

type EyebrowProps = HTMLAttributes<HTMLSpanElement> & {
  as?: "span" | "p" | "div" | "h2";
  tone?: EyebrowTone;
};

/**
 * Small uppercase tracked text. Used for section labels, eyebrows,
 * metadata. Thin React shell over `eyebrowRecipe` from the design
 * system — variant logic lives there so it's reusable outside JSX.
 */
export function Eyebrow({
  as: Component = "span",
  tone = "default",
  className,
  children,
  ...props
}: EyebrowProps) {
  return (
    <Component className={clsx(eyebrowRecipe({ tone }), className)} {...props}>
      {children}
    </Component>
  );
}
