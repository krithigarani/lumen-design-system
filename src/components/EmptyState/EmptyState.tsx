import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Large ghosted glyph or index. */
  glyph?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Call to action. */
  action?: ReactNode;
}

/** A placeholder frame for content that hasn't arrived yet. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { glyph, title, description, action, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/8 bg-gradient-to-br from-violet/10 via-surface to-cyan/8 p-10 text-center",
        className,
      )}
      {...props}
    >
      {glyph && (
        <span aria-hidden className="font-display text-3xl text-white/15">
          {glyph}
        </span>
      )}
      {title && <p className="font-display text-lg text-ink">{title}</p>}
      {description && (
        <p className="text-[9px] tracking-[0.4em] text-faint uppercase">{description}</p>
      )}
      {children}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
});
