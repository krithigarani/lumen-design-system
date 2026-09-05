/**
 * Lumen — interactive entry.
 *
 * Everything here needs state, effects, refs or event handlers, so the bundle
 * carries a "use client" directive. Static components live in `@lumen/react`
 * and stay renderable on the server.
 */

/* ---------------- Scroll & motion ---------------- */

export { Reveal, RevealGroup } from "./components/Reveal/Reveal";
export type { RevealProps, RevealGroupProps } from "./components/Reveal/Reveal";

export { SplitText } from "./components/SplitText/SplitText";
export type { SplitTextProps } from "./components/SplitText/SplitText";

export { Parallax } from "./components/Parallax/Parallax";
export type { ParallaxProps } from "./components/Parallax/Parallax";

export { Chapter } from "./components/Chapter/Chapter";
export type { ChapterProps } from "./components/Chapter/Chapter";

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

/* ---------------- Interactive content ---------------- */

export { Accordion, AccordionItem } from "./components/Accordion/Accordion";
export type { AccordionProps, AccordionItemProps } from "./components/Accordion/Accordion";

export { Avatar } from "./components/Avatar/Avatar";
export type { AvatarProps, AvatarSize } from "./components/Avatar/Avatar";

export { Carousel } from "./components/Carousel/Carousel";
export type { CarouselProps } from "./components/Carousel/Carousel";

export { Starfield } from "./components/Atmosphere/Starfield";
export type { StarfieldProps } from "./components/Atmosphere/Starfield";

export { LoaderScreen } from "./components/Loader/Loader";
export type { LoaderScreenProps } from "./components/Loader/Loader";

export { Tabs, TabList, Tab, TabPanel } from "./components/Tabs/Tabs";
export type { TabsProps, TabListProps, TabProps, TabPanelProps } from "./components/Tabs/Tabs";

export { Toaster } from "./components/Toast/Toast";
export type { ToasterProps, ToasterPlacement } from "./components/Toast/Toast";
export { toast, dismissToast, clearToasts } from "./lib/toast-store";
export type { ToastOptions, ToastRecord } from "./lib/toast-store";

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

export type { ScrollSnapshot, ProgressRange } from "./lib/scroll-store";
