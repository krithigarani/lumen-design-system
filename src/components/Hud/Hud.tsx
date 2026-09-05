import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface HudLayerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * A full-viewport overlay that lets clicks fall through to whatever is behind
 * it — a 3D canvas, a game board — while its own controls stay interactive.
 *
 * Interactive descendants opt back in individually, so wrapping content in
 * this layer never accidentally swallows a drag or an orbit gesture.
 */
export const HudLayer = forwardRef<HTMLDivElement, HudLayerProps>(function HudLayer(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none fixed inset-0 z-40",
        "[&_a]:pointer-events-auto [&_button]:pointer-events-auto",
        "[&_input]:pointer-events-auto [&_select]:pointer-events-auto",
        "[&_textarea]:pointer-events-auto [&_form]:pointer-events-auto",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export interface AppBarProps extends HTMLAttributes<HTMLElement> {
  /** Wordmark or logo, pinned left. */
  brand?: ReactNode;
  /** Controls, pinned right. */
  actions?: ReactNode;
  /** Stick to the bottom edge instead of the top. */
  position?: "top" | "bottom";
  children?: ReactNode;
}

/** The chrome row inside a {@link HudLayer} — brand on one side, controls on the other. */
export const AppBar = forwardRef<HTMLElement, AppBarProps>(function AppBar(
  { brand, actions, position = "top", className, children, ...props },
  ref,
) {
  return (
    <header
      ref={ref}
      className={cn(
        "absolute inset-x-0 flex items-center justify-between gap-6 px-6 py-5 md:px-10",
        position === "top" ? "top-0" : "bottom-0",
        className,
      )}
      {...props}
    >
      {brand && <div className="flex items-center gap-3">{brand}</div>}
      {children}
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
});

export interface BrandProps extends HTMLAttributes<HTMLSpanElement> {
  /** Small glyph before the wordmark. */
  glyph?: ReactNode;
  children?: ReactNode;
}

/** A wordmark in the house treatment: a gold glyph and widely-tracked caps. */
export const Brand = forwardRef<HTMLSpanElement, BrandProps>(function Brand(
  { glyph = "✦", className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        "flex items-center gap-2.5 font-body text-[0.82rem] tracking-[0.34em] text-ink uppercase",
        className,
      )}
      {...props}
    >
      {glyph && (
        <span aria-hidden className="text-gold">
          {glyph}
        </span>
      )}
      {children}
    </span>
  );
});
