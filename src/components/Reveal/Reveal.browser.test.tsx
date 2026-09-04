import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Reveal, RevealGroup } from "./Reveal";

/**
 * Spacers above *and* below, so the subject starts below the fold and can
 * still be scrolled to the middle of the viewport. Without a trailing spacer
 * the last element can only ever reach the bottom edge, which sits outside
 * the -16% activation band.
 */
function Spacer() {
  return <div style={{ height: "200vh" }} aria-hidden />;
}

const visible = (el: HTMLElement) => el.getAttribute("data-visible") === "true";

describe("Reveal", () => {
  it("starts hidden while below the fold", async () => {
    render(
      <>
        <Spacer />
        <Reveal data-testid="r">Signal</Reveal>
        <Spacer />
      </>,
    );
    const el = screen.getByTestId("r");
    // Give the observer a chance to fire before asserting the negative.
    await new Promise((r) => setTimeout(r, 150));
    expect(visible(el)).toBe(false);
    expect(getComputedStyle(el).opacity).toBe("0");
  });

  it("reveals once scrolled into view", async () => {
    // A short duration keeps the paint assertion clear of waitFor's timeout;
    // the default 950ms transition is what the token controls, not this.
    render(
      <>
        <Spacer />
        <Reveal data-testid="r" duration={0.05}>
          Signal
        </Reveal>
        <Spacer />
      </>,
    );
    const el = screen.getByTestId("r");
    el.scrollIntoView({ block: "center" });
    await waitFor(() => expect(visible(el)).toBe(true));
    await waitFor(() => expect(getComputedStyle(el).opacity).toBe("1"));
  });

  it("stays revealed after scrolling away again", async () => {
    // Cosmos re-animated on every re-entry; Lumen unobserves after the first hit.
    render(
      <>
        <Spacer />
        <Reveal data-testid="r">Signal</Reveal>
        <Spacer />
      </>,
    );
    const el = screen.getByTestId("r");
    el.scrollIntoView({ block: "center" });
    await waitFor(() => expect(visible(el)).toBe(true));

    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
    expect(visible(el)).toBe(true);
  });

  it("re-hides on exit when once is false", async () => {
    render(
      <>
        <Spacer />
        <Reveal data-testid="r" once={false}>
          Signal
        </Reveal>
        <Spacer />
      </>,
    );
    const el = screen.getByTestId("r");
    el.scrollIntoView({ block: "center" });
    await waitFor(() => expect(visible(el)).toBe(true));

    window.scrollTo(0, 0);
    await waitFor(() => expect(visible(el)).toBe(false));
  });

  it("renders visible immediately when disabled", () => {
    render(
      <>
        <Spacer />
        <Reveal data-testid="r" disabled>
          Signal
        </Reveal>
      </>,
    );
    expect(visible(screen.getByTestId("r"))).toBe(true);
  });

  it("writes only the custom properties it was given", () => {
    render(
      <Reveal data-testid="r" y={80} blur={4} duration={2} disabled>
        Signal
      </Reveal>,
    );
    const el = screen.getByTestId("r");
    expect(el.style.getPropertyValue("--lumen-reveal-y")).toBe("80px");
    expect(el.style.getPropertyValue("--lumen-reveal-blur")).toBe("4px");
    expect(el.style.getPropertyValue("--lumen-reveal-duration")).toBe("2000ms");
    expect(el.style.getPropertyValue("--lumen-reveal-x")).toBe("");
  });

  it("renders as another element when asked", () => {
    render(
      <Reveal as="section" data-testid="r" disabled>
        Signal
      </Reveal>,
    );
    expect(screen.getByTestId("r").tagName).toBe("SECTION");
  });
});

describe("RevealGroup", () => {
  const delayOf = (el: HTMLElement) => el.style.getPropertyValue("--lumen-reveal-delay");

  it("staggers its children", () => {
    render(
      <RevealGroup disabled stagger={0.1} data-testid="g">
        <p data-testid="i0">one</p>
        <p data-testid="i1">two</p>
        <p data-testid="i2">three</p>
      </RevealGroup>,
    );
    expect(delayOf(screen.getByTestId("i0").parentElement!)).toBe("0ms");
    expect(delayOf(screen.getByTestId("i1").parentElement!)).toBe("100ms");
    expect(delayOf(screen.getByTestId("i2").parentElement!)).toBe("200ms");
  });

  it("caps the stagger so long lists do not trail off", () => {
    // Without the cap a 12-item list would end on a 1.1s delay.
    render(
      <RevealGroup disabled stagger={0.1} cap={2} data-testid="g">
        {Array.from({ length: 6 }, (_, i) => (
          <p key={i} data-testid={`i${i}`}>
            {i}
          </p>
        ))}
      </RevealGroup>,
    );
    expect(delayOf(screen.getByTestId("i2").parentElement!)).toBe("200ms");
    expect(delayOf(screen.getByTestId("i5").parentElement!)).toBe("200ms");
  });

  it("reveals every child from the group's single observer", async () => {
    render(
      <>
        <Spacer />
        <RevealGroup data-testid="g">
          <p data-testid="i0">one</p>
          <p data-testid="i1">two</p>
        </RevealGroup>
        <Spacer />
      </>,
    );
    const first = screen.getByTestId("i0").parentElement!;
    const second = screen.getByTestId("i1").parentElement!;
    first.scrollIntoView({ block: "center" });
    await waitFor(() => {
      expect(visible(first)).toBe(true);
      expect(visible(second)).toBe(true);
    });
  });
});
