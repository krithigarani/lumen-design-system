# Lumen

A futuristic, space-themed React design system — the shared visual language behind the **Cosmos**
portfolio and the **Debris** block game, extracted into one installable package.

Near-black void, violet-tinted glass, cyan energy, and widely-tracked uppercase labels.

## Install

Lumen is not published to npm yet. Install it straight from GitHub — the `prepare` script builds
`dist/` on install, so the package works the same as a registry install:

```bash
npm install github:krithigarani/lumen-design-system
```

Or, when working on Lumen and a consuming app side by side, point at the folder:

```bash
npm install ../lumen
```

Lumen ships two entries. The default one is **server-safe** — everything in it renders inside a
React Server Component. Interactive components carry `"use client"` and live under `/client`:

```tsx
import "@lumen/react/styles.css";

// Server-safe: no state, effects, refs or event handlers.
import { Button, Card, Heading, GradientText, Badge, Input } from "@lumen/react";

// Interactive: ships the client runtime.
import { Modal, Carousel, Reveal, useScrollProgress } from "@lumen/react/client";

export default function Page() {
  return (
    <Card>
      <Heading level={1}>
        <GradientText>Signal acquired</GradientText>
      </Heading>
    </Card>
  );
}
```

| Entry | Contains | Bundle |
| ----- | -------- | ------ |
| `@lumen/react` | Button, Link, Card, GlassPanel, Badge, typography, Divider, all form controls, Alert, Tooltip, Progress, Skeleton, Kbd/ShortcutBar, HudLayer/AppBar, Spinner, Stat, Timeline, Quote, DataList, EmptyState, ScrollArea, Table, NebulaBackdrop, `cn`, scroll maths | ~39 KB |
| `@lumen/react/client` | Modal, Drawer, Popover, Tabs, Carousel, Accordion, Avatar, DotNav, Starfield, LoaderScreen, Toaster, and the whole motion layer + hooks | ~65 KB |

A component belongs to the client entry when it needs `useState`, `useEffect`, `useRef`,
`useContext` or a DOM event handler. `forwardRef`, `useId`, `useMemo` and `useCallback` all work
server-side, which is why the form controls stay in the default entry.

The shipped `styles.css` is self-contained — it includes the tokens, the effect classes, and every
Tailwind utility the components use. **You do not need Tailwind installed** to consume Lumen.

## Fonts

Lumen expects two Google fonts — **Syne** (display) and **Space Grotesk** (body):

```html
<link
  href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

In Next.js, load them with `next/font/google` and point the tokens at the generated variables:

```css
@theme {
  --font-display: var(--font-syne);
  --font-body: var(--font-grotesk);
}
```

## Tokens

| Token                        | Value     | Use                  |
| ---------------------------- | --------- | -------------------- |
| `--color-ink`                | `#eae6ff` | Primary text         |
| `--color-muted`              | `#8f8ab3` | Secondary text       |
| `--color-faint`              | `#55517a` | Tertiary / labels    |
| `--color-violet`             | `#8b7cf6` | Primary accent       |
| `--color-cyan`               | `#7dd3fc` | Interactive / energy |
| `--color-gold`               | `#e8c47c` | Warm accent          |
| `--color-magenta`            | `#f472b6` | Tertiary accent      |
| `--color-void`               | `#030309` | Page background      |
| `--color-bg-2`               | `#07071a` | Deep indigo surface  |
| `--color-surface`            | `#0a0a1c` | Raised surface       |
| `--color-emerald` / `-amber` | —         | Success / warning    |
| `--color-rose` / `-red`      | —         | Error / danger       |

Motion uses one shared curve: `--ease-celestial: cubic-bezier(0.22, 1, 0.36, 1)`.

Semantic statuses map onto the palette: `info` → cyan, `success` → emerald, `warning` → amber,
`danger` → rose. `Alert`, `Progress` and `Toaster` all take a `status`.

## Container queries

Components respond to the space they are given, not the size of the window. `Card`, the `Modal`
panel and the `Drawer` body are size-query containers, and `Container` marks any element as one:

```tsx
<Container>
  <div className="flex flex-col @md:flex-row">…</div>
</Container>
```

Utilities are Tailwind's container variants — `@sm:` `@md:` `@lg:`, or `@md/name:` against a named
container. Two constraints are worth knowing up front:

- **An element cannot query itself.** `container-type` makes an element measurable *by its
  descendants*. A card's own padding therefore can't react to the card's own width without a
  wrapper — which is why Lumen's internal `md:` breakpoints, like `Card`'s padding, are still
  viewport-based.
