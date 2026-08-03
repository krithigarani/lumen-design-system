import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DotNav } from "../DotNav/DotNav";
import { Button } from "../Button/Button";

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode[];
  /** Slide width in px. Default 240. */
  slideWidth?: number;
  /** Gap between slides in px. Default 20. */
  gap?: number;
  /** Accessible name. */
  label?: string;
  /** Auto-advance interval in ms. Off by default. */
  autoplay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  /** Click-and-drag with a mouse. Touch always uses native scrolling. Default true. */
  dragToScroll?: boolean;
}

/**
 * A snapping, centred carousel.
 *
 * Built on a real scroll container rather than a transform-offset track, which
 * means touch flick, trackpad swipe, keyboard, find-in-page and — critically —
 * focus scrolling all work natively. Tabbing into an off-screen slide brings it
 * into view instead of leaving focus stranded.
 */
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  {
    children,
    slideWidth = 240,
    gap = 20,
    label = "Carousel",
    autoplay,
    showDots = true,
    showArrows = true,
    dragToScroll = true,
    className,
    style,
    ...props
  },
  forwardedRef,
) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const ref = useMergedRef<HTMLDivElement>(scroller, forwardedRef);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(Boolean(autoplay));
  const reduced = useReducedMotion();

  const count = children.length;

  // The active slide is the one nearest the container's centre.
  //
  // Intersection ratios can't decide this: several narrow slides are fully
  // visible at once in a wide viewport, so "is intersecting" is true for a
  // handful of them simultaneously.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const centre = root.scrollLeft + root.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const distance = Math.abs(el.offsetLeft + el.clientWidth / 2 - centre);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setIndex((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    root.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(root);
    return () => {
      root.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [count]);

  const goTo = useCallback(
    (i: number) => {
      const root = scroller.current;
      const el = slideRefs.current[i];
      if (!root || !el) return;
      root.scrollTo({
        left: el.offsetLeft - (root.clientWidth - el.clientWidth) / 2,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  // Autoplay: paused on hover, on focus, and when the tab is hidden.
  useEffect(() => {
    if (!autoplay || !playing || paused || reduced || count < 2) return;
    // `index` comes back from the scroll listener, so only move the scroller.
    const id = setInterval(() => goTo((index + 1) % count), autoplay);
    return () => clearInterval(id);
  }, [autoplay, playing, paused, reduced, count, goTo, index]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Mouse drag. Touch is left to the platform.
  const drag = useRef<{ x: number; left: number } | null>(null);
  const moved = useRef(0);

  const dragHandlers = dragToScroll
    ? {
        onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
          if (e.pointerType !== "mouse") return;
          const el = scroller.current;
          if (!el) return;
          drag.current = { x: e.clientX, left: el.scrollLeft };
          moved.current = 0;
          el.style.scrollSnapType = "none";
          el.style.willChange = "scroll-position";
        },
        onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
          const el = scroller.current;
          if (!drag.current || !el) return;
          const dx = e.clientX - drag.current.x;
          moved.current = Math.max(moved.current, Math.abs(dx));
          el.scrollLeft = drag.current.left - dx;
        },
        onPointerUp: () => {
          const el = scroller.current;
          if (!el) return;
          // Restoring snap lets the browser settle to the nearest slide.
          el.style.scrollSnapType = "";
          el.style.willChange = "";
          drag.current = null;
        },
        onClickCapture: (e: React.MouseEvent) => {
          if (moved.current > 5) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
      }
    : {};

  const inset = `calc(50% - ${slideWidth / 2}px)`;

  return (
    <div
      className={cn("relative w-full", className)}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      style={style}
      {...props}
    >
      {/* soft edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-void/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-void/80 to-transparent" />

      <div
        ref={ref}
        tabIndex={0}
        aria-live={autoplay && playing ? "off" : "polite"}
        className="lumen-carousel flex snap-x snap-mandatory items-center overflow-x-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[3px]"
        style={
          {
            gap: `${gap}px`,
            paddingInline: inset,
            scrollPaddingInline: inset,
          } as CSSProperties
        }
        {...dragHandlers}
      >
        {children.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            data-active={i === index}
            className="lumen-slide shrink-0 snap-center"
            style={{ width: `${slideWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>

      {(showArrows || showDots || autoplay) && (
        <div className="mt-6 flex items-center justify-center gap-4">
          {showArrows && (
            <Button
              variant="icon"
              size="sm"
              aria-label="Previous slide"
              onClick={() => goTo((index - 1 + count) % count)}
            >
              ‹
            </Button>
          )}
          {showDots && (
            <DotNav
              orientation="horizontal"
              variant="pill"
              labelPlacement="none"
              navLabel={`${label} slides`}
              items={children.map((_, i) => ({ id: String(i), label: `Slide ${i + 1}` }))}
              activeId={String(index)}
              onSelect={(id) => goTo(Number(id))}
            />
          )}
          {showArrows && (
            <Button
              variant="icon"
              size="sm"
              aria-label="Next slide"
              onClick={() => goTo((index + 1) % count)}
            >
              ›
            </Button>
          )}
          {/* WCAG 2.2.2 — anything auto-advancing needs a visible pause control. */}
          {autoplay && !reduced && (
            <Button
              variant="ghost"
              size="sm"
              aria-label={playing ? "Pause autoplay" : "Resume autoplay"}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? "Pause" : "Play"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
