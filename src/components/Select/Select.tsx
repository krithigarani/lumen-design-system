import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Renders a disabled first option, so an empty select still reads clearly. */
  placeholder?: string;
  children?: ReactNode;
}

/**
 * A styled native `<select>`.
 *
 * Deliberately not a custom listbox: the native control brings the platform
 * picker on mobile, type-ahead, and full keyboard support at no cost.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { placeholder, className, children, defaultValue, value, ...props },
  ref,
) {
  // Only default the selection when the caller isn't controlling it.
  const uncontrolled =
    value === undefined && defaultValue === undefined && placeholder ? { defaultValue: "" } : {};

  return (
    <select
      ref={ref}
      className={cn(
        "lumen-select w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3",
        "font-body text-sm text-ink outline-none transition-colors",
        "focus:border-cyan/60 focus-visible:outline-none disabled:opacity-40",
        className,
      )}
      value={value}
      defaultValue={defaultValue}
      {...uncontrolled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
});
