import { describe, it, expect, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Alert } from "./Alert";
import { Tooltip } from "../Tooltip/Tooltip";
import { Progress } from "../Progress/Progress";
import { Skeleton } from "../Skeleton/Skeleton";
import { Toaster } from "../Toast/Toast";
import { toast, clearToasts } from "../../lib/toast-store";
import { Button } from "../Button/Button";

describe("Alert", () => {
  it("announces politely for non-urgent statuses", () => {
    render(<Alert status="success" title="Docked">Seals holding.</Alert>);
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-live", "polite");
  });

  it("announces assertively for warnings and errors", () => {
    // An error that waits its turn behind other announcements is a bad error.
    for (const status of ["warning", "danger"] as const) {
      const { unmount } = render(<Alert status={status}>Problem.</Alert>);
      const el = screen.getByRole("alert");
      expect(el).toHaveAttribute("aria-live", "assertive");
      unmount();
    }
  });

  it("keeps the glyph out of the accessible text", () => {
    render(<Alert status="danger" title="Signal lost">No response.</Alert>);
    const glyph = screen.getByRole("alert").querySelector("[aria-hidden='true']");
    expect(glyph).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain("Signal lost");
  });

  it("can drop the glyph entirely", () => {
    render(<Alert icon={null}>Quiet note.</Alert>);
    expect(screen.getByRole("status").querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("renders an action slot", () => {
    render(
      <Alert status="danger" action={<Button size="sm">Retry</Button>}>
        Failed.
      </Alert>,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  });
});

describe("Tooltip", () => {
  it("describes its trigger rather than naming it", () => {
    render(
      <Tooltip content="Opens the hatch">
        <Button>Hatch</Button>
      </Tooltip>,
    );
    const trigger = screen.getByRole("button", { name: "Hatch" });
    expect(trigger).toHaveAccessibleDescription("Opens the hatch");
  });

  it("wires aria-describedby to the tooltip element", () => {
    render(
      <Tooltip content="Opens the hatch">
        <Button>Hatch</Button>
      </Tooltip>,
    );
    const id = screen.getByRole("button").getAttribute("aria-describedby");
    expect(document.getElementById(id!)?.getAttribute("role")).toBe("tooltip");
  });

  it("is hidden until hovered", async () => {
    render(
      <Tooltip content="Opens the hatch">
        <Button>Hatch</Button>
      </Tooltip>,
    );
    const bubble = document.querySelector(".lumen-tooltip-bubble") as HTMLElement;
    expect(getComputedStyle(bubble).visibility).toBe("hidden");

    await userEvent.hover(screen.getByRole("button"));
    await waitFor(() => expect(getComputedStyle(bubble).visibility).toBe("visible"));
  });

  it("also appears on keyboard focus, not hover alone", async () => {
    render(
      <Tooltip content="Opens the hatch">
        <Button>Hatch</Button>
      </Tooltip>,
    );
    const bubble = document.querySelector(".lumen-tooltip-bubble") as HTMLElement;
    screen.getByRole("button").focus();
    await waitFor(() => expect(getComputedStyle(bubble).opacity).toBe("1"));
  });
});

describe("Progress", () => {
  it("reports its value", () => {
    render(<Progress value={72} label="Fuel" />);
    const bar = screen.getByRole("progressbar", { name: "Fuel" });
    expect(bar).toHaveAttribute("aria-valuenow", "72");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("scales against a custom max", () => {
    render(<Progress value={25} max={50} label="Fuel" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
  });

  it("clamps out-of-range values", () => {
    render(<Progress value={140} label="Over" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("omits a value when indeterminate", () => {
    render(<Progress label="Scanning" />);
    expect(screen.getByRole("progressbar").hasAttribute("aria-valuenow")).toBe(false);
  });
});

describe("Skeleton", () => {
  it("is hidden from assistive tech", () => {
    render(<Skeleton data-testid="s" />);
    expect(screen.getByTestId("s").getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the requested number of lines, the last one short", () => {
    render(<Skeleton lines={3} data-testid="s" />);
    const lines = screen.getByTestId("s").children;
    expect(lines).toHaveLength(3);
    expect((lines[2] as HTMLElement).style.width).toBe("62%");
  });
});

describe("Toaster", () => {
  afterEach(() => clearToasts());

  it("shows a queued toast", async () => {
    render(<Toaster />);
    toast.success({ title: "Docked", description: "Seals holding." });
    await waitFor(() => expect(screen.getByText("Docked")).toBeTruthy());
    expect(screen.getByText("Seals holding.")).toBeTruthy();
  });

  it("names the region without making it a live region itself", () => {
    // Items carry their own role, so a live region here would double-announce.
    render(<Toaster />);
    const region = screen.getByRole("region", { name: "Notifications" });
    expect(region.hasAttribute("aria-live")).toBe(false);
  });

  it("uses alert for errors and status for the rest", async () => {
    render(<Toaster />);
    toast.danger({ title: "Signal lost", duration: 0 });
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    clearToasts();
    toast.info({ title: "Relay", duration: 0 });
    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy());
  });

  it("dismisses when the close button is pressed", async () => {
    render(<Toaster />);
    toast.info({ title: "Relay", duration: 0 });
    await waitFor(() => expect(screen.getByText("Relay")).toBeTruthy());

    await userEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    await waitFor(() => expect(screen.queryByText("Relay")).toBeNull());
  });

  it("auto-dismisses after its duration", async () => {
    render(
      <>
        <button data-testid="away" className="fixed top-0 left-0">
          away
        </button>
        <Toaster />
      </>,
    );
    // Park the pointer far from the toast: hovering one pauses its countdown,
    // and the cursor stays wherever the previous test left it.
    await userEvent.hover(screen.getByTestId("away"));

    toast.info({ title: "Fleeting", duration: 150 });
    await waitFor(() => expect(screen.getByText("Fleeting")).toBeTruthy());
    await waitFor(() => expect(screen.queryByText("Fleeting")).toBeNull(), { timeout: 3000 });
  });

  it("holds a toast open while it is hovered", async () => {
    render(<Toaster />);
    // Long enough that the enter transition settles before we hover — hovering
    // a moving element times out — and that the wait below outlives it.
    toast.info({ title: "Hovered", duration: 1200 });
    await waitFor(() => expect(screen.getByText("Hovered")).toBeTruthy());

    await userEvent.hover(screen.getByText("Hovered"));
    await new Promise((r) => setTimeout(r, 1800));
    expect(screen.getByText("Hovered")).toBeTruthy();
  });

  it("keeps a zero-duration toast on screen", async () => {
    render(<Toaster />);
    toast.danger({ title: "Sticky", duration: 0 });
    await waitFor(() => expect(screen.getByText("Sticky")).toBeTruthy());
    await new Promise((r) => setTimeout(r, 600));
    expect(screen.getByText("Sticky")).toBeTruthy();
  });

  it("stacks several toasts", async () => {
    render(<Toaster />);
    toast.info({ title: "One", duration: 0 });
    toast.info({ title: "Two", duration: 0 });
    await waitFor(() => {
      expect(screen.getByText("One")).toBeTruthy();
      expect(screen.getByText("Two")).toBeTruthy();
    });
  });

  it("accepts a bare string", async () => {
    render(<Toaster />);
    toast("Quick note");
    await waitFor(() => expect(screen.getByText("Quick note")).toBeTruthy());
  });
});
