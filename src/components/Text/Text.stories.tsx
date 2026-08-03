import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow, GradientText, Hairline, Heading, Text } from "./Text";

const meta = {
  title: "Components/Typography",
  component: Heading,
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Headings: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-6">
      <Heading level={1}>Level one — the finale</Heading>
      <Heading level={2}>Level two — section title</Heading>
      <Heading level={3}>Level three — card title</Heading>
      <Heading level={4}>Level four — label heading</Heading>
      <Heading level={2} glow>
        With glow
      </Heading>
    </div>
  ),
};

export const Gradient: Story = {
  render: () => (
    <Heading level={1}>
      <GradientText>Traveling at the speed of light</GradientText>
    </Heading>
  ),
};

export const Body: Story = {
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <Text tone="ink" size="lg">
        Ink at large — for lead paragraphs that carry a section.
      </Text>
      <Text tone="muted">Muted at base — the default reading tone for body copy.</Text>
      <Text tone="faint" size="sm">
        Faint at small — captions, metadata, and quiet asides.
      </Text>
    </div>
  ),
};

export const Labels: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <Eyebrow>Chapter 04 — Photography</Eyebrow>
      <Eyebrow dash={false}>Without dash</Eyebrow>
      <Hairline />
    </div>
  ),
};
