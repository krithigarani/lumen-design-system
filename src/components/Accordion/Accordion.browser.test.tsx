import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Accordion, AccordionItem } from "./Accordion";

function Basic(props: React.ComponentProps<typeof Accordion> = {}) {
  return (
    <Accordion {...props}>
      <AccordionItem value="one" title="Systems">
        Frontend systems.
      </AccordionItem>
      <AccordionItem value="two" title="Craft">
        Design engineering.
      </AccordionItem>
    </Accordion>
  );
}

const panelOf = (name: string) =>
  document.getElementById(
    screen.getByRole("button", { name }).getAttribute("aria-controls")!,
  )!;

describe("Accordion", () => {
  it("starts closed unless given a default", () => {
    render(<Basic />);
    expect(screen.getByRole("button", { name: "Systems" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("opens the defaultValue panel", () => {
    render(<Basic defaultValue="two" />);
    expect(screen.getByRole("button", { name: "Craft" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("toggles on click and reflects it in the panel", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Systems" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(panelOf("Systems").dataset.open).toBe("true");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(panelOf("Systems").dataset.open).toBe("false");
  });

  it("wires aria-controls to a real panel that is labelled back", () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Systems" });
    const panel = panelOf("Systems");
    expect(panel).toBeTruthy();
    expect(panel.getAttribute("aria-labelledby")).toBe(trigger.id);
  });

  it("keeps only one panel open by default", async () => {
    render(<Basic defaultValue="one" />);
    await userEvent.click(screen.getByRole("button", { name: "Craft" }));
    expect(screen.getByRole("button", { name: "Systems" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.getByRole("button", { name: "Craft" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("allows several open when asked", async () => {
    render(<Basic allowMultiple defaultValue="one" />);
    await userEvent.click(screen.getByRole("button", { name: "Craft" }));
    expect(screen.getByRole("button", { name: "Systems" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("button", { name: "Craft" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("animates open without measuring heights in JS", async () => {
    render(<Basic />);
    const panel = panelOf("Systems");
    expect(getComputedStyle(panel).gridTemplateRows).toBe("0px");
    await userEvent.click(screen.getByRole("button", { name: "Systems" }));
    await new Promise((r) => setTimeout(r, 600));
    expect(parseFloat(getComputedStyle(panel).gridTemplateRows)).toBeGreaterThan(0);
  });
});
