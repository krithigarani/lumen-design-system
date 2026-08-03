import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { type Tone, toneBadge } from "../../lib/tone";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /**
   * Arbitrary accent colour (any CSS colour). Overrides `tone` — for data-driven
   * accents that don't map onto the four house tones.
   */
  accent?: string;
  children?: ReactNode;
}

/** Small accented pill — tech tags, statuses, chips. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "violet", accent, className, style, children, ...props },
  ref,
) {
  // `color-mix` keeps the border/fill relationship identical to the tone variants.
  const accentStyle: CSSProperties | undefined = accent
    ? {
        color: accent,
        borderColor: `color-mix(in srgb, ${accent} 30%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`,
      }
    : undefined;

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-body text-[11px] tracking-[0.14em] uppercase",
        !accent && toneBadge[tone],
        className,
      )}
      style={{ ...accentStyle, ...style }}
      {...props}
    >
      {children}
    </span>
  );
});

export interface BadgeGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Wrapping row of badges. */
export const BadgeGroup = forwardRef<HTMLDivElement, BadgeGroupProps>(function BadgeGroup(
  { className, children, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      {children}
    </div>
  );
});
