import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { useScrolled } from "../../hooks/useScrollProgress";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface ScrollCueProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** When set, the cue becomes a button that scrolls to this element id. */
  targetId?: string;
}

/**
 * A "keep scrolling" hint that fades itself out once the page moves.
 *
 * The fade is pure CSS off the document's `data-lumen-scrolled` attribute; the
 * subscription here just guarantees the shared scroll loop is running.
 */
export const ScrollCue = forwardRef<HTMLDivElement, ScrollCueProps>(function ScrollCue(
  { label = "Scroll", targetId, className, ...props },
  ref,
) {
  useScrolled();
  const reduced = useReducedMotion();

  const cue = (
    <span className="lumen-cue-mark flex flex-col items-center gap-3">
      <span className="text-[10px] tracking-[0.4em] text-muted uppercase">{label}</span>
      <span aria-hidden className="h-8 w-px bg-gradient-to-b from-cyan to-transparent" />
    </span>
  );

  if (targetId) {
    return (
      <div ref={ref} className={cn("lumen-cue", className)} {...props}>
        <button
          type="button"
          onClick={() =>
            document.getElementById(targetId)?.scrollIntoView({
              behavior: reduced ? "auto" : "smooth",
              block: "start",
            })
          }
          className="flex cursor-pointer flex-col items-center gap-3 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[3px]"
        >
          {cue}
        </button>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("lumen-cue flex flex-col items-center gap-3", className)}
      {...props}
    >
      {cue}
    </div>
  );
});
