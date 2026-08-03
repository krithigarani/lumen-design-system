import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional label sitting in the rule. */
  label?: ReactNode;
  align?: "left" | "center";
}

/**
 * A fading hairline, optionally carrying a tracked uppercase label.
 * With no label it renders a plain `<hr>`.
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { label, align = "center", className, ...props },
  ref,
) {
  if (!label) {
    return <hr className={cn("hairline", className)} {...props} />;
  }

  return (
    <div ref={ref} className={cn("flex items-center gap-4", className)} {...props}>
      {align === "center" && <span aria-hidden className="hairline flex-1" />}
      {align === "left" && <span aria-hidden className="hairline w-8 shrink-0" />}
      <span className="eyebrow shrink-0">{label}</span>
      <span aria-hidden className="hairline flex-1" />
    </div>
  );
});
