import type { Meta, StoryObj } from "@storybook/react-vite";
import { Parallax } from "./Parallax";
import { Card } from "../Card/Card";
import { Heading } from "../Text/Text";

const meta = {
  title: "Motion/Parallax",
  component: Parallax,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Parallax>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Layers: Story = {
  render: () => (
    <div className="px-8">
      <div className="grid h-screen place-items-center">
        <p className="eyebrow">Scroll down ↓</p>
      </div>

      <div className="relative grid h-screen place-items-center">
        <Parallax distance={160} className="absolute">
          <div className="size-64 rounded-full bg-violet/15 blur-2xl" />
        </Parallax>
        <Parallax distance={80} className="absolute">
          <div className="size-40 rounded-full bg-cyan/15 blur-xl" />
        </Parallax>
        <Parallax distance={-40}>
          <Card>
            <Heading level={2}>Layers drift at different rates</Heading>
          </Card>
        </Parallax>
      </div>

      <div className="grid h-screen place-items-center">
        <p className="eyebrow">Keep going ↓</p>
      </div>
    </div>
  ),
};
