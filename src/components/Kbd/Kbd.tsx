import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

/** A single key cap. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, children, ...props },
  ref,
) {
  return (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex min-w-[1.6rem] items-center justify-center rounded-md border border-white/12",
        "bg-white/[0.04] px-1.5 py-0.5 font-body text-[0.66rem] tracking-[0.08em] text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
});

export interface Shortcut {
  /** One or more keys, e.g. `["←", "→"]` or `["Shift", "?"]`. */
  keys: string[];
  label: string;
  /** Separator between keys. Use "+" for chords, "/" for alternatives. */
  join?: string;
}

export interface ShortcutBarProps extends HTMLAttributes<HTMLDivElement> {
  items: Shortcut[];
  /** Pin to the bottom of the viewport, as a game HUD would. */
  fixed?: boolean;
  /** Hide on narrow screens, where there is no keyboard anyway. */
  hideOnMobile?: boolean;
  label?: string;
}

/** A legend of keyboard shortcuts. */
export const ShortcutBar = forwardRef<HTMLDivElement, ShortcutBarProps>(function ShortcutBar(
  { items, fixed = false, hideOnMobile = true, label = "Keyboard shortcuts", className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-2",
        fixed && "fixed inset-x-0 bottom-0 justify-center p-4",
        hideOnMobile && "hidden md:flex",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            {item.keys.map((key, i) => (
              <span key={key} className="flex items-center gap-1">
                {i > 0 && item.join && (
                  <span aria-hidden className="text-[0.6rem] text-faint">
                    {item.join}
                  </span>
                )}
                <Kbd>{key}</Kbd>
              </span>
            ))}
          </span>
          <span className="font-body text-[0.66rem] tracking-[0.14em] text-faint uppercase">
            {item.label}
          </span>
        </span>
      ))}
    </div>
  );
});
