import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";
import { useInView, REVEAL_MARGIN } from "../../hooks/useInView";

interface GroupContextValue {
  visible: boolean;
}

const GroupContext = createContext<GroupContextValue | null>(null);

/** Seconds to whole milliseconds — keeps float noise out of the inline style. */
const ms = (seconds: number): number => Math.round(seconds * 1000);

export interface RevealProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: ElementType;
  children?: ReactNode;
  /** Vertical travel in px. Default 44. */
  y?: number;
  /** Horizontal travel in px. Default 0. */
  x?: number;
  /** Entry blur in px. Default 0. */
  blur?: number;
  /** Seconds. Default 0.95. */
  duration?: number;
  /** Seconds. Default 0. */
  delay?: number;
  /** Re-animate on every entry when false. Default true. */
  once?: boolean;
  margin?: string;
  amount?: number | "some" | "all";
  /** Render permanently visible (no observer). */
  disabled?: boolean;
}

/**
 * Fades and rises its child as it enters the viewport.
 *
 * The animation is a CSS transition keyed off `data-visible`, so it costs no
 * JS per frame, survives SSR, and is disabled wholesale by
 * `prefers-reduced-motion` in one CSS block.
 */
export const Reveal = forwardRef<HTMLElement, RevealProps>(function Reveal(
  {
    as,
    children,
    y,
    x,
    blur,
    duration,
    delay,
    once = true,
    margin = REVEAL_MARGIN,
    amount = "some",
    disabled = false,
    className,
    style,
    ...props
  },
  forwardedRef,
) {
  const Tag = (as ?? "div") as ElementType;
  const localRef = useRef<HTMLElement | null>(null);
  const ref = useMergedRef<HTMLElement>(localRef, forwardedRef);

  const group = useContext(GroupContext);
  const inGroup = group !== null;

  // Inside a group the container owns the single observer.
  const selfInView = useInView(localRef, {
    once,
    margin,
    amount,
    enabled: !disabled && !inGroup,
  });

  const visible = disabled || (inGroup ? group.visible : selfInView);

  const vars: Record<string, string> = {};
  if (y !== undefined) vars["--lumen-reveal-y"] = `${y}px`;
  if (x !== undefined) vars["--lumen-reveal-x"] = `${x}px`;
  if (blur !== undefined) vars["--lumen-reveal-blur"] = `${blur}px`;
  if (duration !== undefined) vars["--lumen-reveal-duration"] = `${ms(duration)}ms`;
  if (delay !== undefined) vars["--lumen-reveal-delay"] = `${ms(delay)}ms`;

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      className={cn("lumen-reveal", className)}
      style={{ ...vars, ...style } as CSSProperties}
      {...props}
    >
      {children}
    </Tag>
  );
});

export interface RevealGroupProps extends RevealProps {
  /** Seconds between children. Default 0.1. */
  stagger?: number;
  /** Cap the stagger index so long lists don't end on a huge delay. Default 4. */
  cap?: number;
  /** Seconds before the first child. Default 0. */
  initialDelay?: number;
}

/**
 * Staggers its children as the group enters the viewport.
 *
 * One IntersectionObserver serves the whole group. The stagger index is capped
 * (default 4), so a 40-item grid finishes promptly instead of trailing off.
 */
export const RevealGroup = forwardRef<HTMLElement, RevealGroupProps>(function RevealGroup(
  {
    as,
    children,
    stagger = 0.1,
    cap = 4,
    initialDelay = 0,
    once = true,
    margin = REVEAL_MARGIN,
    amount = "some",
    disabled = false,
    className,
    style,
    y,
    x,
    blur,
    duration,
    ...props
  },
  forwardedRef,
) {
  const Tag = (as ?? "div") as ElementType;
  const localRef = useRef<HTMLElement | null>(null);
  const ref = useMergedRef<HTMLElement>(localRef, forwardedRef);

  const inView = useInView(localRef, { once, margin, amount, enabled: !disabled });
  const visible = disabled || inView;

  let i = 0;
  const items = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const delay = initialDelay + Math.min(i, cap) * stagger;
    i += 1;

    const childProps = child.props as RevealProps;
    // Already a Reveal: hand it the computed delay and let it read the context.
    if (child.type === Reveal) {
      return cloneElement(child as never, { delay: childProps.delay ?? delay });
    }
    return (
      <Reveal delay={delay} y={y} x={x} blur={blur} duration={duration}>
        {child}
      </Reveal>
    );
  });

  return (
    <GroupContext.Provider value={{ visible }}>
      <Tag ref={ref} className={cn(className)} style={style} {...props}>
        {items}
      </Tag>
    </GroupContext.Provider>
  );
});
