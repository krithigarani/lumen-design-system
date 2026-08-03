/** Scroll & animation math. Pure, SSR-safe, tree-shakeable. */

export const clamp = (v: number, min = 0, max = 1): number => (v < min ? min : v > max ? max : v);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const inverseLerp = (a: number, b: number, v: number): number =>
  a === b ? 0 : (v - a) / (b - a);

/** Remap `p` from the sub-range [start, end] onto a clamped 0..1. */
export const subProgress = (p: number, start: number, end: number): number =>
  clamp(inverseLerp(start, end, p));

export const smoothstep = (t: number, a = 0, b = 1): number => {
  const x = subProgress(t, a, b);
  return x * x * (3 - 2 * x);
};

export const smootherstep = (t: number, a = 0, b = 1): number => {
  const x = subProgress(t, a, b);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/**
 * Fade in across [a,b], hold, then fade out across [c,d].
 * The "band" idiom used repeatedly for scroll-window reveals.
 */
export const band = (t: number, a: number, b: number, c: number, d: number): number =>
  smoothstep(t, a, b) * (1 - smoothstep(t, c, d));

/** Frame-rate-independent exponential approach. `dt` in seconds. */
export const damp = (current: number, target: number, decay: number, dt: number): number =>
  lerp(current, target, 1 - Math.exp(-decay * dt));
