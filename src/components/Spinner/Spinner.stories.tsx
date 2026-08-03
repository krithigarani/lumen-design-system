import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  argTypes: { size: { control: "select", options: ["sm", "md", "lg"] } },
  args: { size: "md" },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const Loader: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <Spinner size="lg" />
      <span className="eyebrow">Calibrating star charts</span>
    </div>
  ),
};
