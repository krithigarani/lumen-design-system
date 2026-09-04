import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "content"> {
  /** The tooltip text. Kept short — it is a hint, not a paragraph. */
  content: ReactNode;
  placement?: TooltipPlacement;
  children: ReactElement;
}

/**
 * A hint shown on hover and on keyboard focus.
 *
 * Pure CSS, so it needs no JavaScript and stays server-renderable. That does
 * mean it has no collision detection: near a viewport edge, reach for
 * `Popover` instead.
 *
 * The bubble is wired to the trigger with `aria-describedby`, so it is
 * announced rather than being decoration only.
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  { content, placement = "top", className, children, ...props },
  ref,
) {
  const id = useId();

  const trigger = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        "aria-describedby": id,
      })
    : children;

  return (
    <span ref={ref} className={cn("lumen-tooltip relative inline-flex", className)} {...props}>
      {trigger}
      <span
        id={id}
        role="tooltip"
        data-placement={placement}
        className={cn(
          "lumen-tooltip-bubble glass pointer-events-none rounded-xl px-3 py-2",
          "text-center font-body text-xs leading-snug text-ink",
        )}
      >
        {content}
      </span>
    </span>
  );
});
