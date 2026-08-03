import type { Meta, StoryObj } from "@storybook/react-vite";
import { SplitText } from "./SplitText";

const meta = {
  title: "Motion/SplitText",
  component: SplitText,
  parameters: { layout: "fullscreen" },
  args: { children: "KRITHIGA RANI" },
} satisfies Meta<typeof SplitText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnMount: Story = {
  args: { trigger: "mount" },
  render: (args) => (
    <div className="grid h-screen place-items-center px-8">
      <SplitText
        {...args}
        as="h1"
        className="font-body text-glow text-3xl font-light tracking-[0.3em] text-ink uppercase md:text-5xl md:tracking-[0.42em]"
      />
    </div>
  ),
};

export const OnScroll: Story = {
  render: (args) => (
    <div className="px-8">
      <div className="grid h-screen place-items-center">
        <p className="eyebrow">Scroll down ↓</p>
      </div>
      <div className="grid h-screen place-items-center">
        <SplitText
          {...args}
          as="h2"
          className="font-display gradient-text text-3xl tracking-[0.2em] uppercase md:text-5xl"
        />
      </div>
    </div>
  ),
};

/** Long strings should split by word — per-character on a paragraph is too much. */
export const ByWord: Story = {
  args: {
    by: "word",
    children: "An interface should feel like it was always going to look this way",
  },
  render: (args) => (
    <div className="grid h-screen place-items-center px-8">
      <SplitText {...args} trigger="mount" as="p" className="max-w-2xl text-center text-lg text-muted" />
    </div>
  ),
};
