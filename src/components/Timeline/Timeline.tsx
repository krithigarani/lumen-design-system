import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  children?: ReactNode;
}

/** A vertical run of events along a glowing rail. */
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { className, children, ...props },
  ref,
) {
  return (
    <ol
      ref={ref}
      className={cn("relative list-none border-l border-violet/25 pl-8", className)}
      {...props}
    >
      {children}
    </ol>
  );
});

export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  /** e.g. "2023 — Present" */
  period?: ReactNode;
  title?: ReactNode;
  /** Organisation or secondary line. */
  meta?: ReactNode;
  children?: ReactNode;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { period, title, meta, className, children, ...props },
  ref,
) {
  return (
    <li ref={ref} className={cn("relative pb-9 last:pb-0", className)} {...props}>
      <span
        aria-hidden
        className="absolute -left-[37px] top-1.5 size-2.5 rounded-full bg-cyan shadow-[0_0_12px_#7dd3fc]"
      />
      {period && (
        <p className="text-[10px] tracking-[0.3em] text-faint uppercase">{period}</p>
      )}
      {title && (
        <h3 className="font-display mt-2 text-lg text-ink">
          {title}
          {meta && <span className="text-muted"> · {meta}</span>}
        </h3>
      )}
      {children && <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>}
    </li>
  );
});
