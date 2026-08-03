import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  argTypes: {
    tone: { control: "select", options: ["violet", "cyan", "gold", "magenta"] },
  },
  args: { children: "TypeScript", tone: "violet" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge tone="violet">Violet</Badge>
      <Badge tone="cyan">Cyan</Badge>
      <Badge tone="gold">Gold</Badge>
      <Badge tone="magenta">Magenta</Badge>
    </div>
  ),
};
