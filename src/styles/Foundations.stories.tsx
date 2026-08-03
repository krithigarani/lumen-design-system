import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow, GradientText, Heading, Text } from "../components/Text/Text";
import { GlassPanel } from "../components/GlassPanel/GlassPanel";

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const swatches = [
  { name: "ink", hex: "#eae6ff", use: "Primary text" },
  { name: "muted", hex: "#8f8ab3", use: "Secondary text" },
  { name: "faint", hex: "#55517a", use: "Tertiary / labels" },
  { name: "violet", hex: "#8b7cf6", use: "Primary accent" },
  { name: "cyan", hex: "#7dd3fc", use: "Interactive / energy" },
  { name: "gold", hex: "#e8c47c", use: "Warm accent" },
  { name: "magenta", hex: "#f472b6", use: "Tertiary accent" },
  { name: "void", hex: "#030309", use: "Page background" },
  { name: "bg-2", hex: "#07071a", use: "Deep indigo surface" },
  { name: "surface", hex: "#0a0a1c", use: "Raised surface" },
  { name: "emerald", hex: "#34d399", use: "Success" },
  { name: "amber", hex: "#fbbf24", use: "Warning" },
  { name: "rose", hex: "#f0879e", use: "Error" },
  { name: "red", hex: "#f87171", use: "Danger" },
];

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <Eyebrow>Palette</Eyebrow>
        <Heading level={2} className="mt-3">
          Colour tokens
        </Heading>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {swatches.map((s) => (
          <GlassPanel key={s.name} radius="xl" className="overflow-hidden">
            <div className="h-20 w-full" style={{ background: s.hex }} />
            <div className="flex flex-col gap-1 p-4">
              <span className="font-body text-sm text-ink">{s.name}</span>
              <span className="font-body text-xs uppercase tracking-[0.14em] text-faint">
                {s.hex}
              </span>
              <span className="font-body text-xs text-muted">{s.use}</span>
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <Eyebrow>Type</Eyebrow>
        <Heading level={2} className="mt-3">
          Two faces
        </Heading>
      </div>

      <div className="flex flex-col gap-3">
        <span className="eyebrow">Syne — display</span>
        <p className="font-display text-5xl font-bold text-ink">Aa Bb Cc — 0123456789</p>
        <Heading level={1}>
          <GradientText>The stars settle</GradientText>
        </Heading>
      </div>

      <div className="flex flex-col gap-3">
        <span className="eyebrow">Space Grotesk — body</span>
        <p className="font-body text-3xl text-ink">Aa Bb Cc — 0123456789</p>
        <Text className="max-w-xl">
          Body copy sits in Space Grotesk at a relaxed line height. Micro-labels use the same face,
          uppercased and tracked out to 0.34em — the signature Lumen label treatment.
        </Text>
      </div>
    </div>
  ),
};

export const Effects: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <Eyebrow>Surfaces</Eyebrow>
        <Heading level={2} className="mt-3">
          Effect classes
        </Heading>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <GlassPanel className="grid h-40 place-items-center">
          <code className="font-body text-sm text-muted">.glass</code>
        </GlassPanel>
        <GlassPanel className="grid h-40 place-items-center">
          <span className="gradient-text font-display text-2xl font-bold">.gradient-text</span>
        </GlassPanel>
        <GlassPanel className="grid h-40 place-items-center">
          <span className="text-glow font-display text-2xl font-bold text-ink">.text-glow</span>
        </GlassPanel>
        <GlassPanel className="grid h-40 place-items-center">
          <span className="eyebrow">.eyebrow</span>
        </GlassPanel>
        <GlassPanel className="grid h-40 place-items-center px-8">
          <hr className="hairline" />
        </GlassPanel>
        <GlassPanel className="grid h-40 place-items-center">
          <div className="hologram-ring size-16" />
        </GlassPanel>
      </div>
    </div>
  ),
};
