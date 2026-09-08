import { forwardRef, type HTMLAttributes } from "react";
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
      <div className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]" />
    </div>
  );
});
