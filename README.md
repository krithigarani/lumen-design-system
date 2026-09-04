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

Then import the stylesheet once at your app root, and components wherever you need them:

```tsx
import "@lumen/react/styles.css";
import { Button, Card, Heading, GradientText } from "@lumen/react";

export default function Page() {
  return (
    <Card>
      <Heading level={1}>
        <GradientText>Signal acquired</GradientText>
      </Heading>
      <Button variant="sweep" tone="cyan">
        Enter orbit
      </Button>
    </Card>
  );
}
```

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

## Effect classes

Available from the stylesheet, usable on any element:

`.glass` · `.gradient-text` · `.text-glow` · `.eyebrow` · `.hairline` · `.hologram-ring` · `.floaty`

`.floaty` and `.hologram-ring` respect `prefers-reduced-motion`.

## Components

| Component                                            | Notes                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `Button`                                             | `variant`: outline · sweep · icon · ghost; `as` for link buttons |
| `GlassPanel`                                         | The signature glass surface; `radius`, `floaty`                |
| `Card`                                               | `surface`: glass · subtle · outline; `interactive`; `as`        |
| `Badge` `BadgeGroup`                                 | Accented pill; `tone` or an arbitrary `accent` colour           |
| `Heading` `Text` `GradientText` `Eyebrow` `Hairline` | Typography set                                                  |
| `Divider`                                            | Fading rule, optionally carrying a label                        |
| `Input` `Textarea` `Field`                           | Form controls; `Field` wires a generated id to its child        |
| `Spinner` `OrbitSpinner` `LoaderScreen`              | Loaders; `LoaderScreen` cycles status lines with a failsafe     |
| `Stat` `StatGroup`                                   | HUD readout tile; `media` slot replaces the figure              |
| `Modal`                                              | Native `<dialog>` — focus trap, Escape, scroll lock, top layer  |
| `Popover` `MenuItem`                                 | Native Popover API — light dismiss, `aria-expanded`, arrow keys |
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
```

Every component lives in `src/components/<Name>/` alongside its stories. Adding one means creating
the component, its `*.stories.tsx`, and an export line in `src/index.ts`.

## Docs

The full component gallery is published at
**[lumen-design-system-ten.vercel.app](https://lumen-design-system-ten.vercel.app)**.

## License

MIT © Krithiga Rani Murugesan — see [LICENSE](LICENSE).
