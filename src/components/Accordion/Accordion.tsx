import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  openOnHover: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow more than one panel open at a time. */
  allowMultiple?: boolean;
  /** Value(s) open on first render. */
  defaultValue?: string | string[];
  /** Open a panel on pointer hover as well as click. */
  openOnHover?: boolean;
  children?: ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { allowMultiple = false, defaultValue, openOnHover = false, className, children, ...props },
  ref,
) {
  const [open, setOpen] = useState<string[]>(() =>
    defaultValue === undefined ? [] : Array.isArray(defaultValue) ? defaultValue : [defaultValue],
  );

  const value: AccordionContextValue = {
    isOpen: (v) => open.includes(v),
    toggle: (v) =>
      setOpen((prev) =>
        prev.includes(v)
          ? prev.filter((x) => x !== v)
          : allowMultiple
            ? [...prev, v]
            : [v],
      ),
    openOnHover,
  };

  return (
    <AccordionContext.Provider value={value}>
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Unique key for this panel. */
  value: string;
  title: ReactNode;
  /** Optional glyph shown before the title. */
  icon?: ReactNode;
  /** Accent for the icon. */
  accent?: string;
  children?: ReactNode;
}

/**
 * One disclosure panel.
 *
 * The open/close animation uses a `0fr → 1fr` grid row, so it transitions
 * smoothly without measuring heights in JS.
 */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ value, title, icon, accent, className, children, ...props }, ref) {
    const ctx = useContext(AccordionContext);
    const panelId = useId();
    const buttonId = useId();

    if (!ctx) throw new Error("AccordionItem must be used inside an Accordion");
    const open = ctx.isOpen(value);

    return (
      <div
        ref={ref}
        className={cn("glass rounded-2xl p-6 transition-colors duration-500 hover:border-cyan/40", className)}
        onMouseEnter={ctx.openOnHover && !open ? () => ctx.toggle(value) : undefined}
        {...props}
      >
        <h3 className="font-display text-lg text-ink">
          <button
            type="button"
            id={buttonId}
            onClick={() => ctx.toggle(value)}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex w-full cursor-pointer items-center gap-4 text-left outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[3px]"
          >
            {icon && (
              <span className="text-xl" style={accent ? { color: accent } : undefined} aria-hidden>
                {icon}
              </span>
            )}
            {title}
          </button>
        </h3>
        <div id={panelId} role="region" aria-labelledby={buttonId} className="lumen-collapse" data-open={open}>
          <div>
            <div className="pt-4 text-sm leading-relaxed text-muted">{children}</div>
          </div>
        </div>
      </div>
    );
  },
);
