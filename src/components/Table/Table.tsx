import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";
import { cn } from "../../lib/cn";

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Describes the table for screen readers. Rendered as a `<caption>`. */
  caption?: ReactNode;
  /** Visually hide the caption while keeping it announced. */
  hideCaption?: boolean;
  /** Cap the height and scroll vertically. Any CSS length. */
  maxHeight?: string;
  dense?: boolean;
  children?: ReactNode;
}

/**
 * A table on the house glass surface.
 *
 * Always wrapped in its own horizontally scrolling container: a wide table
 * must never force the page itself to scroll sideways. The wrapper is
 * focusable so keyboard users can scroll it, which is required whenever a
 * scroll container holds no focusable content of its own.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    caption,
    hideCaption = false,
    maxHeight,
    dense = false,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      tabIndex={0}
      role="group"
      className={cn(
        "glass overflow-auto rounded-2xl outline-none",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan focus-visible:outline-offset-[3px]",
      )}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <table
        ref={ref}
        data-dense={dense}
        className={cn("lumen-table w-full border-collapse text-left font-body", className)}
        {...props}
      >
        {caption && (
          <caption
            className={cn(
              hideCaption ? "sr-only" : "px-5 py-4 text-left text-[11px] tracking-[0.2em] text-faint uppercase",
            )}
          >
            {caption}
          </caption>
        )}
        {children}
      </table>
    </div>
  );
});

export type TableSectionProps = HTMLAttributes<HTMLTableSectionElement> & {
  /** Keep this header visible while the body scrolls. */
  sticky?: boolean;
};

export const TableHead = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  function TableHead({ sticky = false, className, children, ...props }, ref) {
    return (
      <thead
        ref={ref}
        className={cn(sticky && "sticky top-0 z-10 bg-surface/95 backdrop-blur-sm", className)}
        {...props}
      >
        {children}
      </thead>
    );
  },
);

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  function TableBody({ className, children, ...props }, ref) {
    return (
      <tbody ref={ref} className={className} {...props}>
        {children}
      </tbody>
    );
  },
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Highlight on hover — use for rows that are clickable. */
  interactive?: boolean;
  selected?: boolean;
  children?: ReactNode;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { interactive = false, selected = false, className, children, ...props },
  ref,
) {
  return (
    <tr
      ref={ref}
      aria-selected={selected || undefined}
      className={cn(
        "border-b border-white/5 last:border-0 transition-colors",
        interactive && "cursor-pointer hover:bg-white/[0.03]",
        selected && "bg-cyan/8",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
});

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Column header by default; pass "row" for row headers. */
  scope?: "col" | "row";
  /** Current sort direction, announced via aria-sort. */
  sort?: "ascending" | "descending" | "none";
  children?: ReactNode;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell({ scope = "col", sort, className, children, ...props }, ref) {
    return (
      <th
        ref={ref}
        scope={scope}
        aria-sort={sort}
        className={cn(
          "border-b border-white/8 px-5 py-3 text-[10px] font-normal tracking-[0.24em] text-faint uppercase",
          className,
        )}
        {...props}
      >
        {children}
      </th>
    );
  },
);

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  /** Right-align and use tabular figures, for numeric columns. */
  numeric?: boolean;
  children?: ReactNode;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { numeric = false, className, children, ...props },
  ref,
) {
  return (
    <td
      ref={ref}
      className={cn(
        "px-5 py-3.5 text-sm text-ink/90",
        numeric && "text-right tabular-nums",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
});
