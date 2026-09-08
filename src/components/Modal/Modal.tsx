import { forwardRef, useId, type ReactNode, type RefObject } from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";
import { useNativeDialog } from "../../hooks/useNativeDialog";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Accent used for the top hairline and the portal iris. */
  /** Any CSS colour. Defaults to the interactive accent token. */
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

/**
 * A modal dialog built on the native `<dialog>` element.
 *
 * The top layer matters here beyond the usual reasons: `.glass` uses
 * `backdrop-filter`, which makes every glass panel a containing block for
 * fixed descendants, so a hand-rolled overlay nested inside a Card would be
 * clipped and mispositioned.
 *
 * The element is always mounted but never server-rendered with `open` — an
 * `open` attribute produces a *non-modal* dialog with none of the above.
 */
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    title,
    description,
    children,
    accent = "var(--color-cyan)",
    closeOnBackdrop = true,
    iris = true,
    initialFocus,
    className,
    labelledBy,
    describedBy,
  },
  forwardedRef,
) {
  const { ref: dialogRef, dialogProps } = useNativeDialog({
    open,
    onClose,
    initialFocus,
    closeOnBackdrop,
  });
  const ref = useMergedRef<HTMLDialogElement>(dialogRef, forwardedRef);

  const titleId = useId();
  const descId = useId();

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy ?? (title ? titleId : undefined)}
      aria-describedby={describedBy ?? (description ? descId : undefined)}
      className={cn("lumen-dialog", className)}
      {...dialogProps}
    >
      {iris && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25"
          // color-mix rather than appending an alpha suffix: the accent may be a
          // var(), and "var(--x)55" is not a colour.
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, ${accent} 33%, transparent), transparent 65%)`,
          }}
        />
      )}
      {/* A size-query container, so panel content can respond to the dialog's
          width rather than the viewport's. */}
      <div
        className="glass relative w-full rounded-3xl p-8 md:p-10"
        style={{ containerType: "inline-size" }}
      >
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
