/* ---------------- Primitives ---------------- */

export { Button } from "./components/Button/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button/Button";

export { GlassPanel } from "./components/GlassPanel/GlassPanel";
export type { GlassPanelProps } from "./components/GlassPanel/GlassPanel";

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

export { Spinner } from "./components/Spinner/Spinner";
export type { SpinnerProps } from "./components/Spinner/Spinner";

export { Stat, StatGroup } from "./components/Stat/Stat";
export type { StatProps, StatGroupProps, StatSize } from "./components/Stat/Stat";

/* ---------------- Scroll & motion ---------------- */

export { Reveal, RevealGroup } from "./components/Reveal/Reveal";
export type { RevealProps, RevealGroupProps } from "./components/Reveal/Reveal";

export { SplitText } from "./components/SplitText/SplitText";
export type { SplitTextProps } from "./components/SplitText/SplitText";

export { Parallax } from "./components/Parallax/Parallax";
export type { ParallaxProps } from "./components/Parallax/Parallax";

export { Chapter, Scrim } from "./components/Chapter/Chapter";
export type { ChapterProps, ScrimProps, ChapterAlign } from "./components/Chapter/Chapter";

export { ScrollProgress } from "./components/ScrollProgress/ScrollProgress";
export type { ScrollProgressProps } from "./components/ScrollProgress/ScrollProgress";

export { ScrollCue } from "./components/ScrollCue/ScrollCue";
export type { ScrollCueProps } from "./components/ScrollCue/ScrollCue";

export { DotNav } from "./components/DotNav/DotNav";
export type { DotNavProps, DotNavItem } from "./components/DotNav/DotNav";

/* ---------------- Overlays ---------------- */

export { Modal } from "./components/Modal/Modal";
export type { ModalProps } from "./components/Modal/Modal";

export { Popover, MenuItem } from "./components/Popover/Popover";
export type { PopoverProps, MenuItemProps, Placement } from "./components/Popover/Popover";

/* ---------------- Content ---------------- */

export { Accordion, AccordionItem } from "./components/Accordion/Accordion";
export type { AccordionProps, AccordionItemProps } from "./components/Accordion/Accordion";

export { Timeline, TimelineItem } from "./components/Timeline/Timeline";
export type { TimelineProps, TimelineItemProps } from "./components/Timeline/Timeline";

export { Quote } from "./components/Quote/Quote";
export type { QuoteProps } from "./components/Quote/Quote";

export { DataList, DataRow } from "./components/DataList/DataList";
export type { DataListProps, DataRowProps } from "./components/DataList/DataList";

export { Avatar } from "./components/Avatar/Avatar";
export type { AvatarProps, AvatarSize } from "./components/Avatar/Avatar";

export { EmptyState } from "./components/EmptyState/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState/EmptyState";

export { ScrollArea } from "./components/ScrollArea/ScrollArea";
export type { ScrollAreaProps } from "./components/ScrollArea/ScrollArea";

export { Carousel } from "./components/Carousel/Carousel";
export type { CarouselProps } from "./components/Carousel/Carousel";

/* ---------------- Atmosphere ---------------- */

export { NebulaBackdrop } from "./components/Atmosphere/NebulaBackdrop";
export type { NebulaBackdropProps } from "./components/Atmosphere/NebulaBackdrop";

export { Starfield } from "./components/Atmosphere/Starfield";
export type { StarfieldProps } from "./components/Atmosphere/Starfield";

export { LoaderScreen, OrbitSpinner } from "./components/Loader/Loader";
export type { LoaderScreenProps, OrbitSpinnerProps } from "./components/Loader/Loader";

/* ---------------- Hooks ---------------- */

export {
  useScrollProgress,
  useScrollDirection,
  useScrolled,
} from "./hooks/useScrollProgress";
export {
  useElementScrollProgress,
  useElementProgressValue,
} from "./hooks/useElementScrollProgress";
export type { UseElementScrollProgressOptions } from "./hooks/useElementScrollProgress";
export { useInView, REVEAL_MARGIN } from "./hooks/useInView";
export type { UseInViewOptions } from "./hooks/useInView";
export { useReducedMotion } from "./hooks/useReducedMotion";
export { useScrollSpy } from "./hooks/useScrollSpy";
export type { UseScrollSpyOptions } from "./hooks/useScrollSpy";

/* ---------------- Utilities ---------------- */

export { cn } from "./lib/cn";
export type { Tone } from "./lib/tone";
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
export type { ScrollSnapshot, ProgressRange } from "./lib/scroll-store";
