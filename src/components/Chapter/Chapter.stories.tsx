import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chapter } from "./Chapter";
import { Card } from "../Card/Card";
import { Heading, Text, Eyebrow } from "../Text/Text";
import { NebulaBackdrop } from "../Atmosphere/NebulaBackdrop";

const meta = {
  title: "Motion/Chapter",
  component: Chapter,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Chapter>;

export default meta;
type Story = StoryObj<typeof meta>;

const chapters = [
  { id: "one", align: "center", title: "The launch", body: "Content pins while the page keeps moving." },
  { id: "two", align: "left", title: "The transit", body: "The scrim shifts toward whichever side the copy sits on." },
  { id: "three", align: "right", title: "The arrival", body: "Each section publishes its own progress as --lumen-p." },
] as const;

export const Sequence: Story = {
  render: () => (
    <div className="relative">
      <NebulaBackdrop position="absolute" />
      {chapters.map((c) => (
        <Chapter key={c.id} id={c.id} align={c.align} className="z-10">
          <Card className="max-w-md">
            <Eyebrow>{c.id}</Eyebrow>
            <Heading level={2} className="mt-4">
              {c.title}
            </Heading>
            <Text className="mt-3">{c.body}</Text>
          </Card>
        </Chapter>
      ))}
    </div>
  ),
};
