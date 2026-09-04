import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NebulaBackdrop } from "./NebulaBackdrop";
import { Starfield } from "./Starfield";

describe("NebulaBackdrop", () => {
  it("paints three gradient lobes", () => {
    render(<NebulaBackdrop data-testid="n" position="absolute" />);
    const bg = getComputedStyle(screen.getByTestId("n")).backgroundImage;
    expect(bg.match(/radial-gradient/g)).toHaveLength(3);
  });

  it("never uses a negative z-index", () => {
    // A negative z-index slid it behind the opaque body background and made it
    // invisible — the void colour is exactly what consumers set.
    render(<NebulaBackdrop data-testid="n" position="absolute" />);
    const z = getComputedStyle(screen.getByTestId("n")).zIndex;
    expect(z === "auto" || Number(z) >= 0).toBe(true);
  });

  it("stays out of the way of pointers and screen readers", () => {
    render(<NebulaBackdrop data-testid="n" position="absolute" />);
    const el = screen.getByTestId("n");
    expect(getComputedStyle(el).pointerEvents).toBe("none");
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("honours the position prop", () => {
    const { rerender } = render(<NebulaBackdrop data-testid="n" />);
    expect(getComputedStyle(screen.getByTestId("n")).position).toBe("fixed");
    rerender(<NebulaBackdrop data-testid="n" position="absolute" />);
    expect(getComputedStyle(screen.getByTestId("n")).position).toBe("absolute");
  });

  it("lets positioned content sit above it", () => {
    render(
      <div style={{ position: "relative", height: "200px" }}>
        <NebulaBackdrop data-testid="n" position="absolute" />
        <p data-testid="content" style={{ position: "relative", zIndex: 10 }}>
          above
        </p>
      </div>,
    );
    const nz = getComputedStyle(screen.getByTestId("n")).zIndex;
    const cz = getComputedStyle(screen.getByTestId("content")).zIndex;
    expect(Number(cz)).toBeGreaterThan(Number(nz === "auto" ? 0 : nz));
  });
});

describe("Starfield", () => {
  it("draws stars onto the canvas", async () => {
    render(<Starfield data-testid="s" position="absolute" />);
    const canvas = screen.getByTestId("s") as HTMLCanvasElement;
    await new Promise((r) => setTimeout(r, 300));

    expect(canvas.width).toBeGreaterThan(0);
    const ctx = canvas.getContext("2d")!;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let lit = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) lit++;
    expect(lit).toBeGreaterThan(0);
  });

  it("is decorative", () => {
    render(<Starfield data-testid="s" position="absolute" />);
    expect(screen.getByTestId("s").getAttribute("aria-hidden")).toBe("true");
  });
});
