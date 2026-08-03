import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stat } from "./Stat";

const meta = {
  title: "Components/Stat",
  component: Stat,
  argTypes: { tone: { control: "select", options: ["violet", "cyan", "gold", "magenta"] } },
  args: { label: "Score", value: "128,400", tone: "gold" },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Hud: Story = {
  render: () => (
    <div className="flex gap-4">
      <Stat label="Level" value={12} tone="violet" />
      <Stat label="Lines" value={84} tone="violet" />
      <Stat label="Score" value="128,400" tone="gold" />
      <Stat label="Best" value="204,910" tone="cyan" />
    </div>
  ),
};
