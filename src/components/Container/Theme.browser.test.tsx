import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../Badge/Badge";
import { Card } from "../Card/Card";
import { Button } from "../Button/Button";

/** Resolve a colour to rgb so themes can be compared regardless of notation. */
const colorOf = (el: HTMLElement) => getComputedStyle(el).color;

describe("theming", () => {
  it("recolours a token-driven component", () => {
    render(
      <>
        <Badge tone="cyan" data-testid="default">
          default
        </Badge>
        <div className="lumen-theme-ember">
          <Badge tone="cyan" data-testid="ember">
            ember
          </Badge>
        </div>
      </>,
    );
    const a = colorOf(screen.getByTestId("default"));
    const b = colorOf(screen.getByTestId("ember"));
    expect(a).not.toBe(b);
  });

  it("scopes to a subtree rather than leaking upward", () => {
    render(
      <>
        <Badge tone="cyan" data-testid="outside">
          outside
        </Badge>
        <div className="lumen-theme-abyss">
          <Badge tone="cyan" data-testid="inside">
            inside
          </Badge>
        </div>
        <Badge tone="cyan" data-testid="after">
          after
        </Badge>
      </>,
    );
    expect(colorOf(screen.getByTestId("outside"))).toBe(colorOf(screen.getByTestId("after")));
    expect(colorOf(screen.getByTestId("inside"))).not.toBe(colorOf(screen.getByTestId("after")));
  });

  it("recolours the glass surface, not just text", () => {
    // .glass used to hardcode the violet rgba, so it ignored the palette.
    render(
      <>
        <Card data-testid="default">default</Card>
        <div className="lumen-theme-ember">
          <Card data-testid="ember">ember</Card>
        </div>
      </>,
    );
    const a = getComputedStyle(screen.getByTestId("default"));
    const b = getComputedStyle(screen.getByTestId("ember"));
    expect(a.borderColor).not.toBe(b.borderColor);
    expect(a.backgroundImage).not.toBe(b.backgroundImage);
  });

  it("recolours glow shadows", () => {
    render(
      <>
        <Badge tone="cyan" className="shadow-[0_0_12px_var(--color-cyan)]" data-testid="default">
          default
        </Badge>
        <div className="lumen-theme-abyss">
          <Badge tone="cyan" className="shadow-[0_0_12px_var(--color-cyan)]" data-testid="themed">
            themed
          </Badge>
        </div>
      </>,
    );
    expect(getComputedStyle(screen.getByTestId("default")).boxShadow).not.toBe(
      getComputedStyle(screen.getByTestId("themed")).boxShadow,
    );
  });

  it("keeps the void dark across every preset", () => {
    // Only the accents move; the identity does not.
    const surfaces = ["lumen-theme-ember", "lumen-theme-abyss", "lumen-theme-graphite"];
    render(
      <>
        {surfaces.map((t) => (
          <div key={t} className={t}>
            <div data-testid={t} className="bg-void">
              surface
            </div>
          </div>
        ))}
      </>,
    );
    for (const t of surfaces) {
      expect(getComputedStyle(screen.getByTestId(t)).backgroundColor).toBe("rgb(3, 3, 9)");
    }
  });

  it("still honours an explicit override on any scope", () => {
    render(
      <div style={{ ["--color-cyan" as string]: "#ff0000" }}>
        <Button data-testid="btn" tone="cyan">
          Go
        </Button>
      </div>,
    );
    // The focus ring, hover and text all resolve through the same token.
    expect(getComputedStyle(screen.getByTestId("btn")).getPropertyValue("--color-cyan").trim()).toBe(
      "#ff0000",
    );
  });
});
