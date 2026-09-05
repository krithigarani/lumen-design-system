import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs";
import { Link } from "../Link/Link";
import { Kbd, ShortcutBar } from "../Kbd/Kbd";
import { HudLayer, AppBar, Brand } from "../Hud/Hud";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Heading, Text, Eyebrow } from "../Text/Text";
import { NebulaBackdrop } from "../Atmosphere/NebulaBackdrop";

const meta = { title: "Components/Navigation" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const TabsStory: Story = {
  name: "Tabs",
  parameters: { layout: "padded" },
  render: () => (
    <div className="max-w-2xl">
      <Tabs defaultValue="overview">
        <TabList label="Mission sections">
          <Tab value="overview">Overview</Tab>
          <Tab value="specs">Specs</Tab>
          <Tab value="crew">Crew</Tab>
          <Tab value="archived" disabled>
            Archived
          </Tab>
        </TabList>
        <TabPanel value="overview">
          <Heading level={3}>Overview</Heading>
          <Text size="sm" className="mt-3">
            Arrow keys move between tabs; Tab steps past the strip into the panel.
          </Text>
        </TabPanel>
        <TabPanel value="specs">
          <Heading level={3}>Specs</Heading>
          <Text size="sm" className="mt-3">
            Thrust, mass and delta-v for the current configuration.
          </Text>
        </TabPanel>
        <TabPanel value="crew">
          <Heading level={3}>Crew</Heading>
          <Text size="sm" className="mt-3">
            Four aboard, two on rotation.
          </Text>
        </TabPanel>
      </Tabs>
    </div>
  ),
};

export const Links: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <Card className="max-w-md">
      <Text size="sm">
        Read the <Link href="#">flight rules</Link>, check the{" "}
        <Link href="#" tone="gold">
          launch window
        </Link>
        , or browse the{" "}
        <Link href="https://example.com" external>
          public archive
        </Link>
        .
      </Text>
      <div className="mt-6 flex flex-col gap-2">
        <Link href="#" subtle tone="violet">
          Subtle, underlined on hover
        </Link>
        <Link href="#" tone="inherit">
          Inheriting the surrounding colour
        </Link>
      </div>
    </Card>
  ),
};

export const Shortcuts: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Text size="sm">Press</Text>
        <Kbd>Esc</Kbd>
        <Text size="sm">to close.</Text>
      </div>
      <ShortcutBar
        hideOnMobile={false}
        items={[
          { keys: ["←", "→"], label: "Move" },
          { keys: ["↑"], label: "Rotate" },
          { keys: ["Space"], label: "Drop" },
          { keys: ["Shift", "P"], label: "Pause", join: "+" },
        ]}
      />
    </div>
  ),
};

export const Hud: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="relative grid min-h-screen place-items-center">
      <NebulaBackdrop position="absolute" />
      <div className="relative z-10 text-center">
        <Eyebrow>Click-through</Eyebrow>
        <Heading level={3} className="mt-3">
          The layer above ignores the pointer
        </Heading>
        <Text size="sm" className="mt-3">
          Only its own controls take clicks, so a canvas underneath keeps the drag.
        </Text>
      </div>
      <HudLayer className="z-20">
        <AppBar
          brand={<Brand>Lumen</Brand>}
          actions={
            <>
              <Button variant="icon" size="sm" aria-label="Sound">
                ♪
              </Button>
              <Button size="sm">Résumé</Button>
            </>
          }
        />
        <ShortcutBar
          fixed
          hideOnMobile={false}
          items={[
            { keys: ["↑", "↓"], label: "Navigate" },
            { keys: ["Enter"], label: "Select" },
          ]}
        />
      </HudLayer>
    </div>
  ),
};
