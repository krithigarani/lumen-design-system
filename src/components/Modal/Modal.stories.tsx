import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";
import { Badge, BadgeGroup } from "../Badge/Badge";

const meta = {
  title: "Overlays/Modal",
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: false, onClose: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Cosmos"
          description="A scroll-driven journey through the solar system, built with React Three Fiber."
          accent="#7dd3fc"
        >
          <BadgeGroup className="mt-6">
            <Badge tone="cyan">React</Badge>
            <Badge tone="violet">Three.js</Badge>
            <Badge tone="gold">GLSL</Badge>
          </BadgeGroup>
          <div className="mt-8 flex justify-end">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </Modal>
      </div>
    );
  },
};

/**
 * Focus moves into the dialog, Escape closes it, and focus returns to the
 * trigger — all supplied by the native `<dialog>` element.
 */
export const Accessibility: Story = {
  args: { open: false, onClose: () => {} },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="grid min-h-[60vh] place-items-center gap-4">
        <p className="text-sm text-muted">
          Tab to the button, press Enter, then Escape. Focus returns here.
        </p>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Try Escape" accent="#e8c47c">
          <div className="mt-6 flex gap-3">
            <Button size="sm">First</Button>
            <Button size="sm">Second</Button>
          </div>
        </Modal>
      </div>
    );
  },
};
