import {
  forwardRef,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";
import { useElementScrollProgress } from "../../hooks/useElementScrollProgress";
import { Scrim, type ChapterAlign } from "./Scrim";

export interface ChapterProps extends HTMLAttributes<HTMLElement> {
  /** Outer height; the extra over 100vh is how long the content pins. Default "135vh". */
  height?: string;
  align?: ChapterAlign;
  scrim?: boolean;
  /** Apply the standard horizontal padding. Default true. */
  padding?: boolean;
}

const justify: Record<ChapterAlign, string> = {
  left: "md:justify-start",
  center: "justify-center",
  right: "md:justify-end",
};

/**
 * A full-height scrollytelling section whose content pins while the page moves.
 *
 * Publishes its own scroll progress as `--lumen-p`, which descendants inherit —
 * so a child can bind opacity or scale to chapter progress with no JS.
 *
 * Note: `position: sticky` silently fails if any ancestor has `overflow`
 * hidden/auto/clip.
 */
export const Chapter = forwardRef<HTMLElement, ChapterProps>(function Chapter(
  {
    height = "135vh",
    align = "center",
    scrim = true,
    padding = true,
    className,
    style,
    children,
    ...props
  },
  forwardedRef,
) {
  const localRef = useRef<HTMLElement | null>(null);
  const ref = useMergedRef<HTMLElement>(localRef, forwardedRef);

  useElementScrollProgress(localRef, { range: "contain" });

  return (
    <section
      ref={ref}
      className={cn("relative", className)}
      style={{ height, ...style } as CSSProperties}
      {...props}
    >
      {scrim && <Scrim align={align} />}
      {/* dvh rather than vh so the mobile URL bar doesn't cause a jump. */}
      <div
        className={cn(
          "sticky top-0 flex h-dvh items-center",
          padding && "px-6 md:px-20",
          justify[align],
        )}
      >
        <div className="relative w-full">{children}</div>
      </div>
    </section>
  );
});
