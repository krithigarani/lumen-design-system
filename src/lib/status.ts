/** Semantic status scale, mapped onto the palette. */
export type Status = "info" | "success" | "warning" | "danger";

export const statusText: Record<Status, string> = {
  info: "text-cyan",
  success: "text-emerald",
  warning: "text-amber",
  danger: "text-rose",
};

export const statusSurface: Record<Status, string> = {
  info: "border-cyan/25 bg-cyan/8",
  success: "border-emerald/25 bg-emerald/8",
  warning: "border-amber/25 bg-amber/8",
  danger: "border-rose/25 bg-rose/8",
};

export const statusFill: Record<Status, string> = {
  info: "bg-cyan",
  success: "bg-emerald",
  warning: "bg-amber",
  danger: "bg-rose",
};

export const statusGlow: Record<Status, string> = {
  info: "shadow-[0_0_12px_var(--color-cyan)]",
  success: "shadow-[0_0_12px_var(--color-emerald)]",
  warning: "shadow-[0_0_12px_var(--color-amber)]",
  danger: "shadow-[0_0_12px_var(--color-rose)]",
};

/** Default glyph per status. Consumers can override with the `icon` prop. */
export const statusGlyph: Record<Status, string> = {
  info: "◈",
  success: "✦",
  warning: "▲",
  danger: "✕",
};
