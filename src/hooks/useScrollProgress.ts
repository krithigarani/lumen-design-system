import { useCallback, useSyncExternalStore } from "react";
import { subscribe, getSnapshot } from "../lib/scroll-store";

/**
 * Document scroll progress, 0..1.
 *
 * The value is quantised to `steps` so a full-page scroll causes at most
 * `steps + 1` re-renders rather than one per frame. Returns a primitive, so
 * it is tearing-safe under concurrent rendering.
 */
export function useScrollProgress({ steps = 100 }: { steps?: number } = {}): number {
  const get = useCallback(() => {
    const { progress } = getSnapshot();
    return steps > 0 ? Math.round(progress * steps) / steps : progress;
  }, [steps]);

  const getServer = useCallback(() => 0, []);

  return useSyncExternalStore(subscribe, get, getServer);
}

/** Current scroll direction. Naturally coarse — re-renders only on reversal. */
export function useScrollDirection(): 1 | -1 {
  const get = useCallback(() => getSnapshot().direction, []);
  const getServer = useCallback((): 1 | -1 => 1, []);
  return useSyncExternalStore(subscribe, get, getServer);
}

/** Whether the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 8): boolean {
  const get = useCallback(() => getSnapshot().y > threshold, [threshold]);
  const getServer = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, get, getServer);
}
