import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";

export type Placement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface PopoverProps {
  /** The control that opens the panel. Must accept a ref and props. */
  trigger: ReactElement;
  children?: ReactNode;
  placement?: Placement;
  /** Gap between trigger and panel, in px. Default 8. */
  offset?: number;
  /** `menu` adds menu semantics and arrow-key navigation. */
  role?: "dialog" | "menu";
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A floating panel anchored to its trigger.
 *
 * Uses the native Popover API, which supplies top-layer painting, light
 * dismiss (outside click) and Escape. `aria-expanded` is synced from the
 * `toggle` event rather than local state, because light dismiss can close the
 * panel without going through our handler.
 *
 * Positioning is deliberately minimal: place, flip vertically on overflow,
 * clamp horizontally. Anything more elaborate needs a real positioning engine.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { trigger, children, placement = "bottom-start", offset = 8, role = "dialog", className, onOpenChange },
  forwardedRef,
) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const ref = useMergedRef<HTMLDivElement>(panelRef, forwardedRef);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const id = useId();

  const position = useCallback(() => {
    const panel = panelRef.current;
    const anchor = triggerRef.current;
    if (!panel || !anchor) return;

    const a = anchor.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const [side, align] = placement.split("-") as ["bottom" | "top", "start" | "end"];

    let top = side === "bottom" ? a.bottom + offset : a.top - p.height - offset;
    // Flip if it would overflow the viewport.
    if (side === "bottom" && top + p.height > window.innerHeight) top = a.top - p.height - offset;
    if (side === "top" && top < 0) top = a.bottom + offset;

    let left = align === "start" ? a.left : a.right - p.width;
    left = Math.max(8, Math.min(left, window.innerWidth - p.width - 8));

    panel.style.top = `${Math.max(8, top)}px`;
    panel.style.left = `${left}px`;
  }, [placement, offset]);

  // The toggle event is the single source of truth for open state.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const onToggle = (e: Event) => {
      const next = (e as ToggleEvent).newState === "open";
      setOpen(next);
      onOpenChange?.(next);
      if (next) {
        position();
        // Focus the first item so keyboard users land inside.
        requestAnimationFrame(() => {
          panel.querySelector<HTMLElement>('[role="menuitem"], button, a, input')?.focus();
        });
      }
    };
    panel.addEventListener("toggle", onToggle);
    return () => panel.removeEventListener("toggle", onToggle);
  }, [position, onOpenChange]);

  // Keep it anchored while open.
  useEffect(() => {
    if (!open) return;
    const onMove = () => position();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open, position]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (role !== "menu") return;
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
    if (items.length === 0) return;
    const i = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        ref: triggerRef,
        popoverTarget: id,
        "aria-expanded": open,
        "aria-haspopup": role === "menu" ? "menu" : "dialog",
        "aria-controls": id,
      })
    : trigger;

  return (
    <>
      {triggerEl}
      <div
        ref={ref}
        id={id}
        // React 19 passes these through to the DOM.
        popover="auto"
        role={role === "menu" ? "menu" : undefined}
        data-state={open ? "open" : "closed"}
        onKeyDown={onKeyDown}
        className={cn("lumen-popover glass fixed rounded-2xl p-3", className)}
      >
        {children}
      </div>
    </>
  );
});

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** One row inside a `Popover role="menu"`. */
export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { active = false, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      className={cn(
        "w-full cursor-pointer rounded-lg px-4 py-2 text-left text-xs tracking-[0.25em] uppercase outline-none",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[-2px]",
        active ? "text-cyan" : "text-muted hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
