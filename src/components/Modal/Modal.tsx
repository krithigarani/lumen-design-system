import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";
import { lockScroll, unlockScroll } from "../../lib/scroll-lock";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Accent used for the top hairline and the portal iris. */
  accent?: string;
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean;
  /** Decorative expanding radial behind the panel. Default true. */
  iris?: boolean;
  /** Focused once the dialog opens. */
  initialFocus?: RefObject<HTMLElement | null>;
  className?: string;
  /** Escape hatches when you render your own heading. */
  labelledBy?: string;
  describedBy?: string;
}

const DURATION = 280;

/**
 * A modal dialog built on the native `<dialog>` element.
 *
 * `showModal()` provides the focus trap, Escape handling, background inertness
 * and top-layer painting for free — the last of which matters here because
 * `.glass` uses `backdrop-filter` and therefore forms a containing block that
 * would otherwise clip a hand-rolled overlay.
 *
 * The element is always mounted but never server-rendered with `open`, since
 * an `open` attribute produces a *non-modal* dialog with none of the above.
 */
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    title,
    description,
    children,
    accent = "#7dd3fc",
    closeOnBackdrop = true,
    iris = true,
    initialFocus,
    className,
    labelledBy,
    describedBy,
  },
  forwardedRef,
) {
  const localRef = useRef<HTMLDialogElement | null>(null);
  const ref = useMergedRef<HTMLDialogElement>(localRef, forwardedRef);
  const restoreTo = useRef<HTMLElement | null>(null);
  const pointerDownOutside = useRef(false);

  const titleId = useId();
  const descId = useId();

  const runClose = useCallback(() => {
    const el = localRef.current;
    if (!el || !el.open) return;
    el.dataset.state = "closed";
    const finish = () => {
      if (el.open) el.close();
    };
    // transitionend is the happy path; the timeout covers interrupted transitions.
    const timer = setTimeout(finish, DURATION + 80);
    el.addEventListener(
      "transitionend",
      () => {
        clearTimeout(timer);
        finish();
      },
      { once: true },
    );
  }, []);

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    if (open) {
      if (!el.open) {
        restoreTo.current = (document.activeElement as HTMLElement) ?? null;
        el.showModal();
        lockScroll();
        // A frame later so the transition has a starting state.
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
    const el = localRef.current;
    if (!el) return;

    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    const onCloseEvent = () => {
      unlockScroll();
      restoreTo.current?.focus?.();
      restoreTo.current = null;
    };

    el.addEventListener("cancel", onCancel);
    el.addEventListener("close", onCloseEvent);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("close", onCloseEvent);
    };
  }, [onClose]);

  // Release the lock if we unmount while open.
  useEffect(() => {
    return () => {
      if (localRef.current?.open) unlockScroll();
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
    pointerDownOutside.current = isOutside(e, localRef.current);
  };

  const onClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!closeOnBackdrop) return;
    // Both press and release must be outside, so a drag started inside the
    // panel and released on the backdrop doesn't close it.
    if (pointerDownOutside.current && isOutside(e, localRef.current)) onClose();
    pointerDownOutside.current = false;
  };

  return (
    <dialog
      ref={ref}
      data-state="closed"
      aria-labelledby={labelledBy ?? (title ? titleId : undefined)}
      aria-describedby={describedBy ?? (description ? descId : undefined)}
      className={cn("lumen-dialog", className)}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      {iris && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
          style={{ background: `radial-gradient(circle, ${accent}55, transparent 65%)` }}
        />
      )}
      <div className="glass relative w-full rounded-3xl p-8 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-px right-8 left-8 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
        {title && (
          <h2 id={titleId} className="font-display text-2xl text-ink">
            {title}
          </h2>
        )}
        {description && (
          <p id={descId} className="mt-3 text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
        {children}
      </div>
    </dialog>
  );
});

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
