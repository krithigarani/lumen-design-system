import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Container } from "./Container";
import { Card } from "../Card/Card";

describe("Container", () => {
  it("declares inline-size containment", () => {
    render(<Container data-testid="c">content</Container>);
    expect(getComputedStyle(screen.getByTestId("c")).containerType).toBe("inline-size");
  });

  it("names the container when asked", () => {
    render(
      <Container data-testid="c" name="panel">
        content
      </Container>,
    );
    expect(getComputedStyle(screen.getByTestId("c")).containerName).toBe("panel");
  });

  it("stays block-level, since containment collapses a shrink-to-fit box", () => {
    render(<Container data-testid="c">content</Container>);
    expect(getComputedStyle(screen.getByTestId("c")).display).toBe("block");
  });

  it("measures its own width, not the viewport", async () => {
    // Two containers, one viewport. If the query were viewport-based both
    // children would match identically; only container queries can tell them
    // apart, so this holds whatever width the test frame happens to be.
    render(
      <>
        <div style={{ width: "320px" }}>
          <Container>
            <p data-testid="narrow" className="text-sm @md:text-3xl">
              narrow
            </p>
          </Container>
        </div>
        <div style={{ width: "700px" }}>
          <Container>
            <p data-testid="wide" className="text-sm @md:text-3xl">
              wide
            </p>
          </Container>
        </div>
      </>,
    );

    await waitFor(() => {
      expect(getComputedStyle(screen.getByTestId("narrow")).fontSize).toBe("14px");
      expect(getComputedStyle(screen.getByTestId("wide")).fontSize).toBe("30px");
    });
  });
});

describe("Card as a container", () => {
  it("lets its content respond to the card's width", async () => {
    render(
      <>
        <div style={{ width: "320px" }}>
          <Card data-testid="card">
            <p data-testid="narrow" className="text-sm @md:text-3xl">
              inside
            </p>
          </Card>
        </div>
        <div style={{ width: "760px" }}>
          <Card>
            <p data-testid="wide" className="text-sm @md:text-3xl">
              inside
            </p>
          </Card>
        </div>
      </>,
    );
    expect(getComputedStyle(screen.getByTestId("card")).containerType).toBe("inline-size");
    await waitFor(() => {
      expect(getComputedStyle(screen.getByTestId("narrow")).fontSize).toBe("14px");
      expect(getComputedStyle(screen.getByTestId("wide")).fontSize).toBe("30px");
    });
  });

  it("can opt out of containment", () => {
    render(
      <Card data-testid="card" container={false}>
        content
      </Card>,
    );
    expect(getComputedStyle(screen.getByTestId("card")).containerType).toBe("normal");
  });

  it("leaves a card-as-button uncontained, so it cannot collapse", () => {
    // Form controls size to fit-content even at display:block, and inline-size
    // containment makes the content contribute nothing — the button ends up as
    // wide as its own padding and nothing else.
    render(
      <div style={{ width: "600px" }}>
        <Card as="button" data-testid="card">
          A clickable tile
        </Card>
      </div>,
    );
    const el = screen.getByTestId("card");
    expect(getComputedStyle(el).containerType).toBe("normal");
    expect(el.getBoundingClientRect().width).toBeGreaterThan(100);
  });

  it("still allows containment on a card-as-button when asked for", () => {
    render(
      <div style={{ width: "600px" }}>
        <Card as="button" container data-testid="card" className="w-full">
          A clickable tile
        </Card>
      </div>,
    );
    const el = screen.getByTestId("card");
    expect(getComputedStyle(el).containerType).toBe("inline-size");
    // Given an explicit width it behaves; that is the documented requirement.
    expect(el.getBoundingClientRect().width).toBeGreaterThan(400);
  });
});
