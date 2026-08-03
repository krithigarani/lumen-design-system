import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface QuoteProps extends HTMLAttributes<HTMLElement> {
  author?: ReactNode;
  /** Role, company, or other attribution detail. Named to leave the native `role` attribute alone. */
  authorRole?: ReactNode;
  children?: ReactNode;
}

/** A pull quote with attribution. */
export const Quote = forwardRef<HTMLElement, QuoteProps>(function Quote(
  { author, authorRole, className, children, ...props },
  ref,
) {
  return (
    <figure ref={ref} className={cn("glass rounded-2xl p-6", className)} {...props}>
      <blockquote className="text-sm leading-relaxed text-ink/90 italic">
        &ldquo;{children}&rdquo;
      </blockquote>
      {(author || authorRole) && (
        <figcaption className="mt-4 text-[10px] tracking-[0.28em] text-faint uppercase">
          {author && <>— {author}</>}
          {authorRole && <span className="text-muted"> · {authorRole}</span>}
        </figcaption>
      )}
    </figure>
  );
});
