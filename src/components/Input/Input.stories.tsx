import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, Input, Textarea } from "./Input";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";

const meta = {
  title: "Components/Input",
  component: Input,
  args: { placeholder: "Your name" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-96">
      <Input {...args} />
    </div>
  ),
};

export const WithField: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-6">
      <Field label="Callsign">{(id) => <Input id={id} placeholder="Your name" />}</Field>
      <Field label="Frequency" hint="We'll only reply on this channel.">
        {(id) => <Input id={id} type="email" placeholder="you@somewhere.space" />}
      </Field>
      <Field label="Signal lost" hint="That address didn't resolve." invalid>
        {(id) => <Input id={id} defaultValue="not-an-email" />}
      </Field>
    </div>
  ),
};

export const ContactForm: Story = {
  render: () => (
    <Card className="w-[28rem]">
      <div className="flex flex-col gap-5">
        <Field label="Callsign">{(id) => <Input id={id} placeholder="Your name" />}</Field>
        <Field label="Frequency">
          {(id) => <Input id={id} type="email" placeholder="you@somewhere.space" />}
        </Field>
        <Field label="Transmission">
          {(id) => <Textarea id={id} placeholder="Say something into the void…" />}
        </Field>
        <Button variant="sweep" className="mt-2 self-start">
          Transmit
        </Button>
      </div>
    </Card>
  ),
};
