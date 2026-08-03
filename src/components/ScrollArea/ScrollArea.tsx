import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Any CSS length. Default "24rem". */
  maxHeight?: string;
  /** Where to fade the content edges. */
  fade?: "bottom" | "both" | "none";
  orientation?: "vertical" | "horizontal";
  children?: ReactNode;
}

/**
 * A bounded scrolling region with fading edges.
 *
 * Carries `data-lenis-prevent` so smooth-scroll libraries release the wheel
 * while the pointer is inside.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { maxHeight = "24rem", fade = "bottom", orientation = "vertical", className, style, children, ...props },
  ref,
) {
  const vertical = orientation === "vertical";

  return (
    <div className="relative">
      {fade === "both" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-10",
            vertical
              ? "inset-x-0 top-0 h-8 bg-gradient-to-b from-void/80 to-transparent"
              : "inset-y-0 left-0 w-8 bg-gradient-to-r from-void/80 to-transparent",
          )}
        />
      )}
      <div
        ref={ref}
        data-lenis-prevent
        className={cn(
          "overscroll-contain",
          vertical ? "touch-pan-y overflow-y-auto" : "touch-pan-x overflow-x-auto",
          className,
        )}
        style={{ [vertical ? "maxHeight" : "maxWidth"]: maxHeight, ...style } as CSSProperties}
        {...props}
      >
        {children}
      </div>
      {fade !== "none" && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-10",
            vertical
              ? "inset-x-0 bottom-0 h-8 bg-gradient-to-t from-void/80 to-transparent"
              : "inset-y-0 right-0 w-8 bg-gradient-to-l from-void/80 to-transparent",
          )}
        />
      )}
    </div>
  );
});
