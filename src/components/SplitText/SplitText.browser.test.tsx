import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SplitText } from "./SplitText";

describe("SplitText", () => {
  it("exposes the whole string to assistive tech, not one letter at a time", () => {
    render(
      <SplitText data-testid="t" trigger="mount">
        Signal acquired
      </SplitText>,
    );
    const el = screen.getByTestId("t");
    expect(el.getAttribute("aria-label")).toBe("Signal acquired");

    // Every visual piece must be hidden, or it is announced character by character.
    for (const word of Array.from(el.children)) {
      expect(word.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("splits into characters and numbers them for the stagger", () => {
    render(
      <SplitText data-testid="t" trigger="mount">
        ab cd
      </SplitText>,
    );
    const chars = screen.getByTestId("t").querySelectorAll(".lumen-split-char");
    expect(chars).toHaveLength(4);
    const indices = Array.from(chars, (c) =>
      Number((c as HTMLElement).style.getPropertyValue("--lumen-i")),
    );
    expect(indices).toEqual([0, 1, 2, 3]);
  });

  it("can split by word instead", () => {
    render(
      <SplitText data-testid="t" by="word" trigger="mount">
        one two three
      </SplitText>,
    );
    expect(screen.getByTestId("t").querySelectorAll(".lumen-split-char")).toHaveLength(3);
  });

  it("keeps words unbreakable so wrapping still works", () => {
    render(
      <SplitText data-testid="t" trigger="mount">
        alpha beta
      </SplitText>,
    );
    const word = screen.getByTestId("t").children[0] as HTMLElement;
    expect(getComputedStyle(word).whiteSpace).toBe("nowrap");
  });

  it("becomes visible after mounting", async () => {
    render(
      <SplitText data-testid="t" trigger="mount">
        hello
      </SplitText>,
    );
    const el = screen.getByTestId("t");
    await new Promise((r) => setTimeout(r, 100));
    expect(el.getAttribute("data-visible")).toBe("true");
  });
});
