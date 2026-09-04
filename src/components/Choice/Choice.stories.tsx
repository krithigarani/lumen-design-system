import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox, Radio, RadioGroup, Switch } from "./Choice";
import { Select } from "../Select/Select";
import { Slider } from "../Slider/Slider";
import { Field } from "../Input/Input";
import { Card } from "../Card/Card";
import { Heading, Text } from "../Text/Text";
import { Divider } from "../Divider/Divider";

const meta = { title: "Components/Form controls" } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Checkboxes: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Checkbox label="Send transmission logs" defaultChecked />
      <Checkbox label="Subscribe to the dispatch" description="One message a month, no more." />
      <Checkbox label="Unavailable" disabled />
      <Checkbox label="Locked on" disabled defaultChecked />
    </div>
  ),
};

export const Radios: Story = {
  render: () => (
    <RadioGroup name="tier" label="Orbit" className="w-96">
      <Radio value="low" label="Low orbit" description="Fast passes, tight window." defaultChecked />
      <Radio value="geo" label="Geostationary" description="Fixed above one point." />
      <Radio value="deep" label="Deep space" disabled />
    </RadioGroup>
  ),
};

export const Switches: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Switch label="Sound" defaultChecked />
      <Switch label="Reduced motion" description="Stills the starfield and the reveals." />
      <Switch label="Telemetry" disabled />
    </div>
  ),
};

export const Selects: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <Field label="Destination">
        {(id) => (
          <Select id={id} placeholder="Choose a body">
            <option value="mercury">Mercury</option>
            <option value="venus">Venus</option>
            <option value="mars">Mars</option>
          </Select>
        )}
      </Field>
      <Select defaultValue="geo" aria-label="Orbit class">
        <option value="low">Low orbit</option>
        <option value="geo">Geostationary</option>
      </Select>
    </div>
  ),
};

export const Sliders: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-8">
      <Field label="Thrust">{(id) => <Slider id={id} defaultValue={70} />}</Field>
      <Slider aria-label="Violet" tone="violet" defaultValue={40} />
      <Slider aria-label="Gold" tone="gold" defaultValue={25} />
      <Slider aria-label="Disabled" defaultValue={50} disabled />
    </div>
  ),
};

export const InAForm: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <Card className="max-w-lg">
      <Heading level={3}>Flight plan</Heading>
      <Text size="sm" className="mt-2">
        Every control here is a native input, so this form works without JavaScript.
      </Text>
      <Divider label="Configuration" className="my-7" />
      <form className="flex flex-col gap-6">
        <Field label="Destination">
          {(id) => (
            <Select id={id} placeholder="Choose a body">
              <option value="mars">Mars</option>
              <option value="europa">Europa</option>
            </Select>
          )}
        </Field>
        <RadioGroup name="window" label="Launch window" orientation="horizontal">
          <Radio value="now" label="Immediate" defaultChecked />
          <Radio value="opt" label="Optimal" />
        </RadioGroup>
        <Field label="Thrust">{(id) => <Slider id={id} defaultValue={60} />}</Field>
        <Switch label="Autonomous navigation" defaultChecked />
        <Checkbox label="I have read the flight rules" />
      </form>
    </Card>
  ),
};
