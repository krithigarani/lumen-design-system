/**
 * Body scroll lock, reference-counted so stacked overlays don't unlock early.
 * `showModal()` does not reliably stop the background from scrolling.
 */

let count = 0;
let previous = "";

export function lockScroll(): void {
  if (typeof document === "undefined") return;
  if (count === 0) {
    previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
  }
  count += 1;
}

export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  count = Math.max(0, count - 1);
  if (count === 0) document.documentElement.style.overflow = previous;
}
