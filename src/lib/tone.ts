/** The four Lumen accent tones. */
export type Tone = "violet" | "cyan" | "gold" | "magenta";

export const toneText: Record<Tone, string> = {
  violet: "text-violet",
  cyan: "text-cyan",
  gold: "text-gold",
  magenta: "text-magenta",
};

export const toneBadge: Record<Tone, string> = {
  violet: "border-violet/30 bg-violet/10 text-violet",
  cyan: "border-cyan/30 bg-cyan/10 text-cyan",
  gold: "border-gold/30 bg-gold/10 text-gold",
  magenta: "border-magenta/30 bg-magenta/10 text-magenta",
};

/** Hover border + text for outline / ghost buttons. */
export const toneOutlineHover: Record<Tone, string> = {
  violet: "hover:border-violet hover:text-violet",
  cyan: "hover:border-cyan hover:text-cyan",
  gold: "hover:border-gold hover:text-gold",
  magenta: "hover:border-magenta hover:text-magenta",
};

/** Border + sliding-fill gradient for the sweep CTA. */
export const toneSweepBorder: Record<Tone, string> = {
  violet: "border-violet/40",
  cyan: "border-cyan/40",
  gold: "border-gold/40",
  magenta: "border-magenta/40",
};

export const toneSweepFill: Record<Tone, string> = {
  violet: "from-violet to-magenta",
  cyan: "from-cyan to-violet",
  gold: "from-gold to-magenta",
  magenta: "from-magenta to-violet",
};
