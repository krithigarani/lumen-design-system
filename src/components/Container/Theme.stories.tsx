import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../Card/Card";
import { Button } from "../Button/Button";
import { Badge, BadgeGroup } from "../Badge/Badge";
import { Heading, Text, GradientText, Eyebrow } from "../Text/Text";
import { Progress } from "../Progress/Progress";
import { Switch } from "../Choice/Choice";
import { Divider } from "../Divider/Divider";
import { Spinner } from "../Spinner/Spinner";

const THEMES = [
  { name: "Default", className: "" },
  { name: "Ember", className: "lumen-theme-ember" },
  { name: "Abyss", className: "lumen-theme-abyss" },
  { name: "Graphite", className: "lumen-theme-graphite" },
];

/** Every accent below resolves through the palette tokens. */
function Sampler() {
  return (
    <Card>
      <Eyebrow>Telemetry</Eyebrow>
      <Heading level={3} className="mt-3 text-xl">
        <GradientText>Signal acquired</GradientText>
      </Heading>
      <Text size="sm" className="mt-2">
        Glass, glow, gradient and focus ring all follow the palette.
      </Text>

      <Divider label="Status" className="my-6" />

      <BadgeGroup>
        <Badge tone="violet">primary</Badge>
        <Badge tone="cyan">interactive</Badge>
        <Badge tone="gold">warm</Badge>
        <Badge tone="magenta">tertiary</Badge>
      </BadgeGroup>

      <div className="mt-6 flex flex-col gap-4">
        <Progress value={64} label="Fuel" gradient />
        <Switch label="Autonomous navigation" defaultChecked />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button size="sm" variant="sweep">
          Engage
        </Button>
        <Button size="sm">Hold</Button>
        <Spinner size="sm" />
      </div>
    </Card>
  );
}

const meta = { title: "Foundations/Themes" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Presets: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-10">
      <Text size="sm">
        One component tree, four palettes. Each column only sets a class that redefines the accent
        tokens — nothing is re-styled per theme, and the void stays the void.
      </Text>
      <div className="grid gap-8 lg:grid-cols-2">
        {THEMES.map((theme) => (
          <div key={theme.name} className={theme.className}>
            <Eyebrow>{theme.name}</Eyebrow>
            <div className="mt-3">
              <Sampler />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ScopedToASubtree: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex max-w-xl flex-col gap-6">
      <Text size="sm">
        Themes cascade like any other custom property, so one can be scoped to a single panel
        without touching the rest of the page.
      </Text>
      <Card>
        <Heading level={4}>Default surroundings</Heading>
        <div className="lumen-theme-ember mt-5">
          <Card surface="subtle">
            <Eyebrow>Ember, scoped here only</Eyebrow>
            <div className="mt-4 flex items-center gap-3">
              <Badge tone="cyan">interactive</Badge>
              <Button size="sm">Engage</Button>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  ),
};
