import { type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  /** Accessible label announced to screen readers. */
  label?: string;
}

const sizes = { sm: "size-6", md: "size-12", lg: "size-20" } as const;

/** Spinning conic hologram ring — the Lumen loading indicator. */
export function Spinner({ size = "md", label = "Loading", className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("hologram-ring", sizes[size], className)}
      {...props}
    />
  );
}