- **Containment collapses shrink-to-fit boxes.** `inline-size` containment computes the width
  without consulting the content, so a form control or anchor ends up as wide as its own padding.
  `Card` therefore enables containment only when rendered as a plain block; with `as="button"` you
  must opt in *and* give the element a width.

## Positioning

`Popover` uses **CSS anchor positioning** where the browser has it — Baseline 2026, so Chrome 125+,
Safari 26 and Firefox 147. The browser tethers the panel to its trigger and flips it away from
viewport edges through `position-try-fallbacks`, with no measuring on the main thread and nothing to
re-run on scroll.

Older browsers fall back to the previous JS path (measure, flip, clamp), chosen at runtime with
`CSS.supports`. Only one is ever active: when anchor positioning is available the JS never writes
`top`/`left`, so the two can't fight.

Anchor names are per instance, so they travel as a custom property rather than a class — Tailwind
only emits classes it can find as literal text.

## Theming

Lumen is dark by design — the near-black void *is* the identity — but the accents are yours. Every
surface, glow and gradient resolves through the palette tokens, so redefining them on any scope
recolours everything beneath it. No rebuild, no second stylesheet, and it works on a subtree as
happily as on `:root`:

```tsx
<div className="lumen-theme-ember">…</div>

/* or your own */
.my-theme {
  --color-violet: #f0875e;   /* primary   */
  --color-cyan:   #ffb27a;   /* interactive */
  --color-gold:   #ffd9a0;   /* warm      */
  --color-magenta:#ff6b8b;   /* tertiary  */
}
```

Presets: `lumen-theme-ember` · `lumen-theme-abyss` · `lumen-theme-graphite`.

The slots keep their colour names for continuity, but they are really *roles* — violet is primary,
cyan is interactive and focus, gold is the warm accent, magenta the tertiary one. A theme that makes
"violet" orange is doing the right thing, even if the name reads oddly.

One thing genuinely can't be themed: the checkmark inside a checked `Checkbox` is an inline SVG data
URI, which cannot reference a custom property. It stays the void colour, which reads correctly on
any accent light enough to be a fill.

## Effect classes

Available from the stylesheet, usable on any element:

`.glass` · `.gradient-text` · `.text-glow` · `.eyebrow` · `.hairline` · `.hologram-ring` · `.floaty`

`.floaty` and `.hologram-ring` respect `prefers-reduced-motion`.

## Components

| Component                                            | Notes                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `Button`                                             | `variant`: outline · sweep · icon · ghost; `as` for link buttons |
| `Link`                                               | Styled anchor; `external` adds `rel="noopener noreferrer"`      |
| `GlassPanel`                                         | The signature glass surface; `radius`, `floaty`                |
| `Card`                                               | `surface`: glass · subtle · outline; `interactive`; `as`        |
| `Container`                                          | Marks a size-query container for `@md:` utilities               |
| `Badge` `BadgeGroup`                                 | Accented pill; `tone` or an arbitrary `accent` colour           |
| `Heading` `Text` `GradientText` `Eyebrow` `Hairline` | Typography set                                                  |
| `Divider`                                            | Fading rule, optionally carrying a label                        |
| `Input` `Textarea` `Field`                           | Text controls; `Field` wires a generated id to its child        |
| `Checkbox` `Radio` `RadioGroup` `Switch`             | Native inputs restyled; `RadioGroup` injects the shared name    |
| `Select`                                             | Styled native `<select>` — platform picker and type-ahead kept  |
| `Slider`                                             | Styled native range; `tone` accents the thumb                   |
| `Spinner` `OrbitSpinner` `LoaderScreen`              | Loaders; `LoaderScreen` cycles status lines with a failsafe     |
| `Alert`                                              | Inline message; `danger`/`warning` announce assertively         |
| `Tooltip`                                            | CSS-only hint on hover **and** focus; no collision detection    |
| `Progress`                                           | Determinate bar; indeterminate when `value` is omitted          |
| `Skeleton`                                           | Shimmering placeholder; `lines` stacks a paragraph              |
| `Toaster` + `toast()`                                | Notifications from a module-level queue — no provider needed    |
| `Tabs` `TabList` `Tab` `TabPanel`                    | APG roving tabindex; arrow keys skip disabled tabs              |
| `Kbd` `ShortcutBar`                                  | Key caps and a keyboard legend                                  |
| `HudLayer` `AppBar` `Brand`                          | Click-through overlay chrome for a canvas or game board         |
| `Stat` `StatGroup`                                   | HUD readout tile; `media` slot replaces the figure              |
| `Modal`                                              | Native `<dialog>` — focus trap, Escape, scroll lock, top layer  |
| `Drawer`                                             | Edge panel on the same `<dialog>` machinery; scrolling body     |
| `Table` + `TableHead`/`Body`/`Row`/`Cell`            | Scopes, `aria-sort`, sticky header, own scroll container        |
| `Popover` `MenuItem`                                 | Popover API + CSS anchor positioning, with a JS fallback        |
| `Accordion` `AccordionItem`                          | Disclosure panels; animates without measuring heights           |
| `Timeline` `TimelineItem`                            | Vertical run of events on a glowing rail                        |
| `Quote` `DataList` `DataRow` `EmptyState`            | Content primitives                                              |
| `Avatar`                                             | Portrait frame; hologram ring, scanline, float                  |
| `ScrollArea`                                         | Bounded scroll region with fading edges                         |
| `Carousel`                                           | CSS scroll-snap — native touch, trackpad and keyboard           |
| `NebulaBackdrop` `Starfield`                         | Atmosphere layers — see the stacking note below                 |

