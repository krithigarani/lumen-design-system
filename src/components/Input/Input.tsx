import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-body text-sm text-ink " +
  "placeholder:text-faint transition-colors outline-none " +
  "focus:border-cyan/60 focus-visible:outline-none disabled:opacity-40";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cn(field, className)} {...props} />;
});

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 4, ...props },
  ref,
) {
  return <textarea ref={ref} rows={rows} className={cn(field, "resize-y", className)} {...props} />;
});

export interface FieldProps {
  label: string;
  /** Message shown beneath the control; styled as an error when `invalid`. */
  hint?: string;
  invalid?: boolean;
  className?: string;
  /** Receives the generated id so the label points at the control. */
  children: (id: string) => ReactNode;
}

/** Labelled wrapper that wires a generated id to the control it renders. */
export function Field({ label, hint, invalid = false, className, children }: FieldProps) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      {children(id)}
      {hint && (
        <span className={cn("font-body text-xs", invalid ? "text-rose" : "text-faint")}>{hint}</span>
      )}
    </div>
  );
}
