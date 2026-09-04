import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Carousel } from "./Carousel";

const slides = Array.from({ length: 5 }, (_, i) => <div key={i}>Slide {i + 1}</div>);

const scroller = () => document.querySelector(".lumen-carousel") as HTMLElement;

describe("Carousel", () => {
  it("announces itself as a carousel with named slides", () => {
    render(<Carousel label="Portraits">{slides}</Carousel>);
    expect(screen.getByRole("group", { name: "Portraits" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "1 of 5" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "5 of 5" })).toBeTruthy();
  });

  it("is a real scroll container, which is what gives it touch and keyboard support", () => {
    render(<Carousel>{slides}</Carousel>);
    const el = scroller();
    const cs = getComputedStyle(el);
    expect(cs.overflowX).toBe("auto");
    expect(cs.scrollSnapType).toContain("x");
    expect(el.tabIndex).toBe(0);
    expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);
  });

  it("marks the centred slide active", async () => {
    render(<Carousel>{slides}</Carousel>);
    await waitFor(() =>
      expect(screen.getByRole("group", { name: "1 of 5" })).toHaveAttribute(
        "data-active",
        "true",
      ),
    );
  });

  it("advances with the next control", async () => {
    render(<Carousel>{slides}</Carousel>);
    const before = scroller().scrollLeft;
    await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
    await waitFor(() => expect(scroller().scrollLeft).toBeGreaterThan(before));
    await waitFor(() =>
      expect(screen.getByRole("group", { name: "2 of 5" })).toHaveAttribute(
        "data-active",
        "true",
      ),
    );
  });

  it("moves the active slide when a dot is chosen", async () => {
    render(<Carousel label="Gallery">{slides}</Carousel>);
    await userEvent.click(screen.getByRole("button", { name: "Slide 4" }));
    await waitFor(() =>
      expect(screen.getByRole("group", { name: "4 of 5" })).toHaveAttribute(
        "data-active",
        "true",
      ),
    );
  });

  it("scrolls with the arrow keys", async () => {
    // A transform-offset track would need this hand-wired; a scroll container
    // gets it from the platform.
    render(<Carousel>{slides}</Carousel>);
    const el = scroller();
    el.focus();
    const before = el.scrollLeft;
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    await waitFor(() => expect(el.scrollLeft).toBeGreaterThan(before));
  });

  it("brings a focused off-screen slide into view", async () => {
    // The failure mode of a transform track: focus lands somewhere invisible.
    render(
      <Carousel>
        {slides.map((_, i) => (
          <button key={i} data-testid={`s${i}`}>
            Slide {i + 1}
          </button>
        ))}
      </Carousel>,
    );
    const last = screen.getByTestId("s4");
    last.focus();
    await waitFor(() => {
      const slideRect = last.getBoundingClientRect();
      const boxRect = scroller().getBoundingClientRect();
      expect(slideRect.right).toBeLessThanOrEqual(boxRect.right + 1);
      expect(slideRect.left).toBeGreaterThanOrEqual(boxRect.left - 1);
    });
  });

  it("offers a pause control whenever it auto-advances", () => {
    // WCAG 2.2.2 — moving content needs a way to stop it.
    render(<Carousel autoplay={3000}>{slides}</Carousel>);
    expect(screen.getByRole("button", { name: /pause autoplay/i })).toBeTruthy();
  });

  it("has no pause control when it does not move on its own", () => {
    render(<Carousel>{slides}</Carousel>);
    expect(screen.queryByRole("button", { name: /pause autoplay/i })).toBeNull();
  });
});
