import { clamp } from "./math";
import { canUseDOM, setAttrIfChanged } from "./dom";
import { observe } from "./observers";

/**
 * A single document-scroll store shared by every Lumen consumer.
 *
 * Design notes:
 * - The rAF is *event-scheduled*, not a permanent loop, so an idle page costs nothing.
 * - Element measurements are batched read-pass-then-write-pass, so N parallax
 *   elements cost one layout rather than N layout thrashes.
 * - Progress is published as a CSS custom property on <html>, so purely visual
 *   consumers can bind to scroll without involving React at all.
 */

export interface ScrollSnapshot {
  /** window.scrollY, in px. */
  y: number;
  /** 0..1 through the document's scrollable range. */
  progress: number;
  /** px per ms, signed. */
  velocity: number;
  direction: 1 | -1;
}

const INITIAL: ScrollSnapshot = { y: 0, progress: 0, velocity: 0, direction: 1 };

let current: ScrollSnapshot = INITIAL;
const listeners = new Set<() => void>();

let frame = 0;
let lastY = 0;
let lastT = 0;
let idleTimer: ReturnType<typeof setTimeout> | undefined;
let started = false;
let resizeObserver: ResizeObserver | undefined;

/* ------------------------------------------------------------------ *
 * Element progress registry
 * ------------------------------------------------------------------ */

export type ProgressRange = "cover" | "contain";

interface Registration {
  el: HTMLElement;
  range: ProgressRange;
  /** Whether the element is near enough the viewport to be worth measuring. */
  active: boolean;
  p: number;
  onChange?: (p: number) => void;
  writeVar: boolean;
  dispose: () => void;
}

const registry = new Set<Registration>();

/**
 * Track an element's progress through the viewport.
 * Writes `--lumen-p` (0..1) on the element each frame it is near the viewport.
 */
export function registerElement(
  el: HTMLElement,
  options: { range?: ProgressRange; onChange?: (p: number) => void; writeVar?: boolean } = {},
): () => void {
  if (!canUseDOM) return () => {};

  const reg: Registration = {
    el,
    range: options.range ?? "cover",
    active: false,
    p: 0,
    onChange: options.onChange,
    writeVar: options.writeVar ?? true,
    dispose: () => {},
  };

  // Only measure elements that are near the viewport.
  reg.dispose = observe(el, { rootMargin: "25% 0px", threshold: 0 }, (entry) => {
    reg.active = entry.isIntersecting;
    if (reg.active) schedule();
  });

  registry.add(reg);
  start();
  schedule();

  return () => {
    reg.dispose();
    registry.delete(reg);
    maybeStop();
  };
}

/** Progress of a rect through the viewport, matching CSS `view()` semantics. */
function fromRect(rect: DOMRect, range: ProgressRange): number {
  const vh = window.innerHeight;
  if (range === "contain") {
    // 0 when the element's bottom aligns with the viewport bottom,
    // 1 when its top aligns with the viewport top.
    const span = rect.height - vh;
    if (span <= 0) return clamp((vh - rect.top) / (vh + rect.height));
    return clamp(-rect.top / span);
  }
  // cover: 0 as the element's top edge enters, 1 as its bottom edge leaves.
  return clamp((vh - rect.top) / (vh + rect.height));
}

function tickElements(): void {
  if (registry.size === 0) return;

  // Read pass — every getBoundingClientRect() first.
  const pending: Registration[] = [];
  for (const reg of registry) {
    if (!reg.active) continue;
    reg.p = fromRect(reg.el.getBoundingClientRect(), reg.range);
    pending.push(reg);
  }

  // Write pass — no reads after this point, so layout is calculated once.
  for (const reg of pending) {
    if (reg.writeVar) reg.el.style.setProperty("--lumen-p", reg.p.toFixed(4));
    reg.onChange?.(reg.p);
  }
}

/* ------------------------------------------------------------------ *
 * The loop
 * ------------------------------------------------------------------ */

function schedule(): void {
  if (frame || !canUseDOM) return;
  frame = requestAnimationFrame(measure);
}

function measure(now: number): void {
  frame = 0;

  const doc = document.documentElement;
  const y = window.scrollY;
  const max = doc.scrollHeight - doc.clientHeight;
  const progress = max > 0 ? clamp(y / max) : 0;

  const dt = lastT ? now - lastT : 16.7;
  const velocity = dt > 0 ? (y - lastY) / dt : 0;
  const direction: 1 | -1 = velocity === 0 ? current.direction : velocity > 0 ? 1 : -1;
  lastY = y;
  lastT = now;

  current = { y, progress, velocity, direction };

  doc.style.setProperty("--lumen-scroll", progress.toFixed(4));
  doc.style.setProperty("--lumen-scroll-y", `${y}px`);
  setAttrIfChanged(doc, "data-lumen-scroll-dir", direction > 0 ? "down" : "up");
  setAttrIfChanged(doc, "data-lumen-scrolled", y > 8 ? "" : null);

  tickElements();
  for (const l of listeners) l();

  // One settle frame after scrolling stops so velocity decays to zero.
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (current.velocity !== 0) {
      lastT = 0;
      current = { ...current, velocity: 0 };
      schedule();
    }
  }, 120);
}

function onScroll(): void {
  schedule();
}

function start(): void {
  if (started || !canUseDOM) return;
  started = true;
  lastY = window.scrollY;
  lastT = 0;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  if (typeof ResizeObserver !== "undefined") {
    // Content growing (lazy images, fonts) changes scrollHeight.
    resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(document.body);
  }
  schedule();
}

function maybeStop(): void {
  if (!started) return;
  if (listeners.size > 0 || registry.size > 0) return;
  started = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  clearTimeout(idleTimer);
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

/* ------------------------------------------------------------------ *
 * Public store API (useSyncExternalStore shape)
 * ------------------------------------------------------------------ */

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  start();
  return () => {
    listeners.delete(fn);
    maybeStop();
  };
}

export const getSnapshot = (): ScrollSnapshot => current;

/** Stable constant snapshot for SSR and hydration. */
export const getServerSnapshot = (): ScrollSnapshot => INITIAL;
