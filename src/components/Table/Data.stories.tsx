import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from "./Table";
import { Drawer } from "../Drawer/Drawer";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";
import { Field, Input, Textarea } from "../Input/Input";
import { Switch } from "../Choice/Choice";
import { Text } from "../Text/Text";

const meta = { title: "Components/Data" } satisfies Meta;
export default meta;
type Story = StoryObj;

const fleet = [
  { name: "Aurora", cls: "Surveyor", crew: 4, delta: "3.2", status: "Docked" },
  { name: "Kestrel", cls: "Courier", crew: 2, delta: "5.8", status: "In transit" },
  { name: "Vela", cls: "Hauler", crew: 9, delta: "1.4", status: "Refitting" },
  { name: "Corvus", cls: "Surveyor", crew: 4, delta: "3.0", status: "Docked" },
];

const tone = (status: string) =>
  status === "Docked" ? "cyan" : status === "In transit" ? "gold" : "violet";

export const Tables: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="max-w-3xl">
      <Table caption="Fleet status">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Vessel</TableHeaderCell>
            <TableHeaderCell>Class</TableHeaderCell>
            <TableHeaderCell>Crew</TableHeaderCell>
            <TableHeaderCell>Δv (km/s)</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fleet.map((s) => (
            <TableRow key={s.name}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.cls}</TableCell>
              <TableCell numeric>{s.crew}</TableCell>
              <TableCell numeric>{s.delta}</TableCell>
              <TableCell>
                <Badge tone={tone(s.status)}>{s.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
};

export const StickyAndDense: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="max-w-2xl">
      <Table caption="Long manifest" hideCaption dense maxHeight="16rem">
        <TableHead sticky>
          <TableRow>
            <TableHeaderCell>Item</TableHeaderCell>
            <TableHeaderCell>Bay</TableHeaderCell>
            <TableHeaderCell>Mass (kg)</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: 24 }, (_, i) => (
            <TableRow key={i} interactive>
              <TableCell>Container {String(i + 1).padStart(2, "0")}</TableCell>
              <TableCell>{["A", "B", "C"][i % 3]}</TableCell>
              <TableCell numeric>{(120 + i * 37).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Text size="sm" className="mt-4">
        The header stays put while the body scrolls, and the whole table scrolls sideways rather
        than pushing the page.
      </Text>
    </div>
  ),
};

export const Drawers: Story = {
  parameters: { layout: "fullscreen" },
  render: () => {
    function Demo() {
      const [side, setSide] = useState<"left" | "right" | "top" | "bottom" | null>(null);
      return (
        <div className="grid min-h-screen place-items-center gap-6 p-10">
          <div className="flex flex-wrap justify-center gap-3">
            {(["left", "right", "top", "bottom"] as const).map((s) => (
              <Button key={s} size="sm" onClick={() => setSide(s)}>
                {s}
              </Button>
            ))}
          </div>

          <Drawer
            open={side !== null}
            onClose={() => setSide(null)}
            side={side ?? "right"}
            title="Flight plan"
            description="Slides in from the edge, over a locked page."
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={() => setSide(null)}>
                  Cancel
                </Button>
                <Button variant="sweep" size="sm" onClick={() => setSide(null)}>
                  Commit
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-6">
              <Field label="Destination">{(id) => <Input id={id} placeholder="Europa" />}</Field>
              <Field label="Notes">{(id) => <Textarea id={id} rows={5} />}</Field>
              <Switch label="Autonomous navigation" defaultChecked />
              <Text size="sm">
                The body scrolls on its own, so a long form never moves the page behind it.
              </Text>
            </div>
          </Drawer>
        </div>
      );
    }
    return <Demo />;
  },
};
