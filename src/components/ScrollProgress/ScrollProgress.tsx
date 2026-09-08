import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { useScrollProgress } from "../../hooks/useScrollProgress";

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  position?: "top" | "bottom" | "static";
  /** Optional label for the numeric readout. */
  label?: string;
  /** Show the `LABEL · 07%` HUD line. */
  showReadout?: boolean;
}

const positions = {
  top: "fixed inset-x-0 top-0 z-50",
  bottom: "fixed inset-x-0 bottom-0 z-50",
  static: "relative w-full",
} as const;

/**
 * A scroll-linked progress bar.
 *
 * The bar itself is driven entirely by the `--lumen-scroll` custom property
 * (and by a compositor-side scroll timeline where supported), so it renders
 * once. Only the optional readout subscribes to React state.
 *
 * Note: because `.glass` uses `backdrop-filter`, it forms a containing block —
 * don't nest the fixed variants inside a glass ancestor.
 */
export const ScrollProgress = forwardRef<HTMLDivElement, ScrollProgressProps>(
  function ScrollProgress(
    { position = "top", label, showReadout = false, className, ...props },
    ref,
  ) {
    // Only subscribe when something actually renders the number.
    const progress = useScrollProgress({ steps: showReadout ? 100 : 0 });
    const pct = Math.round(progress * 100);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={showReadout ? pct : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Scroll progress"}
        className={cn(positions[position], className)}
        {...props}
      >
        <div className="h-0.5 w-full bg-white/5">
          <div className="lumen-progress-fill h-full w-full bg-gradient-to-r from-violet via-cyan to-magenta shadow-[0_0_10px_var(--color-cyan)]" />
        </div>
        {showReadout && (
          <div
            aria-hidden
            className="absolute bottom-2 left-6 hidden text-[10px] tracking-[0.3em] text-faint uppercase md:block"
          >
            {label ? `${label} · ` : ""}
            {String(pct).padStart(2, "0")}%
          </div>
        )}
      </div>
    );
  },
);
