import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";
import { useInView, REVEAL_MARGIN } from "../../hooks/useInView";

export interface SplitTextProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  as?: ElementType;
  /** Plain text — required, since the component splits it. */
  children: string;
  by?: "char" | "word";
  trigger?: "inview" | "mount";
  /** Seconds between pieces. Default 0.04. */
  stagger?: number;
  /** Seconds. Default 1.3. */
  duration?: number;
  /** Travel in px. Default 50. */
  y?: number;
  /** Entry blur in px. Default 8. */
  blur?: number;
  /** Seconds. Caps the total ramp so long strings still land promptly. Default 1.2. */
  maxDelay?: number;
  once?: boolean;
}

/**
 * Reveals text piece by piece with a blur-in.
 *
 * The full string stays on the wrapper as `aria-label` and every piece is
 * `aria-hidden`, so screen readers announce the sentence rather than spelling
 * it out letter by letter.
 */
export const SplitText = forwardRef<HTMLElement, SplitTextProps>(function SplitText(
  {
    as,
    children,
    by = "char",
    trigger = "inview",
    stagger,
    duration,
    y,
    blur,
    maxDelay,
    once = true,
    className,
    style,
    ...props
  },
  forwardedRef,
) {
  const Tag = (as ?? "span") as ElementType;
  const localRef = useRef<HTMLElement | null>(null);
  const ref = useMergedRef<HTMLElement>(localRef, forwardedRef);

  const inView = useInView(localRef, {
    once,
    margin: REVEAL_MARGIN,
    enabled: trigger === "inview",
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (trigger !== "mount") return;
    // A frame later, so the transition has an initial state to move from.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, [trigger]);

  const visible = trigger === "mount" ? mounted : inView;

  const ms = (seconds: number) => Math.round(seconds * 1000);
  const vars: Record<string, string> = {};
  if (stagger !== undefined) vars["--lumen-split-stagger"] = `${ms(stagger)}ms`;
  if (duration !== undefined) vars["--lumen-split-duration"] = `${ms(duration)}ms`;
  if (y !== undefined) vars["--lumen-split-y"] = `${y}px`;
  if (blur !== undefined) vars["--lumen-split-blur"] = `${blur}px`;
  if (maxDelay !== undefined) vars["--lumen-split-max-delay"] = `${ms(maxDelay)}ms`;

  const words = children.split(" ");
  let index = 0;

  return (
    <Tag
      ref={ref}
      aria-label={children}
      data-visible={visible}
      className={cn("lumen-split", className)}
      style={{ ...vars, ...style } as CSSProperties}
      {...props}
    >
      {words.map((word, wi) => (
        // Words stay unbreakable so line wrapping still works normally.
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {by === "char" ? (
            word.split("").map((ch, ci) => (
              <span
                key={ci}
                className="lumen-split-char"
                style={{ "--lumen-i": index++ } as CSSProperties}
              >
                {ch}
              </span>
            ))
          ) : (
            <span className="lumen-split-char" style={{ "--lumen-i": index++ } as CSSProperties}>
              {word}
            </span>
          )}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
});
