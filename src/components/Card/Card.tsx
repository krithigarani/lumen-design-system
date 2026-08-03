import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type CardSurface = "glass" | "subtle" | "outline";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Render as another element — `"a"` for a link card, `"button"` for a clickable tile. */
  as?: ElementType;
  /** Surface treatment. `glass` is the heavy blur; `subtle` is the lighter tier. */
  surface?: CardSurface;
  /** Add hover lift and an accent border on hover. */
  interactive?: boolean;
  children?: ReactNode;
}

const surfaces: Record<CardSurface, string> = {
  glass: "glass",
  subtle: "border border-white/8 bg-white/[0.03]",
  outline: "border border-white/15",
};

/** The default content container. */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as, surface = "glass", interactive = false, className, children, ...props },
  ref,
) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      ref={ref}
      className={cn(
        "rounded-3xl p-8 md:p-10",
        surfaces[surface],
        interactive &&
          "cursor-pointer text-left transition-all duration-500 hover:-translate-y-1 hover:border-cyan/40 " +
            "outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[3px]",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
});
