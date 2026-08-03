import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface NebulaBackdropProps extends HTMLAttributes<HTMLDivElement> {
  /** Fixed to the viewport (default) or absolute within a positioned parent. */
  position?: "fixed" | "absolute";
}

/**
 * Layered radial gradients that give a page the house atmosphere.
 * Pure CSS — no canvas, no JS.
 *
 * Sits at `z-index: 0`, which paints above the page background but below any
 * positioned content. **Content drawn over it must establish a stacking order**
 * — give it `relative` (and `z-10` if it shares a parent with the backdrop).
 * A negative z-index would slide the backdrop behind an opaque `body`
 * background and disappear.
 */
export const NebulaBackdrop = forwardRef<HTMLDivElement, NebulaBackdropProps>(
  function NebulaBackdrop({ position = "fixed", className, ...props }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden
        className={cn(
          "lumen-nebula pointer-events-none inset-0 z-0",
          position === "fixed" ? "fixed" : "absolute",
          className,
        )}
        {...props}
      />
    );
  },
);
