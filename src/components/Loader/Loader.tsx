import { forwardRef, useEffect, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type OrbitSpinnerSize = "sm" | "md" | "lg";

export interface OrbitSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: OrbitSpinnerSize;
  label?: string;
}

const orbitSizes: Record<OrbitSpinnerSize, string> = {
  sm: "size-10",
  md: "size-16",
  lg: "size-24",
};

/** A rotating multi-ring rig with an orbiting node. */
export const OrbitSpinner = forwardRef<HTMLDivElement, OrbitSpinnerProps>(function OrbitSpinner(
  { size = "md", label = "Loading", className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="status"
      aria-label={label}
      className={cn("relative [animation:spin_3.2s_linear_infinite]", orbitSizes[size], className)}
      {...props}
    >
      <div className="absolute inset-0 rounded-full border border-violet/30" />
      <div className="absolute inset-0 rounded-full border-t border-cyan" />
      <div className="absolute inset-3 rounded-full border border-white/10" />
      <div className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_10px_#7dd3fc]" />
    </div>
  );
});

export interface LoaderScreenProps extends HTMLAttributes<HTMLDivElement> {
  /** Status lines cycled while loading. */
  lines?: string[];
  /** Interval between lines in ms. Default 700. */
  interval?: number;
  /** When true, the screen dismisses after `holdAfterReady`. */
  ready?: boolean;
  /** ms to linger once ready. Default 900. */
  holdAfterReady?: number;
  /** Hard failsafe in ms, so a stalled app can't trap the user. Default 5000. */
  timeout?: number;
  onDone?: () => void;
}

/** A full-screen intro loader with cycling status lines. */
export const LoaderScreen = forwardRef<HTMLDivElement, LoaderScreenProps>(function LoaderScreen(
  {
    lines = ["Calibrating star charts", "Aligning orbits", "Engaging drive"],
    interval = 700,
    ready = false,
    holdAfterReady = 900,
    timeout = 5000,
    onDone,
    className,
    ...props
  },
  ref,
) {
  const [line, setLine] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setLine((i) => (i + 1) % lines.length), interval);
    return () => clearInterval(id);
  }, [lines.length, interval]);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, holdAfterReady);
    return () => clearTimeout(id);
  }, [ready, holdAfterReady, onDone]);

  // Failsafe: never trap the user behind a loader that never resolves.
  useEffect(() => {
    const id = setTimeout(() => {
      setGone(true);
      onDone?.();
    }, timeout);
    return () => clearTimeout(id);
  }, [timeout, onDone]);

  if (gone) return null;

  return (
    <div
      ref={ref}
      className={cn("fixed inset-0 z-[80] grid place-items-center bg-void", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-6">
        <OrbitSpinner />
        <div
          aria-live="polite"
          className="font-display text-xs tracking-[0.5em] text-muted uppercase"
        >
          {lines[line]}
        </div>
      </div>
    </div>
  );
});
