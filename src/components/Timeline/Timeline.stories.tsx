import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline, TimelineItem } from "./Timeline";

const meta = {
  title: "Components/Timeline",
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <Timeline>
        <TimelineItem period="2024 — Present" title="AI Engineer" meta="Independent">
          Building retrieval systems and agent tooling.
        </TimelineItem>
        <TimelineItem period="2021 — 2024" title="Frontend Engineer" meta="Studio">
          Design systems, 3D interfaces, and performance work.
        </TimelineItem>
        <TimelineItem period="2019 — 2021" title="Developer" meta="Agency">
          Where the interest in motion started.
        </TimelineItem>
      </Timeline>
    </div>
  ),
};