**Atmosphere stacking:** both backdrops sit at `z-index: 0`, above the page background but below
positioned content. Content drawn over them needs its own stacking order — `relative`, plus `z-10` when
it shares a parent with the backdrop:

```tsx
<div className="relative">
  <NebulaBackdrop position="absolute" />
  <main className="relative z-10">…</main>
</div>
```

They deliberately avoid a negative z-index: that would slide them behind an opaque `body` background
(`--color-void` is exactly what you'll set) and they'd vanish.

## Scroll & motion

Lumen's motion layer has **no runtime dependencies** — no Framer Motion, GSAP or Lenis. Discrete state
travels on a `data-*` attribute and CSS transitions it; continuous scroll values arrive as CSS custom
properties written by one shared rAF loop.

| Component        | Notes                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| `Reveal`         | Fade + rise on entry. Fire-once by default                              |
| `RevealGroup`    | Staggers children; the index is capped so long lists don't trail off    |
| `SplitText`      | Char/word blur-in. Exposes the full string via `aria-label`             |
| `Parallax`       | Drift on scroll. Causes zero React re-renders                           |
| `Chapter` `Scrim`| Sticky scrollytelling section with a legibility scrim                   |
| `ScrollProgress` | Scroll-linked bar with `role="progressbar"`                             |
| `DotNav`         | Section/slide dots with `aria-current`                                  |
| `ScrollCue`      | "Keep scrolling" hint that hides itself once the page moves             |

Hooks: `useScrollProgress` · `useScrollDirection` · `useScrolled` · `useElementScrollProgress` ·
`useElementProgressValue` · `useInView` · `useScrollSpy` · `useReducedMotion`.

Math helpers for scroll-driven work: `clamp` · `lerp` · `inverseLerp` · `subProgress` · `smoothstep` ·
`smootherstep` · `band` · `damp`. `band(t, a, b, c, d)` fades in across `[a,b]` and out across `[c,d]`.

The document's scroll position is published as `--lumen-scroll` (0–1) on `<html>`, plus
`data-lumen-scroll-dir` and `data-lumen-scrolled` — so CSS can react to scroll with no JS of your own.

Everything degrades under `prefers-reduced-motion`, and a `@media (scripting: none)` rule keeps content
visible if JS never runs.

The `cn()` class-merge helper and the `Tone` type are exported too.

## Development

```bash
npm run storybook   # browse the system at http://localhost:6006
npm run build       # emit dist/index.js, dist/index.d.ts, dist/styles.css
npm run typecheck
npm test            # the full suite
```

## Tests

```bash
npm test            # everything
npm run test:unit   # pure logic only, no browser (~0.5s)
npm run test:watch  # watch mode
```

Two Vitest projects:

- **`unit`** — Node. Scroll maths, `cn`, the tone maps, and assertions about the *shipped*
  `dist/styles.css`: that vendor prefixes are ordered so the minifier can't drop the standard
  property, and that every utility the components rely on survived `@source` scanning.
- **`browser`** — real Chromium via Playwright. Lumen deliberately leans on `<dialog>`, the Popover
  API, `IntersectionObserver` and CSS scroll-snap, so jsdom would mean asserting against mocks
  instead of the platform. Layout, focus management, paint and keyboard behaviour are all tested for
  real.

`src/platform-support.browser.test.tsx` fails loudly if the browser lacks an API the library assumes.

Every component lives in `src/components/<Name>/` alongside its stories. Adding one means creating
the component, its `*.stories.tsx`, and an export line in `src/index.ts`.

## Docs

The full component gallery is published at
**[lumen-design-system-ten.vercel.app](https://lumen-design-system-ten.vercel.app)**.

## License

MIT © Krithiga Rani Murugesan — see [LICENSE](LICENSE).
