import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

interface ControlProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Text beside the control. Omit it and supply your own `aria-label`. */
  label?: ReactNode;
  /** Secondary line under the label. */
  description?: ReactNode;
}

export type CheckboxProps = ControlProps;
export type RadioProps = ControlProps;
export type SwitchProps = ControlProps;

/**
 * Wraps a control in a label so the text is a click target.
 *
 * The description lives *outside* the label and is wired with
 * `aria-describedby`: inside it, its text would be concatenated into the
 * control's accessible name.
 */
function Labelled({
  label,
  description,
  disabled,
  className,
  control,
}: {
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
  control: (describedBy?: string) => ReactNode;
}) {
  const descriptionId = useId();

  if (!label && !description) {
    return <span className={cn("inline-flex", className)}>{control()}</span>;
  }

  const row = (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 font-body text-sm leading-tight text-ink",
        disabled && "cursor-not-allowed",
      )}
    >
      {control(description ? descriptionId : undefined)}
      {label}
    </label>
  );

  if (!description) {
    return <div className={cn(disabled && "opacity-40", className)}>{row}</div>;
  }

  return (
    <div className={cn("flex flex-col gap-1", disabled && "opacity-40", className)}>
      {row}
      <span id={descriptionId} className="pl-[1.9rem] font-body text-xs leading-snug text-muted">
        {description}
      </span>
    </div>
  );
}

/** A single checkbox. Supports `indeterminate` via a ref. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, className, ...props },
  ref,
) {
  return (
    <Labelled
      label={label}
      description={description}
      disabled={props.disabled}
      className={className}
      control={(describedBy) => (
        <input
          ref={ref}
          type="checkbox"
          aria-describedby={describedBy}
          className="lumen-control lumen-checkbox"
          {...props}
        />
      )}
    />
  );
});

/** One option in a {@link RadioGroup}. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, className, ...props },
  ref,
) {
  return (
    <Labelled
      label={label}
      description={description}
      disabled={props.disabled}
      className={className}
      control={(describedBy) => (
        <input
          ref={ref}
          type="radio"
          aria-describedby={describedBy}
          className="lumen-control lumen-radio"
          {...props}
        />
      )}
    />
  );
});

/** An on/off toggle. Announced as a switch rather than a checkbox. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, className, ...props },
  ref,
) {
  return (
    <Labelled
      label={label}
      description={description}
      disabled={props.disabled}
      className={className}
      control={(describedBy) => (
        <span className="relative inline-flex">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            aria-describedby={describedBy}
            className="lumen-switch-input"
            {...props}
          />
          <span className="lumen-switch-track" aria-hidden>
            <span className="lumen-switch-thumb" />
          </span>
        </span>
      )}
    />
  );
});

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Shared form name, handed to every Radio child. */
  name: string;
  orientation?: "vertical" | "horizontal";
  /** Accessible name for the group. */
  label?: string;
  children?: ReactNode;
}

/**
 * Groups radios under one name.
 *
 * The name is injected into the children rather than passed through context,
 * which keeps the group renderable on the server.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { name, orientation = "vertical", label, className, children, ...props },
  ref,
) {
  const options = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const childProps = child.props as RadioProps;
    return cloneElement(child as ReactElement<RadioProps>, {
      name: childProps.name ?? name,
    });
  });

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      className={cn(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap items-center gap-6",
        className,
      )}
      {...props}
    >
      {options}
    </div>
  );
});
