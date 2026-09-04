import { describe, it, expect } from "vitest";

describe("platform support", () => {
  it("runs in a real browser", () => {
    expect(typeof window).toBe("object");
    expect(typeof IntersectionObserver).toBe("function");
    expect(typeof HTMLDialogElement.prototype.showModal).toBe("function");
    expect(CSS.supports("scroll-snap-type: x mandatory")).toBe(true);
  });

  it("loaded the real stylesheet", () => {
    const el = document.createElement("div");
    el.className = "glass";
    document.body.appendChild(el);
    const bf = getComputedStyle(el).backdropFilter || (getComputedStyle(el) as any).webkitBackdropFilter;
    expect(bf).toContain("blur");
    el.remove();
  });
});
