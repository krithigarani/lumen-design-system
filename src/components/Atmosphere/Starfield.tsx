import { forwardRef, useEffect, useRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { useMergedRef } from "../../lib/dom";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface StarfieldProps extends HTMLAttributes<HTMLCanvasElement> {
  /** Stars per 10,000 px². Default 0.9. */
  density?: number;
  position?: "fixed" | "absolute";
  /** Twinkle. Disabled automatically under reduced motion. */
  animate?: boolean;
}

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

/**
 * A field of softly twinkling stars.
 *
 * Like {@link NebulaBackdrop}, this sits at `z-index: 0` — content above it
 * needs `relative` (and `z-10` when it shares a parent with the canvas).
 */
export const Starfield = forwardRef<HTMLCanvasElement, StarfieldProps>(function Starfield(
  { density = 0.9, position = "fixed", animate = true, className, ...props },
  forwardedRef,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ref = useMergedRef<HTMLCanvasElement>(canvasRef, forwardedRef);
  const reduced = useReducedMotion();
  const twinkle = animate && !reduced;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let frame = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((w * h) / 10000 * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0012 + 0.0004,
      }));
    };

    const draw = (t: number) => {
      const { clientWidth: w, clientHeight: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const alpha = twinkle ? 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed)) : 0.6;
        ctx.beginPath();
        ctx.fillStyle = `rgba(234, 230, 255, ${alpha.toFixed(3)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (twinkle && running) frame = requestAnimationFrame(draw);
    };

    resize();
    draw(0);

    const ro = new ResizeObserver(() => {
      resize();
      if (!twinkle) draw(0);
    });
    ro.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [density, twinkle]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none inset-0 z-0 size-full",
        position === "fixed" ? "fixed" : "absolute",
        className,
      )}
      {...props}
    />
  );
});
