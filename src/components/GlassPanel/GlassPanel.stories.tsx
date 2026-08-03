import type { Meta, StoryObj } from "@storybook/react-vite";
import { GlassPanel } from "./GlassPanel";
import { Eyebrow, Heading, Text } from "../Text/Text";

const meta = {
  title: "Components/GlassPanel",
  component: GlassPanel,
  argTypes: {
    radius: { control: "select", options: ["lg", "xl", "2xl", "3xl", "full"] },
    floaty: { control: "boolean" },
  },
  args: { radius: "2xl", floaty: false },
} satisfies Meta<typeof GlassPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <GlassPanel {...args} className="max-w-md p-8">
      <Eyebrow>Transmission</Eyebrow>
      <Heading level={3} className="mt-4">
        Signal acquired
      </Heading>
      <Text className="mt-3">
        The glass surface layers a violet-tinted gradient over a blurred backdrop, ringed by a
        hairline border and a soft outer glow.
      </Text>
    </GlassPanel>
  ),
};

export const Radii: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {(["lg", "xl", "2xl", "3xl"] as const).map((radius) => (
        <GlassPanel key={radius} radius={radius} className="grid size-28 place-items-center">
          <span className="eyebrow">{radius}</span>
        </GlassPanel>
      ))}
    </div>
  ),
};

export const Floaty: Story = {
  args: { floaty: true },
  render: (args) => (
    <GlassPanel {...args} className="grid size-40 place-items-center">
      <span className="eyebrow">Drifting</span>
    </GlassPanel>
  ),
};
