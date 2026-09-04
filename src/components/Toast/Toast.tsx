import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";
import { statusText, statusGlyph } from "../../lib/status";
import {
  subscribeToasts,
  getToasts,
  getServerToasts,
  dismissToast,
  type ToastRecord,
} from "../../lib/toast-store";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const EXIT_MS = 280;

export type ToasterPlacement =
  | "top-right"
  | "top-center"
  | "bottom-right"
  | "bottom-center";

export interface ToasterProps extends HTMLAttributes<HTMLDivElement> {
  placement?: ToasterPlacement;
  /** Accessible name for the notification region. */
  label?: string;
}

const placements: Record<ToasterPlacement, string> = {
  "top-right": "top-0 right-0 items-end",
  "top-center": "top-0 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-0 right-0 items-end",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 items-center",
};

function ToastItem({ record }: { record: ToastRecord }) {
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const status = record.status ?? "info";
  const assertive = status === "danger" || status === "warning";

  // Mount hidden, then flip a frame later so the transition has a start state.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => dismissToast(record.id), reduced ? 0 : EXIT_MS);
  }, [record.id, reduced]);

  // Auto-dismiss. Hovering or focusing restarts the countdown rather than
  // resuming it — simpler, and it errs towards leaving the toast on screen.
  useEffect(() => {
    if (!record.duration || paused) return;
    const timer = setTimeout(close, record.duration);
    return () => clearTimeout(timer);
  }, [record.duration, paused, close]);

  return (
    <div
      role={assertive ? "alert" : "status"}
      data-state={open ? "open" : "closed"}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className={cn(
        "lumen-toast glass pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] gap-3 rounded-2xl p-4",
      )}
    >
      <span aria-hidden className={cn("mt-px text-sm leading-none", statusText[status])}>
        {statusGlyph[status]}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {record.title && (
          <p className={cn("text-[11px] tracking-[0.2em] uppercase", statusText[status])}>
            {record.title}
          </p>
        )}
        {record.description && (
          <p className="text-sm leading-relaxed text-ink/90">{record.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Dismiss notification"
        className={cn(
          "-mt-1 -mr-1 h-6 w-6 shrink-0 cursor-pointer rounded-full text-muted",
          "transition-colors hover:text-ink outline-none",
          "focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-2",
        )}
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Renders queued toasts. Mount once, near the root.
 *
 * Toasts are pushed through the module-level `toast()` function rather than a
 * context, so any code can raise one without a provider in scope.
 *
 * Each toast carries its own `role` — `alert` for warnings and errors,
 * `status` otherwise — so the region itself sets no `aria-live` and nothing
 * gets announced twice.
 */
export function Toaster({
  placement = "bottom-right",
  label = "Notifications",
  className,
  ...props
}: ToasterProps) {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);

  return (
    <div
      role="region"
      aria-label={label}
      className={cn(
        "pointer-events-none fixed z-[70] flex flex-col gap-3 p-4",
        placements[placement],
        className,
      )}
      {...props}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} record={t} />
      ))}
    </div>
  );
}
