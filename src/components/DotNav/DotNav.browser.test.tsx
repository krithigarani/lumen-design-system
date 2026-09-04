import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { DotNav } from "./DotNav";

const items = [
  { id: "a", label: "Mercury" },
  { id: "b", label: "Venus" },
  { id: "c", label: "Mars" },
];

describe("DotNav", () => {
  it("marks exactly one dot as current", () => {
    render(<DotNav items={items} activeId="b" onSelect={() => {}} />);
    const current = screen.getAllByRole("button").filter(
      (b) => b.getAttribute("aria-current") === "true",
    );
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName("Venus");
  });

  it("names every dot", () => {
    render(<DotNav items={items} activeId="a" onSelect={() => {}} />);
    for (const item of items) {
      expect(screen.getByRole("button", { name: item.label })).toBeTruthy();
    }
  });

  it("labels the navigation landmark", () => {
    render(<DotNav items={items} activeId="a" onSelect={() => {}} navLabel="Journey" />);
    expect(screen.getByRole("navigation", { name: "Journey" })).toBeTruthy();
  });

  it("reports the selected id", async () => {
    const onSelect = vi.fn();
    render(<DotNav items={items} activeId="a" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Mars" }));
    expect(onSelect).toHaveBeenCalledWith("c");
  });

  it("is reachable by keyboard", async () => {
    const onSelect = vi.fn();
    render(<DotNav items={items} activeId="a" onSelect={onSelect} />);
    screen.getByRole("button", { name: "Venus" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("b");
  });

  it("does not announce the decorative label twice", () => {
    render(<DotNav items={items} activeId="a" onSelect={() => {}} />);
    const button = screen.getByRole("button", { name: "Mercury" });
    // The visible text is aria-hidden; the accessible name comes from aria-label.
    expect(button.querySelector("[aria-hidden='true']")?.textContent).toBe("Mercury");
  });
});
