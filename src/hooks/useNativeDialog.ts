import { useCallback, useEffect, useRef, type RefObject } from "react";
import { lockScroll, unlockScroll } from "../lib/scroll-lock";

export interface UseNativeDialogOptions {
  open: boolean;
  onClose: () => void;
  /** Focused once the dialog opens. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Exit transition length in ms, used as the fallback close timer. */
  duration?: number;
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean;
}

export interface NativeDialogBinding {
  ref: RefObject<HTMLDialogElement | null>;
  /** Spread onto the `<dialog>`. */
  dialogProps: {
    "data-state": "closed";
    onPointerDown: (e: React.PointerEvent<HTMLDialogElement>) => void;
    onClick: (e: React.MouseEvent<HTMLDialogElement>) => void;
  };
}

/**
 * Drives a native `<dialog>` as a modal.
 *
 * `showModal()` supplies the focus trap, Escape handling, background inertness
 * and top-layer painting; this hook adds the parts it doesn't: a scroll lock,
 * focus restore, and an exit transition that gets to finish before `close()`.
 *
 * Two details are load-bearing and were both bugs first:
 *
 * - The lock is tracked per instance in a ref, not inferred from the dialog's
 *   `open` state. The element ref can already be detached when the unmount
 *   cleanup runs, which leaked the lock and drifted the shared ref-count until
 *   later dialogs stopped locking at all.
 * - The cancel/close listeners attach once, with `onClose` held in a ref.
 *   Keying that effect on `onClose` — a fresh function on most renders — tore
 *   them down and re-attached them constantly, and an Escape landing in that
 *   window closed the dialog natively without running our handler.
 */
export function useNativeDialog({
  open,
  onClose,
  initialFocus,
  duration = 280,
  closeOnBackdrop = true,
}: UseNativeDialogOptions): NativeDialogBinding {
  const ref = useRef<HTMLDialogElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const locked = useRef(false);
  const pointerDownOutside = useRef(false);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const releaseLock = useCallback(() => {
    if (!locked.current) return;
    locked.current = false;
    unlockScroll();
  }, []);

  const runClose = useCallback(() => {
    const el = ref.current;
    if (!el || !el.open) return;
    el.dataset.state = "closed";

    const finish = () => {
      if (el.open) el.close();
      releaseLock();
    };
    // transitionend is the happy path; the timer covers an interrupted one.
    const timer = setTimeout(finish, duration + 80);
    el.addEventListener(
      "transitionend",
      () => {
        clearTimeout(timer);
        finish();
      },
      { once: true },
    );
  }, [releaseLock, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open) {
      if (!el.open) {
        restoreTo.current = (document.activeElement as HTMLElement) ?? null;
        el.showModal();
        lockScroll();
        locked.current = true;
        // A frame later, so the transition has a starting state to move from.
        requestAnimationFrame(() => {
          el.dataset.state = "open";
          initialFocus?.current?.focus();
        });
      }
    } else if (el.open) {
      runClose();
    }
  }, [open, runClose, initialFocus]);

  // Escape fires `cancel`; intercept it so the exit transition can play.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onCancel = (e: Event) => {
      e.preventDefault();
      onCloseRef.current();
    };
    const onCloseEvent = () => {
      releaseLock();
      restoreTo.current?.focus?.();
      restoreTo.current = null;
    };

    el.addEventListener("cancel", onCancel);
    el.addEventListener("close", onCloseEvent);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("close", onCloseEvent);
    };
  }, [releaseLock]);

  // Release the lock if we unmount while still open.
  useEffect(() => () => releaseLock(), [releaseLock]);

  const onPointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
    pointerDownOutside.current = isOutside(e, ref.current);
  };

  const onClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdrop) return;
    // Both press and release must land outside, so a drag that starts inside
    // the panel and finishes on the backdrop doesn't close it.
    if (pointerDownOutside.current && isOutside(e, ref.current)) onCloseRef.current();
    pointerDownOutside.current = false;
  };

  return {
    ref,
    dialogProps: { "data-state": "closed", onPointerDown, onClick },
  };
}

/** True when the pointer landed outside the dialog's box. */
function isOutside(
  e: { clientX: number; clientY: number },
  el: HTMLDialogElement | null,
): boolean {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  // A click on the ::backdrop reports coordinates outside the dialog rect.
  return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
}
