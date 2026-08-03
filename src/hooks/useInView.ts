import { useEffect, useState, type RefObject } from "react";
import { observe } from "../lib/observers";

/** The Lumen default activation band: a 68vh window in the middle of the viewport. */
export const REVEAL_MARGIN = "-16% 0px -16% 0px";

export interface UseInViewOptions {
  /** Stop observing after the first intersection. Default `true`. */
  once?: boolean;
  /** IntersectionObserver rootMargin. */
  margin?: string;
  /**
   * How much must be visible. Note: with the default `margin`, `"all"` never
   * fires for elements taller than the activation band.
   */
  amount?: number | "some" | "all";
  root?: RefObject<Element | null> | null;
  /** When false, no observer is created and the hook returns `false`. */
  enabled?: boolean;
}

/**
 * Whether an element has entered the viewport.
 *
 * Defaults to fire-once, and *unobserves* rather than tracking a flag, so
 * scrolling back up can never re-hide revealed content.
 */
export function useInView(
  ref: RefObject<Element | null>,
  {
    once = true,
    margin = REVEAL_MARGIN,
    amount = "some",
    root = null,
    enabled = true,
  }: UseInViewOptions = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old browser, some test envs): show content.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const threshold = amount === "all" ? 1 : amount === "some" ? 0 : amount;
    let off: (() => void) | undefined;

    off = observe(
      el,
      { root: root?.current ?? null, rootMargin: margin, threshold },
      (entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) off?.();
        } else if (!once) {
          setInView(false);
        }
      },
    );

    return off;
  }, [ref, once, margin, amount, root, enabled]);

  return inView;
}
