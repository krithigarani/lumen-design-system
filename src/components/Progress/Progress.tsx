import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { type Status, statusFill, statusGlow } from "../../lib/status";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100. Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  status?: Status;
  /** Use the brand gradient instead of a status colour. */
  gradient?: boolean;
  /** Accessible name. Required unless you point at a visible label. */
  label?: string;
  labelledBy?: string;
}

/**
 * A determinate progress bar.
 *
 * Distinct from `ScrollProgress`, which is bound to document scroll — this one
 * takes a value.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, status = "info", gradient = false, label, labelledBy, className, ...props },
  ref,
) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(1, value / max));

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(pct * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={labelledBy ? undefined : (label ?? "Progress")}
      aria-labelledby={labelledBy}
      className={cn("h-1 w-full overflow-hidden rounded-full bg-white/5", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full origin-left rounded-full transition-[scale] duration-500 ease-[var(--ease-celestial)]",
          gradient ? "bg-gradient-to-r from-violet via-cyan to-magenta" : statusFill[status],
          gradient ? "shadow-[0_0_10px_#7dd3fc]" : statusGlow[status],
          indeterminate && "animate-pulse",
        )}
        style={{ scale: `${indeterminate ? 1 : pct} 1` } as CSSProperties}
      />
    </div>
  );
});
