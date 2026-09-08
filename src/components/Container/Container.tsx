import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /**
   * Name the container so descendants can target it specifically with
   * `@md/name:` — useful when containers nest.
   */
  name?: string;
  children?: ReactNode;
}

/**
 * Marks a size-query container, so descendants can respond to *this* element's
 * width with `@sm:` / `@md:` / `@lg:` utilities instead of the viewport's.
 *
 * ```tsx
 * <Container>
 *   <div className="flex flex-col @md:flex-row">…</div>
 * </Container>
 * ```
 *
 * Two things worth knowing:
 *
 * - An element cannot query itself. The utilities go on descendants; this
 *   component is the thing they measure.
 * - `container-type: inline-size` makes the element's width independent of its
 *   content, so a shrink-to-fit element would collapse. This always renders
 *   block-level for that reason — don't force it inline.
 *
 * The containment is declared inline rather than through a utility class:
 * `@container/${name}` would be a class built at runtime, and Tailwind only
 * emits classes it can find as literal text, so a named container would
 * silently never be styled.
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { as, name, className, style, children, ...props },
  ref,
) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      ref={ref}
      className={cn("block", className)}
      style={
        {
          containerType: "inline-size",
          ...(name ? { containerName: name } : {}),
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </Tag>
  );
});
