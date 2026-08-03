import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

type Level = 1 | 2 | 3 | 4;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: Level;
  /** Apply the violet/cyan text glow. */
  glow?: boolean;
  children?: ReactNode;
}

const levelStyles: Record<Level, string> = {
  1: "text-3xl md:text-5xl",
  2: "text-3xl md:text-4xl",
  3: "text-xl md:text-2xl",
  4: "text-base md:text-lg",
};

/** Display heading in the Syne display face. */
export function Heading({ level = 2, glow = false, className, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(
        "font-display font-semibold text-ink",
        levelStyles[level],
        glow && "text-glow",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

/** The 4-stop signature brand gradient, clipped to text. */
export function GradientText({ className, children, ...props }: GradientTextProps) {
  return (
    <span className={cn("gradient-text", className)} {...props}>
      {children}
    </span>
  );
}

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  tone?: "ink" | "muted" | "faint";
  size?: "xs" | "sm" | "md" | "lg";
  children?: ReactNode;
}

const textTones = { ink: "text-ink", muted: "text-muted", faint: "text-faint" } as const;
const textSizes = { xs: "text-xs", sm: "text-sm", md: "text-base", lg: "text-lg" } as const;

/** Body copy in the Space Grotesk body face. */
export function Text({ tone = "muted", size = "md", className, children, ...props }: TextProps) {
  return (
    <p
      className={cn("font-body leading-relaxed", textTones[tone], textSizes[size], className)}
      {...props}
    >
      {children}
    </p>
  );
}

export interface EyebrowProps extends HTMLAttributes<HTMLDivElement> {
  /** Show the short gradient dash before the label. */
  dash?: boolean;
  children?: ReactNode;
}

/** Wide-tracked uppercase micro-label, optionally preceded by a hairline dash. */
export function Eyebrow({ dash = true, className, children, ...props }: EyebrowProps) {
  return (
    <div className={cn("flex items-center gap-3 font-body", className)} {...props}>
      {dash && <span aria-hidden className="hairline w-8 shrink-0" />}
      <span className="eyebrow">{children}</span>
    </div>
  );
}

export type HairlineProps = HTMLAttributes<HTMLHRElement>;

/** Full-width fading divider. */
export function Hairline({ className, ...props }: HairlineProps) {
  return <hr className={cn("hairline", className)} {...props} />;
}
