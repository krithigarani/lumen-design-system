import { forwardRef, useId, type CSSProperties, type ReactNode, type RefObject } from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";
import { useNativeDialog } from "../../hooks/useNativeDialog";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  /** Width for left/right, height for top/bottom. Any CSS length. */
  size?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Pinned below the scrolling body — actions, a submit button. */
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  initialFocus?: RefObject<HTMLElement | null>;
  className?: string;
  labelledBy?: string;
  describedBy?: string;
}

const horizontal = (side: DrawerSide) => side === "left" || side === "right";

/**
 * A panel that slides in from an edge.
 *
 * Shares `Modal`'s machinery — the same native `<dialog>`, focus trap, scroll
 * lock and exit transition — so the behaviour and the fixes stay in one place.
 *
 * The body scrolls independently of the page, which is why the header and
 * footer are separate slots rather than just children.
 */
export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(function Drawer(
  {
    open,
    onClose,
    side = "right",
    size = "24rem",
    title,
    description,
    children,
    footer,
    closeOnBackdrop = true,
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
      data-side={side}
      aria-labelledby={labelledBy ?? (title ? titleId : undefined)}
      aria-describedby={describedBy ?? (description ? descId : undefined)}
      className={cn("lumen-drawer", className)}
      style={
        horizontal(side)
          ? ({ width: `min(${size}, 100vw)` } as CSSProperties)
          : ({ height: `min(${size}, 100dvh)` } as CSSProperties)
      }
      {...dialogProps}
    >
      <div
        className={cn(
          "glass flex h-full w-full flex-col",
          // Round only the edges that face into the page.
          side === "right" && "rounded-l-3xl border-r-0",
          side === "left" && "rounded-r-3xl border-l-0",
          side === "top" && "rounded-b-3xl border-t-0",
          side === "bottom" && "rounded-t-3xl border-b-0",
        )}
      >
        {(title || description) && (
          <header className="shrink-0 border-b border-white/8 p-6">
            {title && (
              <h2 id={titleId} className="font-display text-xl text-ink">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="mt-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            )}
          </header>
        )}

        {/* Scrolls on its own; the page behind it is locked. Also a size-query
            container, so a form inside can respond to the drawer's width. */}
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6"
          style={{ containerType: "inline-size" }}
        >
          {children}
        </div>

        {footer && (
          <footer className="shrink-0 border-t border-white/8 p-6">{footer}</footer>
        )}
      </div>
    </dialog>
  );
});
