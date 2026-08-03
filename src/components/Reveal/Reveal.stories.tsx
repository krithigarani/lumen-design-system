import type { Meta, StoryObj } from "@storybook/react-vite";
import { Reveal, RevealGroup } from "./Reveal";
import { Card } from "../Card/Card";
import { Heading, Text } from "../Text/Text";

const meta = {
  title: "Motion/Reveal",
  component: Reveal,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tall filler so the story actually scrolls inside the Storybook iframe. */
function Spacer({ label = "Scroll down" }: { label?: string }) {
  return (
    <div className="grid h-screen place-items-center">
      <p className="eyebrow">{label} ↓</p>
    </div>
  );
}

export const Single: Story = {
  render: () => (
    <div className="px-8">
      <Spacer />
      <Reveal>
        <Card>
          <Heading level={2}>Revealed on entry</Heading>
          <Text className="mt-3">
            Fades and rises as it crosses into the viewport. Scroll back up — it stays visible,
            because the observer disconnects after the first intersection.
          </Text>
        </Card>
      </Reveal>
      <Spacer label="Keep going" />
    </div>
  ),
};

export const Stagger: Story = {
  render: () => (
    <div className="px-8">
      <Spacer />
      <RevealGroup className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 9 }, (_, i) => (
          <Card key={i} surface="subtle" className="p-6">
            <span className="eyebrow">Item {String(i + 1).padStart(2, "0")}</span>
          </Card>
        ))}
      </RevealGroup>
      <Spacer label="Keep going" />
    </div>
  ),
};

export const Directions: Story = {
  render: () => (
    <div className="px-8">
      <Spacer />
      <div className="flex flex-col gap-6">
        <Reveal x={-60} y={0}>
          <Card surface="subtle">From the left</Card>
        </Reveal>
        <Reveal x={60} y={0}>
          <Card surface="subtle">From the right</Card>
        </Reveal>
        <Reveal blur={10}>
          <Card surface="subtle">With a blur</Card>
        </Reveal>
      </div>
      <Spacer label="Keep going" />
    </div>
  ),
};
