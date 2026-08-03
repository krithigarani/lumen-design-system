import { useEffect, useState } from "react";
import { observe } from "../lib/observers";

export interface UseScrollSpyOptions {
  /** Activation band. Defaults to the middle third of the viewport. */
  margin?: string;
  root?: Element | null;
}

/**
 * Returns the id of the section currently in view.
 *
 * Uses one shared IntersectionObserver and picks the entry closest to the top
 * of the activation band, so overlapping sections resolve deterministically.
 */
export function useScrollSpy(
  ids: string[],
  { margin = "-40% 0px -55% 0px", root = null }: UseScrollSpyOptions = {},
): string {
  const key = ids.join("|");
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    const visible = new Map<string, number>();
    const offs: (() => void)[] = [];

    for (const id of ids) {
      const el = typeof document === "undefined" ? null : document.getElementById(id);
      if (!el) continue;
      offs.push(
        observe(el, { root, rootMargin: margin, threshold: 0 }, (entry) => {
          if (entry.isIntersecting) visible.set(id, entry.boundingClientRect.top);
          else visible.delete(id);

          if (visible.size === 0) return;
          // The section whose top is nearest the band wins.
          let best = "";
          let bestTop = Infinity;
          for (const [candidate, top] of visible) {
            const d = Math.abs(top);
            if (d < bestTop) {
              bestTop = d;
              best = candidate;
            }
          }
          if (best) setActiveId(best);
        }),
      );
    }

    return () => {
      for (const off of offs) off();
    };
    // `key` stands in for the array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, margin, root]);

  return activeId;
}
