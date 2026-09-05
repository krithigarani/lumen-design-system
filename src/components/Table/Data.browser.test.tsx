import { describe, it, expect } from "vitest";
import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "./Table";
import { Drawer } from "../Drawer/Drawer";
import { scrollLockDepth } from "../../lib/scroll-lock";

function Fleet(props: Partial<React.ComponentProps<typeof Table>> = {}) {
  return (
    <Table caption="Fleet status" {...props}>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Vessel</TableHeaderCell>
          <TableHeaderCell>Crew</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Aurora</TableCell>
          <TableCell numeric>4</TableCell>
        </TableRow>
        <TableRow selected>
          <TableCell>Kestrel</TableCell>
          <TableCell numeric>2</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("renders real table semantics", () => {
    render(<Fleet />);
    expect(screen.getByRole("table", { name: "Fleet status" })).toBeTruthy();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("marks headers as column scope so cells are associated", () => {
    render(<Fleet />);
    for (const th of screen.getAllByRole("columnheader")) {
      expect(th).toHaveAttribute("scope", "col");
    }
  });

  it("keeps a hidden caption available to screen readers", () => {
    render(<Fleet hideCaption />);
    // Still the accessible name, even though it is visually hidden.
    expect(screen.getByRole("table", { name: "Fleet status" })).toBeTruthy();
  });

  it("scrolls in its own container rather than pushing the page sideways", () => {
    render(<Fleet />);
    const wrapper = screen.getByRole("table").parentElement!;
    expect(getComputedStyle(wrapper).overflow).toContain("auto");
  });

  it("lets the keyboard reach that scroll container", () => {
    // A scroll box with no focusable content is unreachable otherwise.
    render(<Fleet />);
    const wrapper = screen.getByRole("table").parentElement as HTMLElement;
    expect(wrapper.tabIndex).toBe(0);
    wrapper.focus();
    expect(document.activeElement).toBe(wrapper);
  });

  it("exposes a selected row", () => {
    render(<Fleet />);
    const selected = screen.getAllByRole("row").filter(
      (r) => r.getAttribute("aria-selected") === "true",
    );
    expect(selected).toHaveLength(1);
  });

  it("announces a sorted column", () => {
    render(
      <Table caption="Sorted">
        <TableHead>
          <TableRow>
            <TableHeaderCell sort="ascending">Vessel</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Aurora</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "ascending");
  });

  it("tightens cell padding when dense", () => {
    const { rerender } = render(<Fleet />);
    const roomy = getComputedStyle(screen.getAllByRole("cell")[0]).paddingTop;
    rerender(<Fleet dense />);
    const tight = getComputedStyle(screen.getAllByRole("cell")[0]).paddingTop;
    expect(parseFloat(tight)).toBeLessThan(parseFloat(roomy));
  });
});

function DrawerHarness(props: Partial<React.ComponentProps<typeof Drawer>> = {}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button data-testid="trigger" onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Flight plan" {...props}>
        <button data-testid="inside">Inside</button>
      </Drawer>
    </>
  );
}

const dialog = () => document.querySelector("dialog") as HTMLDialogElement;

describe("Drawer", () => {
  it("renders closed, and never with the open attribute", () => {
    render(<DrawerHarness />);
    expect(dialog().open).toBe(false);
    expect(dialog().hasAttribute("open")).toBe(false);
  });

  it("opens as a modal with focus inside and the page locked", async () => {
    render(<DrawerHarness />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(dialog().open).toBe(true));
    await waitFor(() => expect(dialog().contains(document.activeElement)).toBe(true));
    expect(document.documentElement.style.overflow).toBe("hidden");
  });

  it("closes on Escape, restores focus and releases the lock", async () => {
    // Shared with Modal via useNativeDialog, so this guards the extraction.
    render(<DrawerHarness />);
    const trigger = screen.getByTestId("trigger");
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog().open).toBe(true));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog().open).toBe(false));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(scrollLockDepth()).toBe(0);
    expect(document.documentElement.style.overflow).not.toBe("hidden");
  });

  it("carries the side it slides from", async () => {
    render(<DrawerHarness side="left" />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(dialog().open).toBe(true));
    expect(dialog().dataset.side).toBe("left");
  });

  it("takes its accessible name from the title", async () => {
    render(<DrawerHarness />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(dialog().open).toBe(true));
    const id = dialog().getAttribute("aria-labelledby");
    expect(document.getElementById(id!)?.textContent).toBe("Flight plan");
  });

  it("renders a footer slot outside the scrolling body", async () => {
    render(<DrawerHarness footer={<button data-testid="commit">Commit</button>} />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(dialog().open).toBe(true));
    expect(screen.getByTestId("commit").closest("footer")).toBeTruthy();
  });

  it("releases the lock if unmounted while open", async () => {
    function Unmountable() {
      const [mounted, setMounted] = useState(true);
      return (
        <>
          <button data-testid="unmount" onClick={() => setMounted(false)}>
            Unmount
          </button>
          {mounted && (
            <Drawer open onClose={() => {}} title="Leaky">
              <button>Inside</button>
            </Drawer>
          )}
        </>
      );
    }
    const { unmount } = render(<Unmountable />);
    await waitFor(() => expect(document.documentElement.style.overflow).toBe("hidden"));
    unmount();
    await waitFor(() => expect(scrollLockDepth()).toBe(0));
  });
});
