import type { Meta, StoryObj } from "@storybook/react-vite";
import { Quote } from "./Quote/Quote";
import { DataList, DataRow } from "./DataList/DataList";
import { Avatar } from "./Avatar/Avatar";
import { EmptyState } from "./EmptyState/EmptyState";
import { ScrollArea } from "./ScrollArea/ScrollArea";
import { Divider } from "./Divider/Divider";
import { Card } from "./Card/Card";
import { Button } from "./Button/Button";

const meta = { title: "Components/Content" } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quotes: Story = {
  render: () => (
    <div className="w-full max-w-lg">
      <Quote author="A. Collaborator" authorRole="Design Lead">
        She has an unusual instinct for when an interface should get out of the way.
      </Quote>
    </div>
  ),
};

export const Data: Story = {
  render: () => (
    <Card className="w-full max-w-lg">
      <DataList>
        <DataRow label="Deep Learning Specialization" value="2024" />
        <DataRow label="AWS Solutions Architect" value="2023" />
        <DataRow label="Advanced React Patterns" value="2022" />
      </DataList>
    </Card>
  ),
};

export const Avatars: Story = {
  render: () => (
    <div className="flex items-center gap-10">
      <Avatar alt="Krithiga Rani" size="sm" ring="plain" />
      <Avatar alt="Krithiga Rani" size="md" />
      <Avatar alt="Krithiga Rani" size="lg" scanline float />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <EmptyState
      glyph="01"
      title="Nothing here yet"
      description="Portrait incoming"
      action={<Button size="sm">Upload</Button>}
      className="w-80"
    />
  ),
};

export const Dividers: Story = {
  render: () => (
    <div className="flex w-full max-w-lg flex-col gap-8">
      <Divider />
      <Divider label="Selected work" />
      <Divider label="Archive" align="left" />
    </div>
  ),
};

export const Scrollable: Story = {
  render: () => (
    <Card className="w-full max-w-lg">
      <ScrollArea maxHeight="12rem" fade="both">
        <div className="flex flex-col gap-3 pr-2">
          {Array.from({ length: 14 }, (_, i) => (
            <p key={i} className="text-sm text-muted">
              Row {i + 1} — the region fades at both edges to hint at more content.
            </p>
          ))}
        </div>
      </ScrollArea>
    </Card>
  ),
};
