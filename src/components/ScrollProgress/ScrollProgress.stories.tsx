import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ScrollProgress } from "./ScrollProgress";
import { DotNav } from "../DotNav/DotNav";
import { ScrollCue } from "../ScrollCue/ScrollCue";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { Heading } from "../Text/Text";

const meta = {
  title: "Motion/ScrollProgress",
  component: ScrollProgress,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ScrollProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

const sections = [
  { id: "mercury", label: "Mercury" },
  { id: "venus", label: "Venus" },
  { id: "mars", label: "Mars" },
  { id: "jupiter", label: "Jupiter" },
];

export const Bar: Story = {
  args: { showReadout: true, label: "Orbit" },
  render: (args) => (
    <div>
      <ScrollProgress {...args} />
      {sections.map((s) => (
        <section key={s.id} className="grid h-screen place-items-center">
          <Heading level={2}>{s.label}</Heading>
        </section>
      ))}
    </div>
  ),
};

/** The progress bar, a scroll-spied dot rail, and a self-hiding cue together. */
export const WithNavigation: Story = {
  render: () => {
    const activeId = useScrollSpy(sections.map((s) => s.id));
    return (
      <div>
        <ScrollProgress showReadout label="Journey" />
        <nav className="fixed top-1/2 right-6 z-50 -translate-y-1/2">
          <DotNav
            items={sections}
            activeId={activeId}
            navLabel="Journey chapters"
            onSelect={(id) =>
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
            }
          />
        </nav>
        <ScrollCue className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 flex-col items-center gap-3" />
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="grid h-screen place-items-center">
            <Heading level={2}>{s.label}</Heading>
          </section>
        ))}
      </div>
    );
  },
};
