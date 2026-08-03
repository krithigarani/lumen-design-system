import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { type Tone, toneOutlineHover, toneSweepBorder, toneSweepFill } from "../../lib/tone";

export type ButtonVariant = "outline" | "sweep" | "icon" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Render as another element — most often `"a"` for a link styled as a button. */
  as?: ElementType;
  /** Visual treatment. */
  variant?: ButtonVariant;
  /** Accent colour. */
  tone?: Tone;
  size?: ButtonSize;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children?: ReactNode;
  /** Passed through when rendering as `"a"`. */
  href?: string;
}

const base =
  "relative inline-flex items-center justify-center gap-2 font-body uppercase " +
  "transition-colors duration-300 outline-none focus-visible:outline focus-visible:outline-1 " +
  "focus-visible:outline-cyan focus-visible:outline-offset-[3px] " +
  "disabled:cursor-not-allowed disabled:opacity-40";

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[10px] tracking-[0.26em]",
  md: "px-6 py-3 text-[11px] tracking-[0.3em]",
  lg: "px-8 py-4 text-xs tracking-[0.3em]",
};

const iconSizes: Record<ButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

const variants: Record<Exclude<ButtonVariant, "icon" | "sweep">, string> = {
  outline: "rounded-full border border-white/15 text-ink",
  ghost: "rounded-full border border-transparent text-muted",
};

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { as, variant = "outline", tone = "cyan", size = "md", className, children, type, ...props },
  ref,
) {
  const Tag = (as ?? "button") as ElementType;
  // Only real buttons get a default `type`.
  const typeProp = Tag === "button" ? { type: type ?? "button" } : {};

  if (variant === "icon") {
    return (
      <Tag
        ref={ref}
        className={cn(
          base,
          "glass grid place-items-center rounded-full text-ink",
          iconSizes[size],
          toneOutlineHover[tone],
          className,
        )}
        {...typeProp}
        {...props}
      >
        {children}
      </Tag>
    );
  }

  if (variant === "sweep") {
    return (
      <Tag
        ref={ref}
        className={cn(
          base,
          "group overflow-hidden rounded-full border text-ink hover:text-void",
          toneSweepBorder[tone],
          sizes[size],
          className,
        )}
        {...typeProp}
        {...props}
      >
        {/* Fill slides in from the left on hover. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 -translate-x-full bg-gradient-to-r transition-transform duration-500 ease-out group-hover:translate-x-0",
            toneSweepFill[tone],
          )}
        />
        <span className="relative z-10">{children}</span>
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={cn(base, variants[variant], toneOutlineHover[tone], sizes[size], className)}
      {...typeProp}
      {...props}
    >
      {children}
    </Tag>
  );
});
