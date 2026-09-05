import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type LinkTone = "cyan" | "violet" | "gold" | "magenta" | "inherit";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: LinkTone;
  /** Show an outward arrow and open in a new tab, safely. */
  external?: boolean;
  /** Drop the underline until hover. */
  subtle?: boolean;
  children?: ReactNode;
}

const tones: Record<LinkTone, string> = {
  cyan: "text-cyan hover:text-cyan/80 decoration-cyan/40",
  violet: "text-violet hover:text-violet/80 decoration-violet/40",
  gold: "text-gold hover:text-gold/80 decoration-gold/40",
  magenta: "text-magenta hover:text-magenta/80 decoration-magenta/40",
  inherit: "text-inherit decoration-current/40",
};

/**
 * A styled anchor.
 *
 * `external` sets `rel="noopener noreferrer"` alongside `target="_blank"` —
 * without `noopener` the opened page can reach back through `window.opener`.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { tone = "cyan", external = false, subtle = false, className, children, ...props },
  ref,
) {
  const externalProps = external
    ? { target: "_blank", rel: props.rel ?? "noopener noreferrer" }
    : {};

  return (
    <a
      ref={ref}
      className={cn(
        "font-body underline-offset-4 transition-colors outline-none",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[3px]",
        subtle ? "no-underline hover:underline" : "underline",
        tones[tone],
        className,
      )}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <>
          <span aria-hidden className="ml-1 inline-block text-[0.8em]">
            ↗
          </span>
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
});
