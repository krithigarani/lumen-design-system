import { useCallback, useSyncExternalStore } from "react";
import { canUseDOM } from "../lib/dom";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(fn: () => void): () => void {
  if (!canUseDOM || typeof matchMedia === "undefined") return () => {};
  const mql = matchMedia(QUERY);
  mql.addEventListener("change", fn);
  return () => mql.removeEventListener("change", fn);
}

const getSnapshot = (): boolean =>
  canUseDOM && typeof matchMedia !== "undefined" ? matchMedia(QUERY).matches : false;

/**
 * Whether the user prefers reduced motion.
 *
 * Only for behaviour CSS can't reach — autoplay, smooth-scroll behaviour,
 * skipping measurement. Visual transitions are handled in CSS so they need
 * no JS branch (and so they can't cause a hydration mismatch).
 */
export function useReducedMotion(): boolean {
  const getServer = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServer);
}
