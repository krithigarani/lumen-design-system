import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ScrollProgress } from "./ScrollProgress";

function Tall() {
  return <div style={{ height: "400vh" }} aria-hidden />;
}

describe("ScrollProgress", () => {
  it("exposes progressbar semantics", () => {
    render(<ScrollProgress label="Journey" showReadout />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAccessibleName("Journey");
  });

  it("falls back to a generic accessible name", () => {
    render(<ScrollProgress />);
    expect(screen.getByRole("progressbar")).toHaveAccessibleName("Scroll progress");
  });

  it("reports progress as the page scrolls", async () => {
    render(
      <>
        <ScrollProgress label="Journey" showReadout />
        <Tall />
      </>,
    );
    const bar = screen.getByRole("progressbar");
    expect(Number(bar.getAttribute("aria-valuenow"))).toBe(0);

    window.scrollTo(0, document.documentElement.scrollHeight);
    await waitFor(() => {
      expect(Number(bar.getAttribute("aria-valuenow"))).toBeGreaterThan(50);
    });
  });

  it("publishes scroll position as a custom property on <html>", async () => {
    render(
      <>
        <ScrollProgress />
        <Tall />
      </>,
    );
    window.scrollTo(0, document.documentElement.scrollHeight);
    await waitFor(() => {
      const v = document.documentElement.style.getPropertyValue("--lumen-scroll");
      expect(Number(v)).toBeGreaterThan(0.5);
    });
  });

  it("keeps the numeric readout out of the accessibility tree", async () => {
    render(
      <>
        <ScrollProgress label="Journey" showReadout />
        <Tall />
      </>,
    );
    // The bar already announces a value; the text would double it up.
    const readout = screen.getByRole("progressbar").querySelector("[aria-hidden='true']");
    expect(readout?.textContent).toContain("%");
  });
});
