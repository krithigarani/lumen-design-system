import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  baseId: string;
  register: (value: string, disabled: boolean) => void;
  /** Enabled tab values, in render order. */
  values: () => string[];
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`${component} must be used inside <Tabs>`);
  return ctx;
}

const tabId = (base: string, value: string) => `${base}-tab-${value}`;
const panelId = (base: string, value: string) => `${base}-panel-${value}`;

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Uncontrolled starting tab. */
  defaultValue?: string;
  /** Controlled selection. */
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
}

/** Groups a `TabList` with its `TabPanel`s. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { defaultValue, value, onValueChange, className, children, ...props },
  ref,
) {
  const baseId = useId();
  const [internal, setInternal] = useState(defaultValue ?? "");
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  // Registration order is what the arrow keys walk.
  const order = useRef<string[]>([]);
  const disabled = useRef(new Map<string, boolean>());
  const register = useCallback((v: string, isDisabled: boolean) => {
    if (!order.current.includes(v)) order.current.push(v);
    disabled.current.set(v, isDisabled);
  }, []);
  // Disabled tabs are skipped: landing on one strands focus and shows no panel.
  const values = useCallback(
    () => order.current.filter((v) => !disabled.current.get(v)),
    [],
  );

  const select = useCallback(
    (next: string) => {
      if (!controlled) setInternal(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value: current, select, baseId, register, values }}>
      <div ref={ref} className={cn("flex flex-col gap-6", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name for the tab strip. */
  label?: string;
  children?: ReactNode;
}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { label, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      className={cn("flex gap-1 border-b border-white/8", className)}
      {...props}
    >
      {children}
    </div>
  );
});

export interface TabProps extends Omit<HTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * One tab.
 *
 * Follows the APG roving-tabindex pattern: only the selected tab is tabbable,
 * and the arrow keys move between them, so Tab steps past the whole strip into
 * the panel rather than through every tab.
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { value, disabled = false, className, children, ...props },
  ref,
) {
  const { value: current, select, baseId, register, values } = useTabs("Tab");
  register(value, disabled);
  const selected = current === value;

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const all = values();
    const i = all.indexOf(value);
    let next: string | undefined;

    if (e.key === "ArrowRight") next = all[(i + 1) % all.length];
    else if (e.key === "ArrowLeft") next = all[(i - 1 + all.length) % all.length];
    else if (e.key === "Home") next = all[0];
    else if (e.key === "End") next = all[all.length - 1];
    else return;

    e.preventDefault();
    if (!next) return;
    select(next);
    document.getElementById(tabId(baseId, next))?.focus();
  };

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      aria-selected={selected}
      aria-controls={panelId(baseId, value)}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => select(value)}
      onKeyDown={onKeyDown}
      className={cn(
        "-mb-px cursor-pointer border-b px-5 py-3 font-body text-[11px] tracking-[0.24em] uppercase",
        "transition-colors duration-300 outline-none",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[-3px]",
        "disabled:cursor-not-allowed disabled:opacity-40",
        selected
          ? "border-cyan text-cyan shadow-[0_1px_12px_-2px_var(--color-cyan)]"
          : "border-transparent text-muted hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Keep the panel mounted while hidden. */
  keepMounted?: boolean;
  children?: ReactNode;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { value, keepMounted = false, className, children, ...props },
  ref,
) {
  const { value: current, baseId } = useTabs("TabPanel");
  const selected = current === value;

  if (!selected && !keepMounted) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={panelId(baseId, value)}
      aria-labelledby={tabId(baseId, value)}
      hidden={!selected}
      // Tabbable so keyboard users can reach panel content directly.
      tabIndex={0}
      className={cn(
        "outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[3px]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
