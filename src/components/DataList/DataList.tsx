import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface DataListProps extends HTMLAttributes<HTMLDListElement> {
  children?: ReactNode;
}

/** A lightweight label/value list — the low-ceremony stand-in for a table. */
export const DataList = forwardRef<HTMLDListElement, DataListProps>(function DataList(
  { className, children, ...props },
  ref,
) {
  return (
    <dl ref={ref} className={cn("flex flex-col gap-2.5", className)} {...props}>
      {children}
    </dl>
  );
});

export interface DataRowProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value?: ReactNode;
}

export const DataRow = forwardRef<HTMLDivElement, DataRowProps>(function DataRow(
  { label, value, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-white/5 pb-2.5 last:border-0",
        className,
      )}
      {...props}
    >
      <dt className="text-sm text-ink/90">{label}</dt>
      {value && (
        <dd className="shrink-0 text-[11px] tracking-[0.2em] text-faint uppercase">{value}</dd>
      )}
    </div>
  );
});
