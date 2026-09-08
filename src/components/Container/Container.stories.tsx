import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./Container";
import { Card } from "../Card/Card";
import { Badge, BadgeGroup } from "../Badge/Badge";
import { Heading, Text, Eyebrow } from "../Text/Text";
import { Button } from "../Button/Button";

const meta = { title: "Foundations/Container queries" } satisfies Meta;
export default meta;
type Story = StoryObj;

/** The same card, laid out by its own width rather than the window's. */
function MissionCard() {
  return (
    <Card>
      <div className="flex flex-col gap-5 @md:flex-row @md:items-center @md:gap-8">
        <div className="flex-1">
          <Eyebrow>Surveyor</Eyebrow>
          <Heading level={3} className="mt-3 text-xl @md:text-2xl">
            Aurora
          </Heading>
          <Text size="sm" className="mt-2">
            Four aboard, holding a low pass over the southern basin.
          </Text>
        </div>
        <div className="flex flex-col gap-3 @md:items-end">
          <BadgeGroup>
            <Badge tone="cyan">Docked</Badge>
            <Badge tone="gold">Δv 3.2</Badge>
          </BadgeGroup>
          <Button size="sm">Open</Button>
        </div>
      </div>
    </Card>
  );
}

export const SameCardTwoWidths: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-10">
      <Text size="sm">
        One component, one viewport, two widths. The layout follows the card, not the window —
        drag the Storybook viewport and the narrow one stays stacked.
      </Text>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-[22rem]">
          <Eyebrow>Narrow column</Eyebrow>
          <div className="mt-3">
            <MissionCard />
          </div>
        </div>
        <div className="flex-1">
          <Eyebrow>Wide column</Eyebrow>
          <div className="mt-3">
            <MissionCard />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const StandaloneContainer: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-8">
      <Text size="sm">
        <code className="text-cyan">Container</code> makes any element queryable. An element
        cannot query itself, so the utilities go on descendants.
      </Text>
      {["18rem", "30rem", "48rem"].map((width) => (
        <div key={width} style={{ width }}>
          <Container>
            <div className="glass rounded-2xl p-5">
              <div className="flex flex-col gap-3 @sm:flex-row @sm:items-center @sm:justify-between">
                <span className="font-body text-sm text-ink">Container at {width}</span>
                <BadgeGroup>
                  <Badge tone="violet">stacked</Badge>
                  <Badge tone="cyan" className="hidden @sm:inline-flex">
                    @sm active
                  </Badge>
                  <Badge tone="gold" className="hidden @lg:inline-flex">
                    @lg active
                  </Badge>
                </BadgeGroup>
              </div>
            </div>
          </Container>
        </div>
      ))}
    </div>
  ),
};
