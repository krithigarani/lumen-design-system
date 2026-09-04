import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";
import { Tooltip } from "../Tooltip/Tooltip";
import { Progress } from "../Progress/Progress";
import { Skeleton } from "../Skeleton/Skeleton";
import { Toaster } from "../Toast/Toast";
import { toast } from "../../lib/toast-store";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Heading, Text } from "../Text/Text";

const meta = { title: "Components/Feedback" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Alerts: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex max-w-xl flex-col gap-4">
      <Alert status="info" title="Transmission">
        The relay is online and listening on the usual channel.
      </Alert>
      <Alert status="success" title="Docked">
        Coupling confirmed. All seals holding.
      </Alert>
      <Alert status="warning" title="Drift">
        Attitude is off by 0.4°. Correct before the next burn.
      </Alert>
      <Alert
        status="danger"
        title="Signal lost"
        action={
          <Button size="sm" tone="magenta">
            Retry
          </Button>
        }
      >
        No response for 40 seconds.
      </Alert>
      <Alert status="info" icon={null}>
        Without a glyph, for quieter notes.
      </Alert>
    </div>
  ),
};

export const Tooltips: Story = {
  render: () => (
    <div className="flex items-center gap-10 p-24">
      {(["top", "bottom", "left", "right"] as const).map((placement) => (
        <Tooltip key={placement} content={`Placed ${placement}`} placement={placement}>
          <Button size="sm">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Progresses: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex max-w-md flex-col gap-8">
      <Progress value={72} label="Fuel" gradient />
      <Progress value={40} label="Oxygen" status="info" />
      <Progress value={88} label="Shield" status="success" />
      <Progress value={22} label="Reserve" status="warning" />
      <Progress value={8} label="Hull" status="danger" />
      <Progress label="Scanning" />
    </div>
  ),
};

export const Skeletons: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <Card className="max-w-md">
      <div className="flex items-center gap-4">
        <Skeleton shape="circle" width="3rem" height="3rem" />
        <div className="flex-1">
          <Skeleton width="45%" />
        </div>
      </div>
      <div className="mt-6">
        <Skeleton lines={3} />
      </div>
      <div className="mt-6">
        <Skeleton shape="block" height="7rem" />
      </div>
    </Card>
  ),
};

export const Toasts: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="grid min-h-screen place-items-center p-10">
      <Card className="max-w-md">
        <Heading level={3}>Toasts</Heading>
        <Text size="sm" className="mt-2">
          Raised through a module-level queue, so no provider is needed. Hover one to hold it.
        </Text>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="sm" onClick={() => toast.info({ title: "Relay", description: "Channel open." })}>
            Info
          </Button>
          <Button
            size="sm"
            onClick={() => toast.success({ title: "Docked", description: "All seals holding." })}
          >
            Success
          </Button>
          <Button
            size="sm"
            onClick={() => toast.warning({ title: "Drift", description: "Attitude off by 0.4°." })}
          >
            Warning
          </Button>
          <Button
            size="sm"
            tone="magenta"
            onClick={() =>
              toast.danger({ title: "Signal lost", description: "No response.", duration: 0 })
            }
          >
            Sticky error
          </Button>
        </div>
      </Card>
      <Toaster />
    </div>
  ),
};
