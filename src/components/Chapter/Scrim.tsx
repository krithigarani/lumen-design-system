import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type ChapterAlign = "left" | "center" | "right";

export interface ScrimProps extends HTMLAttributes<HTMLDivElement> {
  align?: ChapterAlign;
}

const scrims: Record<ChapterAlign, string> = {
  left: "lumen-scrim-left",
  center: "lumen-scrim-center",
  right: "lumen-scrim-right",
};

/** A radial darkening layer that keeps copy legible over bright backdrops. */
export const Scrim = forwardRef<HTMLDivElement, ScrimProps>(function Scrim(
  { align = "center", className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", scrims[align], className)}
      {...props}
    />
  );
});
