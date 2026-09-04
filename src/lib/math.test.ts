import { describe, it, expect } from "vitest";
import {
  clamp,
  lerp,
  inverseLerp,
  subProgress,
  smoothstep,
  smootherstep,
  band,
  damp,
} from "./math";

describe("clamp", () => {
  it("bounds to 0..1 by default", () => {
    expect(clamp(-5)).toBe(0);
    expect(clamp(0.4)).toBe(0.4);
    expect(clamp(5)).toBe(1);
  });

  it("honours explicit bounds", () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-15, -10, 10)).toBe(-10);
  });
});

describe("lerp", () => {
  it("interpolates and extrapolates", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(0, 10, 2)).toBe(20);
  });
});

describe("inverseLerp", () => {
  it("is the inverse of lerp", () => {
    expect(inverseLerp(10, 20, 15)).toBe(0.5);
  });

  it("returns 0 for a zero-width range rather than dividing by zero", () => {
    expect(inverseLerp(5, 5, 5)).toBe(0);
    expect(Number.isFinite(inverseLerp(5, 5, 99))).toBe(true);
  });
});

describe("subProgress", () => {
  it("remaps a sub-range onto a clamped 0..1", () => {
    expect(subProgress(0.5, 0.5, 1)).toBe(0);
    expect(subProgress(0.75, 0.5, 1)).toBe(0.5);
    expect(subProgress(1, 0.5, 1)).toBe(1);
  });

  it("clamps outside the range", () => {
    expect(subProgress(0.1, 0.5, 1)).toBe(0);
    expect(subProgress(2, 0.5, 1)).toBe(1);
  });
});

describe("smoothstep / smootherstep", () => {
  it("pins the endpoints", () => {
    for (const fn of [smoothstep, smootherstep]) {
      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
      expect(fn(0.5)).toBeCloseTo(0.5, 10);
    }
  });

  it("is monotonically increasing", () => {
    for (const fn of [smoothstep, smootherstep]) {
      let prev = -Infinity;
      for (let i = 0; i <= 20; i++) {
        const v = fn(i / 20);
        expect(v).toBeGreaterThanOrEqual(prev);
        prev = v;
      }
    }
  });

  it("eases in from a sub-range", () => {
    expect(smoothstep(0.25, 0.25, 0.75)).toBe(0);
    expect(smoothstep(0.75, 0.25, 0.75)).toBe(1);
    expect(smoothstep(0.5, 0.25, 0.75)).toBeCloseTo(0.5, 10);
  });

  it("smootherstep has a flatter start than smoothstep", () => {
    expect(smootherstep(0.1)).toBeLessThan(smoothstep(0.1));
  });
});

describe("band", () => {
  // Fades in across [a,b], holds, fades out across [c,d].
  it("is zero before the ramp and after the fall", () => {
    expect(band(0.0, 0.1, 0.3, 0.6, 0.9)).toBe(0);
    expect(band(0.1, 0.1, 0.3, 0.6, 0.9)).toBe(0);
    expect(band(0.9, 0.1, 0.3, 0.6, 0.9)).toBe(0);
    expect(band(1.0, 0.1, 0.3, 0.6, 0.9)).toBe(0);
  });

  it("reaches full strength on the plateau", () => {
    expect(band(0.45, 0.1, 0.3, 0.6, 0.9)).toBe(1);
  });

  it("is partial mid-ramp", () => {
    const rising = band(0.2, 0.1, 0.3, 0.6, 0.9);
    expect(rising).toBeGreaterThan(0);
    expect(rising).toBeLessThan(1);
  });

  it("never leaves 0..1", () => {
    for (let i = 0; i <= 50; i++) {
      const v = band(i / 50, 0.1, 0.3, 0.6, 0.9);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe("damp", () => {
  it("moves toward the target without overshooting", () => {
    const next = damp(0, 100, 4, 1 / 60);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(100);
  });

  it("converges", () => {
    let v = 0;
    for (let i = 0; i < 300; i++) v = damp(v, 100, 4, 1 / 60);
    expect(v).toBeCloseTo(100, 3);
  });

  it("is frame-rate independent", () => {
    // Two half-steps must land where one full step does.
    const oneStep = damp(0, 100, 4, 1 / 30);
    const twoSteps = damp(damp(0, 100, 4, 1 / 60), 100, 4, 1 / 60);
    expect(twoSteps).toBeCloseTo(oneStep, 10);
  });

  it("stays put when already at the target", () => {
    expect(damp(50, 50, 4, 1 / 60)).toBe(50);
  });
});
