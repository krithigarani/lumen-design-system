import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Accent the thumb. Defaults to the house cyan. */
  tone?: "cyan" | "violet" | "gold" | "magenta";
}

const tones = {
  cyan: "",
  violet: "[--lumen-slider-accent:var(--color-violet)]",
  gold: "[--lumen-slider-accent:var(--color-gold)]",
  magenta: "[--lumen-slider-accent:var(--color-magenta)]",
} as const;

/**
 * A styled native range input — keyboard, touch and step behaviour come from
 * the platform.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { tone = "cyan", className, ...props },
  ref,
) {
  return (
    <input ref={ref} type="range" className={cn("lumen-slider", tones[tone], className)} {...props} />
  );
});
