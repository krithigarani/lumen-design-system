import { useCallback, useEffect, useLayoutEffect, type Ref } from "react";

export const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";

/** `useLayoutEffect` on the client, `useEffect` on the server (avoids the SSR warning). */
export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

/** Merge several refs into one callback ref. */
export function useMergedRef<T>(...refs: (Ref<T> | undefined)[]) {
  return useCallback((node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as { current: T | null }).current = node;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}

/** Set or remove an attribute only when it actually changes (avoids needless style invalidation). */
export function setAttrIfChanged(el: Element, name: string, value: string | null): void {
  if (value === null) {
    if (el.hasAttribute(name)) el.removeAttribute(name);
  } else if (el.getAttribute(name) !== value) {
    el.setAttribute(name, value);
  }
}
