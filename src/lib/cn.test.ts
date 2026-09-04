import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });

  it("resolves conflicting Tailwind utilities in favour of the last", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
    expect(cn("text-ink", "text-cyan")).toBe("text-cyan");
    expect(cn("rounded-2xl", "rounded-3xl")).toBe("rounded-3xl");
  });

  it("keeps non-conflicting utilities", () => {
    expect(cn("flex items-center", "gap-3")).toBe("flex items-center gap-3");
  });

  it("lets a caller's className win, which every component relies on", () => {
    // Components spread `cn(base, className)` — the override must survive.
    const base = "rounded-full border border-white/15 px-6";
    expect(cn(base, "px-10")).toContain("px-10");
    expect(cn(base, "px-10")).not.toContain("px-6");
  });

  it("accepts arrays and conditional objects", () => {
    expect(cn(["a", "b"], { c: true, d: false })).toBe("a b c");
  });
});
