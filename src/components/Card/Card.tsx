import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

export type CardSurface = "glass" | "subtle" | "outline";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Render as another element — `"a"` for a link card, `"button"` for a clickable tile. */
  as?: ElementType;
  /** Surface treatment. `glass` is the heavy blur; `subtle` is the lighter tier. */
  surface?: CardSurface;
  /** Add hover lift and an accent border on hover. */
  interactive?: boolean;
  /**
   * Act as a size-query container, so content inside can respond to the card's
   * width with `@md:` utilities rather than the viewport's.
   *
   * Defaults to on for a plain card, and off when `as` is set. Form controls
   * and anchors size to fit their content even at `display: block`, and
   * inline-size containment makes the content contribute nothing — a
   * card-as-button collapses to the width of its own padding. Opt in
   * explicitly there, and give the element a width of its own.
   */
  container?: boolean;
  children?: ReactNode;
}

const surfaces: Record<CardSurface, string> = {
  glass: "glass",
  subtle: "border border-white/8 bg-white/[0.03]",
  outline: "border border-white/15",
};

/** The default content container. */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as, surface = "glass", interactive = false, container, className, style, children, ...props },
  ref,
) {
  const Tag = (as ?? "div") as ElementType;
  const contained = container ?? as === undefined;

  return (
    <Tag
      ref={ref}
      style={
        (contained ? { containerType: "inline-size", ...style } : style) as CSSProperties
      }
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
