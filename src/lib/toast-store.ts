import type { Status } from "./status";

export interface ToastOptions {
  title?: string;
  description?: string;
  status?: Status;
  /** ms before auto-dismiss. `0` keeps it until dismissed. Default 5000. */
  duration?: number;
}

export interface ToastRecord extends ToastOptions {
  id: string;
}

/**
 * A module-level queue, so `toast()` is callable from anywhere — event
 * handlers, effects, plain functions — with no provider to thread through.
 */
let toasts: ToastRecord[] = [];
const listeners = new Set<() => void>();

/** Stable reference, so the server snapshot never triggers a re-render loop. */
const EMPTY: ToastRecord[] = [];

let counter = 0;

function emit(): void {
  for (const l of listeners) l();
}

export function subscribeToasts(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export const getToasts = (): ToastRecord[] => toasts;
export const getServerToasts = (): ToastRecord[] => EMPTY;

export interface ToastFn {
  (options: ToastOptions | string): string;
  info: (options: ToastOptions | string) => string;
  success: (options: ToastOptions | string) => string;
  warning: (options: ToastOptions | string) => string;
  danger: (options: ToastOptions | string) => string;
}

function push(options: ToastOptions | string, status?: Status): string {
  const base = typeof options === "string" ? { title: options } : options;
  const id = `lumen-toast-${++counter}`;
  toasts = [
    ...toasts,
    { duration: 5000, status: status ?? base.status ?? "info", ...base, id },
  ];
  emit();
  return id;
}

/** Queue a toast. Returns its id, so it can be dismissed early. */
export const toast: ToastFn = Object.assign(
  (options: ToastOptions | string) => push(options),
  {
    info: (o: ToastOptions | string) => push(o, "info"),
    success: (o: ToastOptions | string) => push(o, "success"),
    warning: (o: ToastOptions | string) => push(o, "warning"),
    danger: (o: ToastOptions | string) => push(o, "danger"),
  },
);

export function dismissToast(id: string): void {
  const next = toasts.filter((t) => t.id !== id);
  if (next.length === toasts.length) return;
  toasts = next;
  emit();
}

export function clearToasts(): void {
  if (toasts.length === 0) return;
  toasts = [];
  emit();
}
