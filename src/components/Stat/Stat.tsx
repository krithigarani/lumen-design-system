import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { type Tone, toneText } from "../../lib/tone";
import { GlassPanel } from "../GlassPanel/GlassPanel";

export type StatSize = "sm" | "md" | "lg";

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  /** The figure. Omit when using `media` instead. */
  value?: ReactNode;
  tone?: Tone;
  size?: StatSize;
  /** Render arbitrary content in place of the figure — a canvas, sparkline, preview. */
  media?: ReactNode;
}

const valueSizes: Record<StatSize, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

/** HUD readout tile — a tracked uppercase label above a large tabular figure. */
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, tone = "violet", size = "md", media, className, ...props },
  ref,
) {
  return (
    <GlassPanel
      ref={ref}
      radius="xl"
      className={cn("flex flex-col gap-2 px-5 py-4", className)}
      {...props}
    >
      <span className="eyebrow">{label}</span>
      {media ?? (
        <span
          className={cn("font-display font-semibold tabular-nums", valueSizes[size], toneText[tone])}
        >
          {value}
        </span>
      )}
    </GlassPanel>
  );
});

export interface StatGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
  children?: ReactNode;
}

/** A rail of stat tiles. */
export const StatGroup = forwardRef<HTMLDivElement, StatGroupProps>(function StatGroup(
  { orientation = "vertical", className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap items-stretch",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
