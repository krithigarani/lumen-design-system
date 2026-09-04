import { describe, it, expect } from "vitest";
import { useState, useRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
// Real Playwright input — synthetic events never trigger a native <dialog>'s
// own Escape handling, which is precisely what we need to verify.
import { userEvent } from "vitest/browser";
import { Modal } from "./Modal";
import { scrollLockDepth } from "../../lib/scroll-lock";

function Harness(props: Partial<React.ComponentProps<typeof Modal>> = {}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button data-testid="trigger" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Orbital transfer"
        description="Confirm the burn."
        {...props}
      >
        <button data-testid="inside">Confirm</button>
      </Modal>
    </>
  );
}

const dialog = () => document.querySelector("dialog") as HTMLDialogElement;

describe("Modal", () => {
  it("renders closed, and never with the open attribute on first paint", () => {
    // An SSR-rendered <dialog open> is non-modal: no top layer, no focus trap.
    render(<Harness />);
    expect(dialog().open).toBe(false);
    expect(dialog().hasAttribute("open")).toBe(false);
    expect(dialog().dataset.state).toBe("closed");
  });

  it("opens as a modal dialog", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(dialog().open).toBe(true));
    await waitFor(() => expect(dialog().dataset.state).toBe("open"));
  });

  it("moves focus inside", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(dialog().contains(document.activeElement)).toBe(true));
  });

  it("honours initialFocus", async () => {
    function WithInitialFocus() {
      const [open, setOpen] = useState(false);
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button data-testid="trigger" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal open={open} onClose={() => setOpen(false)} title="T" initialFocus={ref}>
            <button data-testid="first">First</button>
            <button data-testid="target" ref={ref}>
              Target
            </button>
          </Modal>
        </>
      );
    }
    render(<WithInitialFocus />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByTestId("target")));
  });

  it("locks background scrolling while open and restores it after", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(document.documentElement.style.overflow).toBe("hidden"));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog().open).toBe(false));
    expect(document.documentElement.style.overflow).not.toBe("hidden");
    // The depth must unwind too — a drifting count stops later modals locking.
    expect(scrollLockDepth()).toBe(0);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Harness />);
    const trigger = screen.getByTestId("trigger");
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog().open).toBe(true));

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog().open).toBe(false));
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("plays the exit transition rather than snapping shut", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(dialog().open).toBe(true));

    await userEvent.keyboard("{Escape}");
    // data-state flips first; the element only closes once the transition ends.
    await waitFor(() => expect(dialog().dataset.state).toBe("closed"));
    expect(dialog().open).toBe(true);
    await waitFor(() => expect(dialog().open).toBe(false));
  });

  it("wires an accessible name and description", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(dialog().open).toBe(true));

    const labelId = dialog().getAttribute("aria-labelledby");
    const descId = dialog().getAttribute("aria-describedby");
    expect(labelId).toBeTruthy();
    expect(document.getElementById(labelId!)?.textContent).toBe("Orbital transfer");
    expect(document.getElementById(descId!)?.textContent).toBe("Confirm the burn.");
  });

  it("does not hand-write role or aria-modal, which <dialog> implies", () => {
    render(<Harness />);
    expect(dialog().hasAttribute("role")).toBe(false);
    expect(dialog().hasAttribute("aria-modal")).toBe(false);
  });

  it("releases the scroll lock when unmounted while still open", async () => {
    // A route change with the modal open must not leave the page unscrollable
    // — and must not drift the ref-count, which would stop every later modal
    // from locking at all.
    function Unmountable() {
      const [mounted, setMounted] = useState(true);
      return (
        <>
          <button data-testid="unmount" onClick={() => setMounted(false)}>
            Unmount
          </button>
          {mounted && (
            <Modal open onClose={() => {}} title="Leaky">
              <button>Inside</button>
            </Modal>
          )}
        </>
      );
    }
    const { unmount } = render(<Unmountable />);
    await waitFor(() => expect(document.documentElement.style.overflow).toBe("hidden"));

    unmount();
    await waitFor(() => expect(document.documentElement.style.overflow).not.toBe("hidden"));
    expect(scrollLockDepth()).toBe(0);

    // The next modal must still be able to lock.
    render(<Harness />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(document.documentElement.style.overflow).toBe("hidden"));
  });

  it("keeps the dialog open when closeOnBackdrop is false", async () => {
    render(<Harness closeOnBackdrop={false} />);
    await userEvent.click(screen.getByTestId("trigger"));
    await waitFor(() => expect(dialog().open).toBe(true));

    // Click the very top-left of the viewport — outside the centred panel.
    await userEvent.click(document.documentElement, { position: { x: 4, y: 4 } });
    await new Promise((r) => setTimeout(r, 250));
    expect(dialog().open).toBe(true);
  });
});
