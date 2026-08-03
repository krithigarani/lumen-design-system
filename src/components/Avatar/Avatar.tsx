import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt: string;
  size?: AvatarSize;
  /** Spinning conic ring around the portrait. */
  ring?: "hologram" | "plain" | "none";
  /** Sweeping scanline overlay. */
  scanline?: boolean;
  /** Gentle vertical bob. */
  float?: boolean;
  /** Shown when `src` is missing or fails to load. */
  fallback?: string;
}

const sizes: Record<AvatarSize, string> = {
  sm: "size-16",
  md: "size-24",
  lg: "size-36",
  xl: "size-52",
};

/** A portrait frame with the house hologram ring. */
export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    size = "lg",
    ring = "hologram",
    scanline = false,
    float = false,
    fallback,
    className,
    ...props
  },
  ref,
) {
  const [broken, setBroken] = useState(false);
  const showImage = src && !broken;

  return (
    <div
      ref={ref}
      className={cn("relative", sizes[size], float && "floaty", className)}
      {...props}
    >
      {ring === "hologram" && (
        <div aria-hidden className="hologram-ring pointer-events-none absolute -inset-3" />
      )}
      <div
        className={cn(
          "relative size-full overflow-hidden rounded-full",
          ring === "none" ? "" : "border border-cyan/25 p-1.5",
        )}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            onError={() => setBroken(true)}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={alt}
            className="grid size-full place-items-center rounded-full bg-gradient-to-br from-violet/15 via-surface to-cyan/10"
          >
            <span className="font-display text-2xl text-white/20">
              {fallback ?? initials(alt)}
            </span>
          </div>
        )}
        {scanline && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
          >
            <div className="h-1/3 w-full bg-gradient-to-b from-transparent via-cyan/70 to-transparent [animation:scanline_4s_linear_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
});

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
