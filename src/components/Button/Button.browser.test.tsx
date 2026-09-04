import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Button } from "./Button";

describe("Button", () => {
  it("defaults to a real button with an explicit type", () => {
    // Without type="button" a button inside a form submits it.
    render(<Button>Engage</Button>);
    const el = screen.getByRole("button", { name: "Engage" });
    expect(el.tagName).toBe("BUTTON");
    expect(el).toHaveAttribute("type", "button");
  });

  it("renders as a link when asked, without a stray type attribute", () => {
    // Both projects hand-rolled an anchor styled as a button before this existed.
    render(
      <Button as="a" href="/resume">
        Resume
      </Button>,
    );
    const el = screen.getByRole("link", { name: "Resume" });
    expect(el.tagName).toBe("A");
    expect(el).toHaveAttribute("href", "/resume");
    expect(el.hasAttribute("type")).toBe(false);
  });

  it("fires clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Go" }), { force: true });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps the sweep fill decorative", () => {
    render(
      <Button variant="sweep" data-testid="b">
        Enter orbit
      </Button>,
    );
    const fill = screen.getByTestId("b").querySelector("[aria-hidden='true']");
    expect(fill).toBeTruthy();
    expect(screen.getByRole("button")).toHaveAccessibleName("Enter orbit");
  });

  it("lets a caller override the built-in classes", () => {
    render(
      <Button className="rounded-none" data-testid="b">
        Go
      </Button>,
    );
    const cls = screen.getByTestId("b").className;
    expect(cls).toContain("rounded-none");
    expect(cls).not.toContain("rounded-full");
  });

  it("is reachable and operable by keyboard", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalled();
  });
});
