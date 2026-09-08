import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Popover, MenuItem } from "./Popover";
import { Button } from "../Button/Button";

const supportsAnchor = CSS.supports("anchor-name", "--probe");

function Basic(props: Partial<React.ComponentProps<typeof Popover>> = {}) {
  return (
    <div style={{ padding: "6rem" }}>
      <Popover trigger={<Button>Open</Button>} {...props}>
        <MenuItem>Mercury</MenuItem>
        <MenuItem>Venus</MenuItem>
        <MenuItem>Mars</MenuItem>
      </Popover>
    </div>
  );
}

const panel = () => document.querySelector(".lumen-popover") as HTMLElement;

describe("Popover", () => {
  it("describes the trigger's relationship to the panel", () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.getAttribute("aria-controls")).toBe(panel().id);
  });

  it("opens on click and syncs aria-expanded", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
  });

  it("closes on Escape", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  });

  it("light-dismisses on an outside click", async () => {
    // Comes free with popover="auto"; worth pinning since it is easy to lose.
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));

    await userEvent.click(document.body, { position: { x: 5, y: 5 } });
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
  });

  it("exposes menu semantics and moves with the arrow keys", async () => {
    render(<Basic role="menu" />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await waitFor(() => expect(screen.getByRole("menu")).toBeTruthy());

    const items = screen.getAllByRole("menuitem");
    await waitFor(() => expect(document.activeElement).toBe(items[0]));

    await userEvent.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(items[1]);
    await userEvent.keyboard("{End}");
    expect(document.activeElement).toBe(items[2]);
    await userEvent.keyboard("{Home}");
    expect(document.activeElement).toBe(items[0]);
  });

  it("gives the trigger and panel a matching anchor name", () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    const name = trigger.style.getPropertyValue("--lumen-anchor-name");

    expect(name).toMatch(/^--lumen-anchor-[a-zA-Z0-9]+$/);
    expect(panel().style.getPropertyValue("--lumen-anchor-name")).toBe(name);
    // A dashed-ident can't contain the colons useId emits.
    expect(name).not.toContain(":");
  });

  it("marks the trigger as the anchor", () => {
    render(<Basic />);
    expect(screen.getByRole("button", { name: "Open" }).className).toContain("lumen-anchor");
  });

  it("carries the requested placement", () => {
    render(<Basic placement="top-end" />);
    expect(panel().dataset.placement).toBe("top-end");
  });

  it("positions the panel next to its trigger", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));

    await waitFor(() => {
      const t = trigger.getBoundingClientRect();
      const p = panel().getBoundingClientRect();
      // Below the trigger, and horizontally overlapping it.
      expect(p.top).toBeGreaterThanOrEqual(t.bottom - 1);
      expect(p.left).toBeLessThan(t.right);
      expect(p.right).toBeGreaterThan(t.left);
    });
  });

  it.runIf(supportsAnchor)("lets CSS do the positioning, leaving no inline offsets", async () => {
    // The JS path writes top/left directly; with anchor positioning it must
    // stand down, or the two would fight.
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));

    expect(panel().style.top).toBe("");
    expect(panel().style.left).toBe("");
    // position-anchor isn't in lib.dom's CSSStyleDeclaration yet.
    expect(getComputedStyle(panel()).getPropertyValue("position-anchor")).toBeTruthy();
  });

  it.runIf(supportsAnchor)("aligns a -start placement with the trigger's edge", async () => {
    // A shorthand margin would inset the panel from that edge too, quietly
    // breaking the alignment the placement name promises.
    render(<Basic placement="bottom-start" />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));

    await waitFor(() => {
      const t = trigger.getBoundingClientRect();
      const p = panel().getBoundingClientRect();
      expect(Math.abs(p.left - t.left)).toBeLessThanOrEqual(1);
      expect(p.top - t.bottom).toBeGreaterThan(0);
    });
  });

  it.skipIf(supportsAnchor)("falls back to measuring in JS", async () => {
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    await waitFor(() => expect(panel().style.top).not.toBe(""));
  });
});
