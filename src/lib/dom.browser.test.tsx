import { describe, it, expect, vi } from "vitest";
import { useRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { useMergedRef } from "./dom";

describe("useMergedRef", () => {
  it("populates every ref it is given", () => {
    const calls: (HTMLDivElement | null)[] = [];
    function Subject() {
      const local = useRef<HTMLDivElement | null>(null);
      const merged = useMergedRef<HTMLDivElement>(local, (n) => {
        calls.push(n);
      });
      return (
        <div ref={merged} data-testid="s" data-has-local={String(!!local.current)}>
          x
        </div>
      );
    }
    render(<Subject />);
    expect(calls.filter(Boolean)).toHaveLength(1);
    expect(calls[calls.length - 1]).toBe(screen.getByTestId("s"));
  });

  it("stays attached across re-renders", () => {
    // A ref that detaches every render leaves `.current` transiently null,
    // which is what made an earlier Modal cleanup skip its work.
    const callback = vi.fn();
    function Subject() {
      const [, setTick] = useState(0);
      const local = useRef<HTMLDivElement | null>(null);
      const merged = useMergedRef<HTMLDivElement>(local, callback);
      return (
        <button ref={merged as never} data-testid="s" onClick={() => setTick((t) => t + 1)}>
          rerender
        </button>
      );
    }
    render(<Subject />);
    const initial = callback.mock.calls.length;
    return userEvent.click(screen.getByTestId("s")).then(() => {
      // No detach/re-attach churn: the callback identity was stable.
      expect(callback.mock.calls.length).toBe(initial);
    });
  });
});
