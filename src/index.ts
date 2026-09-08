/**
 * Lumen — server-safe entry.
 *
 * Everything exported here renders in a React Server Component: no state, no
 * effects, no refs, no event handlers. Interactive components live in
 * `@lumen/react/client`, which carries the "use client" directive.
 */

/* ---------------- Primitives ---------------- */

export { Button } from "./components/Button/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button/Button";

export { GlassPanel } from "./components/GlassPanel/GlassPanel";
export type { GlassPanelProps } from "./components/GlassPanel/GlassPanel";

export { Container } from "./components/Container/Container";
export type { ContainerProps } from "./components/Container/Container";

export { Card } from "./components/Card/Card";
export type { CardProps, CardSurface } from "./components/Card/Card";

export { Badge, BadgeGroup } from "./components/Badge/Badge";
export type { BadgeProps, BadgeGroupProps } from "./components/Badge/Badge";

export { Heading, GradientText, Text, Eyebrow, Hairline } from "./components/Text/Text";
export type {
  HeadingProps,
  GradientTextProps,
  TextProps,
  EyebrowProps,
  HairlineProps,
} from "./components/Text/Text";

export { Divider } from "./components/Divider/Divider";
export type { DividerProps } from "./components/Divider/Divider";

export { Input, Textarea, Field } from "./components/Input/Input";
export type { InputProps, TextareaProps, FieldProps } from "./components/Input/Input";

export { Checkbox, Radio, RadioGroup, Switch } from "./components/Choice/Choice";
export type {
  CheckboxProps,
  RadioProps,
  RadioGroupProps,
  SwitchProps,
} from "./components/Choice/Choice";

export { Select } from "./components/Select/Select";
export type { SelectProps } from "./components/Select/Select";

export { Slider } from "./components/Slider/Slider";
export type { SliderProps } from "./components/Slider/Slider";

export { Link } from "./components/Link/Link";
export type { LinkProps, LinkTone } from "./components/Link/Link";

export { Kbd, ShortcutBar } from "./components/Kbd/Kbd";
export type { KbdProps, ShortcutBarProps, Shortcut } from "./components/Kbd/Kbd";

export { HudLayer, AppBar, Brand } from "./components/Hud/Hud";
export type { HudLayerProps, AppBarProps, BrandProps } from "./components/Hud/Hud";

export { Alert } from "./components/Alert/Alert";
export type { AlertProps } from "./components/Alert/Alert";

export { Tooltip } from "./components/Tooltip/Tooltip";
export type { TooltipProps, TooltipPlacement } from "./components/Tooltip/Tooltip";

export { Progress } from "./components/Progress/Progress";
export type { ProgressProps } from "./components/Progress/Progress";

export { Skeleton } from "./components/Skeleton/Skeleton";
export type { SkeletonProps, SkeletonShape } from "./components/Skeleton/Skeleton";

export { Spinner } from "./components/Spinner/Spinner";
export type { SpinnerProps } from "./components/Spinner/Spinner";

export { OrbitSpinner } from "./components/Loader/OrbitSpinner";
export type { OrbitSpinnerProps, OrbitSpinnerSize } from "./components/Loader/OrbitSpinner";

export { Stat, StatGroup } from "./components/Stat/Stat";
export type { StatProps, StatGroupProps, StatSize } from "./components/Stat/Stat";

/* ---------------- Content ---------------- */

export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "./components/Table/Table";
export type {
  TableProps,
  TableSectionProps,
  TableRowProps,
  TableHeaderCellProps,
  TableCellProps,
} from "./components/Table/Table";

export { Timeline, TimelineItem } from "./components/Timeline/Timeline";
export type { TimelineProps, TimelineItemProps } from "./components/Timeline/Timeline";

export { Quote } from "./components/Quote/Quote";
export type { QuoteProps } from "./components/Quote/Quote";

export { DataList, DataRow } from "./components/DataList/DataList";
export type { DataListProps, DataRowProps } from "./components/DataList/DataList";

export { EmptyState } from "./components/EmptyState/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState/EmptyState";

export { ScrollArea } from "./components/ScrollArea/ScrollArea";
export type { ScrollAreaProps } from "./components/ScrollArea/ScrollArea";

/* ---------------- Atmosphere ---------------- */

export { NebulaBackdrop } from "./components/Atmosphere/NebulaBackdrop";
export type { NebulaBackdropProps } from "./components/Atmosphere/NebulaBackdrop";

export { Scrim } from "./components/Chapter/Scrim";
export type { ScrimProps, ChapterAlign } from "./components/Chapter/Scrim";

/* ---------------- Utilities ---------------- */

export { cn } from "./lib/cn";
export type { Tone } from "./lib/tone";
export type { Status } from "./lib/status";
export {
  clamp,
  lerp,
  inverseLerp,
  subProgress,
  smoothstep,
  smootherstep,
  band,
  damp,
} from "./lib/math";
