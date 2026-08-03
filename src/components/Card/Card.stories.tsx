import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { Eyebrow, Heading, Text } from "../Text/Text";

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-lg">
      <Eyebrow>Project 01</Eyebrow>
      <Heading level={2} className="mt-4">
        Cosmos
      </Heading>
      <Text className="mt-4">
        A scroll-driven journey through the solar system, rendered in real time with React Three
        Fiber and narrated chapter by chapter.
      </Text>
      <div className="mt-6 flex flex-wrap gap-2">
        <Badge tone="violet">Next.js</Badge>
        <Badge tone="cyan">React Three Fiber</Badge>
        <Badge tone="gold">GSAP</Badge>
      </div>
      <Button variant="sweep" className="mt-8">
        Enter orbit
      </Button>
    </Card>
  ),
};
