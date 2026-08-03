import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: ["outline", "sweep", "icon", "ghost"] },
    tone: { control: "select", options: ["violet", "cyan", "gold", "magenta"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
  args: { children: "Explore", variant: "outline", tone: "cyan", size: "md" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-5">
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="sweep">
        Sweep
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="icon" aria-label="Toggle sound">
        ✦
      </Button>
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-5">
      {(["violet", "cyan", "gold", "magenta"] as const).map((tone) => (
        <div key={tone} className="flex items-center gap-5">
          <Button {...args} tone={tone} variant="outline">
            {tone}
          </Button>
          <Button {...args} tone={tone} variant="sweep">
            {tone}
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-5">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true, children: "Offline" } };
