import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type SkeletonShape = "line" | "block" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
  /** Any CSS length. Defaults to full width, or a square for `circle`. */
  width?: string;
  height?: string;
  /** Render this many stacked lines, each slightly different in width. */
  lines?: number;
}

const shapes: Record<SkeletonShape, string> = {
  line: "h-3 rounded-full",
  block: "rounded-2xl",
  circle: "rounded-full",
};

/**
 * A shimmering placeholder for content that hasn't arrived.
 *
 * Hidden from assistive tech — a loading region should announce itself once,
 * not read out a dozen empty boxes.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { shape = "line", width, height, lines, className, style, ...props },
  ref,
) {
  const base = cn("lumen-skeleton", shapes[shape], className);

  if (lines && lines > 1) {
    return (
      <div ref={ref} aria-hidden className="flex flex-col gap-2.5" {...props}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={base}
            // The last line runs short, the way a paragraph does.
            style={{ width: i === lines - 1 ? "62%" : (width ?? "100%"), height } as CSSProperties}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      aria-hidden
      className={base}
      style={
        {
          width: width ?? (shape === "circle" ? "3rem" : "100%"),
          height: height ?? (shape === "circle" ? "3rem" : shape === "block" ? "8rem" : undefined),
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
});
