/**
 * A shared IntersectionObserver cache.
 *
 * Observers are keyed by their options, so a 30-item RevealGroup page creates
 * one observer rather than thirty.
 */

type Callback = (entry: IntersectionObserverEntry) => void;

interface Entry {
  observer: IntersectionObserver;
  callbacks: WeakMap<Element, Set<Callback>>;
  count: number;
}

const cache = new Map<string, Entry>();

export interface ObserveOptions {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Observe `el` and return an unsubscribe function.
 * Returns a no-op when IntersectionObserver is unavailable.
 */
export function observe(el: Element, options: ObserveOptions, cb: Callback): () => void {
  if (typeof IntersectionObserver === "undefined") return () => {};

  const { root = null, rootMargin = "0px", threshold = 0 } = options;
  // Roots can't be serialised, so they get an identity tag.
  const key = `${rootId(root)}|${rootMargin}|${String(threshold)}`;

  let entry = cache.get(key);
  if (!entry) {
    const callbacks = new WeakMap<Element, Set<Callback>>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const set = callbacks.get(e.target);
          if (!set) continue;
          for (const fn of set) fn(e);
        }
      },
      { root, rootMargin, threshold },
    );
    entry = { observer, callbacks, count: 0 };
    cache.set(key, entry);
  }

  let set = entry.callbacks.get(el);
  if (!set) {
    set = new Set();
    entry.callbacks.set(el, set);
    entry.observer.observe(el);
  }
  set.add(cb);
  entry.count += 1;

  let done = false;
  return () => {
    if (done) return;
    done = true;
    const current = cache.get(key);
    if (!current) return;
    const s = current.callbacks.get(el);
    if (s) {
      s.delete(cb);
      if (s.size === 0) {
        current.callbacks.delete(el);
        current.observer.unobserve(el);
      }
    }
    current.count -= 1;
    if (current.count <= 0) {
      current.observer.disconnect();
      cache.delete(key);
    }
  };
}

let nextRootId = 0;
const rootIds = new WeakMap<Element | Document, number>();

function rootId(root: Element | Document | null): string {
  if (!root) return "viewport";
  let id = rootIds.get(root);
  if (id === undefined) {
    id = nextRootId++;
    rootIds.set(root, id);
  }
  return `root${id}`;
}
