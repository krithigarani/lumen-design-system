import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NebulaBackdrop } from "./NebulaBackdrop";
import { Starfield } from "./Starfield";
import { LoaderScreen } from "../Loader/Loader";
import { OrbitSpinner } from "../Loader/OrbitSpinner";
import { Button } from "../Button/Button";
import { Heading, Text } from "../Text/Text";

const meta = {
  title: "Atmosphere/Backdrops",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nebula: Story = {
  render: () => (
    <div className="relative grid min-h-screen place-items-center">
      <NebulaBackdrop position="absolute" />
      {/* Content sits above the backdrop via its own stacking order. */}
      <Heading level={2} className="relative z-10">
        Pure-CSS nebula
      </Heading>
    </div>
  ),
};

export const Stars: Story = {
  render: () => (
    <div className="relative grid min-h-screen place-items-center">
      <NebulaBackdrop position="absolute" />
      <Starfield position="absolute" />
      <div className="relative z-10 text-center">
        <Heading level={2}>Starfield</Heading>
        <Text className="mt-3">Canvas stars that twinkle — and hold still under reduced motion.</Text>
      </div>
    </div>
  ),
};

export const Spinners: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center gap-16">
      <OrbitSpinner size="sm" />
      <OrbitSpinner size="md" />
      <OrbitSpinner size="lg" />
    </div>
  ),
};

export const Loader: Story = {
  render: () => {
    const [show, setShow] = useState(false);
    return (
      <div className="grid min-h-screen place-items-center">
        <Button onClick={() => setShow(true)}>Show loader</Button>
        {show && (
          <LoaderScreen
            ready
            holdAfterReady={2200}
            onDone={() => setShow(false)}
            lines={["Calibrating star charts", "Aligning orbits", "Engaging drive"]}
          />
        )}
      </div>
    );
  },
};
