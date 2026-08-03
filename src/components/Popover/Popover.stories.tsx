import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Popover, MenuItem } from "./Popover";
import { Button } from "../Button/Button";

const meta = {
  title: "Overlays/Popover",
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const chapters = ["Mercury", "Venus", "Mars", "Jupiter"];

/** Light dismiss, Escape and top-layer painting come from the native Popover API. */
export const Menu: Story = {
  args: { trigger: <Button>Chapters</Button> },
  render: () => {
    const [active, setActive] = useState("Venus");
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Popover role="menu" trigger={<Button>Chapters</Button>}>
          {chapters.map((c) => (
            <MenuItem key={c} active={c === active} onClick={() => setActive(c)}>
              {c}
            </MenuItem>
          ))}
        </Popover>
      </div>
    );
  },
};

export const Panel: Story = {
  args: { trigger: <Button variant="icon" aria-label="Details">✦</Button> },
  render: () => (
    <div className="grid min-h-[50vh] place-items-center">
      <Popover
        placement="bottom-end"
        trigger={
          <Button variant="icon" aria-label="Details">
            ✦
          </Button>
        }
        className="w-64"
      >
        <p className="p-2 text-sm text-muted">
          A floating panel. Click outside or press Escape to dismiss.
        </p>
      </Popover>
    </div>
  ),
};
