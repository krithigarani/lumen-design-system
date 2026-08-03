import { useEffect, useRef, useState, type RefObject } from "react";
import { registerElement, type ProgressRange } from "../lib/scroll-store";
import { useReducedMotion } from "./useReducedMotion";

export interface UseElementScrollProgressOptions {
  range?: ProgressRange;
  /** Skip registration entirely (e.g. under reduced motion). */
  enabled?: boolean;
  onChange?: (p: number) => void;
}

/**
 * Track an element's progress through the viewport and publish it as the
 * `--lumen-p` custom property on that element. Causes **no** React re-renders.
 */
export function useElementScrollProgress(
  ref: RefObject<HTMLElement | null>,
  { range = "cover", enabled = true, onChange }: UseElementScrollProgressOptions = {},
): void {
  // Keep the latest callback without re-registering every render.
  const cb = useRef(onChange);
  cb.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    return registerElement(el, {
      range,
      onChange: (p) => cb.current?.(p),
    });
  }, [ref, range, enabled]);
}

/**
 * React-facing variant: returns the element's progress as quantised state.
 * Prefer `useElementScrollProgress` (CSS-var driven) unless you must render
 * the number itself.
 */
export function useElementProgressValue(
  ref: RefObject<HTMLElement | null>,
  { range = "cover", steps = 100 }: { range?: ProgressRange; steps?: number } = {},
): number {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerElement(el, {
      range,
      writeVar: false,
      onChange: (p) => {
        const q = steps > 0 ? Math.round(p * steps) / steps : p;
        setValue((prev) => (prev === q ? prev : q));
      },
    });
  }, [ref, range, steps, reduced]);

  return value;
}
