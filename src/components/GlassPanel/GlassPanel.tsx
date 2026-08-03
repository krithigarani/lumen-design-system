import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Corner rounding. */
  radius?: "lg" | "xl" | "2xl" | "3xl" | "full";
  /** Adds the gentle 7s bob animation. */
  floaty?: boolean;
  children?: ReactNode;
}

const radii = {
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  full: "rounded-full",
} as const;

/** The signature Lumen surface: violet-tinted translucent glass. */
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { radius = "2xl", floaty = false, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("glass", radii[radius], floaty && "floaty", className)}
      {...props}
    >
      {children}
    </div>
  );
});
