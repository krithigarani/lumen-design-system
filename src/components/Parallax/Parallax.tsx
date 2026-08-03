import {
  forwardRef,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";
import { useElementScrollProgress } from "../../hooks/useElementScrollProgress";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { ProgressRange } from "../../lib/scroll-store";

export interface ParallaxProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Total travel in px across the element's full pass. Default 80. */
  distance?: number;
  axis?: "y" | "x";
  range?: ProgressRange;
}

/**
 * Drifts its content as it passes through the viewport.
 *
 * Progress arrives as the `--lumen-p` custom property written by the shared
 * scroll loop, so this causes zero React re-renders. Under reduced motion the
 * element isn't even measured.
 */
export const Parallax = forwardRef<HTMLElement, ParallaxProps>(function Parallax(
  { as, distance = 80, axis = "y", range = "cover", className, style, children, ...props },
  forwardedRef,
) {
  const Tag = (as ?? "div") as ElementType;
  const localRef = useRef<HTMLElement | null>(null);
  const ref = useMergedRef<HTMLElement>(localRef, forwardedRef);
  const reduced = useReducedMotion();

  useElementScrollProgress(localRef, { range, enabled: !reduced });

  return (
    <Tag
      ref={ref}
      data-axis={axis}
      className={cn("lumen-parallax", className)}
      style={{ "--lumen-parallax-distance": `${distance}px`, ...style } as CSSProperties}
      {...props}
    >
      {children}
    </Tag>
  );
});
