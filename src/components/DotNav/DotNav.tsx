import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface DotNavItem {
  id: string;
  label: string;
}

export interface DotNavProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  items: DotNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  orientation?: "vertical" | "horizontal";
  variant?: "dots" | "pill";
  labelPlacement?: "left" | "right" | "none";
  /** Accessible name for the nav landmark. */
  navLabel?: string;
}

/**
 * A rail of dots for jumping between sections or slides.
 *
 * Purely presentational and controlled — pair it with `useScrollSpy` for
 * scroll-linked sections, or a carousel's index.
 */
export const DotNav = forwardRef<HTMLElement, DotNavProps>(function DotNav(
  {
    items,
    activeId,
    onSelect,
    orientation = "vertical",
    variant = "dots",
    labelPlacement = "left",
    navLabel = "Sections",
    className,
    ...props
  },
  ref,
) {
  return (
    <nav
      ref={ref}
      aria-label={navLabel}
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col items-end gap-4" : "flex-row items-center gap-3",
        className,
      )}
      {...props}
    >
      <ul
        className={cn(
          "flex list-none",
          orientation === "vertical" ? "flex-col items-end gap-4" : "flex-row items-center gap-3",
        )}
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-label={item.label}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "group flex cursor-pointer items-center gap-3 outline-none",
                  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[3px]",
                  labelPlacement === "right" && "flex-row-reverse",
                )}
              >
                {labelPlacement !== "none" && (
                  <span
                    aria-hidden
                    className={cn(
                      "text-[10px] tracking-[0.3em] uppercase transition-all duration-300",
                      active ? "text-cyan opacity-100" : "text-muted opacity-0 group-hover:opacity-70",
                    )}
                  >
                    {item.label}
                  </span>
                )}
                <span
                  aria-hidden
                  className={cn(
                    "block rounded-full transition-all duration-500 ease-[var(--ease-celestial)]",
                    active
                      ? variant === "pill"
                        ? "h-1.5 w-6 bg-cyan shadow-[0_0_12px_var(--color-cyan)]"
                        : "size-2.5 bg-cyan shadow-[0_0_12px_var(--color-cyan)]"
                      : "size-1.5 bg-faint group-hover:bg-muted",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
