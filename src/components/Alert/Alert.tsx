import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { type Status, statusSurface, statusText, statusGlyph } from "../../lib/status";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  status?: Status;
  title?: ReactNode;
  /** Replaces the default glyph. Pass `null` to drop it. */
  icon?: ReactNode;
  /** Actions rendered beneath the message. */
  action?: ReactNode;
  children?: ReactNode;
}

/**
 * An inline message.
 *
 * `danger` and `warning` announce assertively; `info` and `success` announce
 * politely, so a passing status doesn't interrupt what a screen reader is
 * already saying.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { status = "info", title, icon, action, className, children, ...props },
  ref,
) {
  const assertive = status === "danger" || status === "warning";

  return (
    <div
      ref={ref}
      role={assertive ? "alert" : "status"}
      aria-live={assertive ? "assertive" : "polite"}
      className={cn(
        "flex gap-3 rounded-2xl border p-4 font-body",
        statusSurface[status],
        className,
      )}
      {...props}
    >
      {icon !== null && (
        <span aria-hidden className={cn("mt-px text-sm leading-none", statusText[status])}>
          {icon ?? statusGlyph[status]}
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        {title && (
          <p className={cn("text-[11px] tracking-[0.2em] uppercase", statusText[status])}>
            {title}
          </p>
        )}
        {children && <div className="text-sm leading-relaxed text-ink/90">{children}</div>}
        {action && <div className="mt-2 flex gap-3">{action}</div>}
      </div>
    </div>
  );
});
