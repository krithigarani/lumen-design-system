import type { Meta, StoryObj } from "@storybook/react-vite";
import { Carousel } from "./Carousel";
import { EmptyState } from "../EmptyState/EmptyState";

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const slides = Array.from({ length: 7 }, (_, i) => (
  <EmptyState
    key={i}
    glyph={String(i + 1).padStart(2, "0")}
    description="Portrait incoming"
    className="aspect-[3/4] h-full"
  />
));

export const Default: Story = {
  args: { children: slides, label: "Portrait gallery" },
  render: (args) => (
    <div className="grid min-h-screen place-items-center py-16">
      <Carousel {...args} />
    </div>
  ),
};

/**
 * A real scroll container, so trackpad swipe, touch flick and arrow keys all
 * work natively. Focus the track and press ← / →.
 */
export const Keyboard: Story = {
  args: { children: slides, label: "Portrait gallery" },
  render: (args) => (
    <div className="grid min-h-screen place-items-center gap-6 py-16">
      <p className="eyebrow">Tab to the track, then use arrow keys</p>
      <Carousel {...args} />
    </div>
  ),
};

/** Autoplay always ships with a visible pause control (WCAG 2.2.2). */
export const Autoplay: Story = {
  args: { children: slides, label: "Portrait gallery", autoplay: 3000 },
  render: (args) => (
    <div className="grid min-h-screen place-items-center py-16">
      <Carousel {...args} />
    </div>
  ),
};
