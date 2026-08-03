import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionItem } from "./Accordion";
import { Badge, BadgeGroup } from "../Badge/Badge";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: "engineering" },
  render: (args) => (
    <div className="w-full max-w-xl">
      <Accordion {...args}>
        <AccordionItem value="engineering" title="Engineering" icon="✦" accent="#7dd3fc">
          Frontend systems, design engineering, and the occasional shader.
          <BadgeGroup className="mt-4">
            <Badge tone="cyan">React</Badge>
            <Badge tone="cyan">TypeScript</Badge>
          </BadgeGroup>
        </AccordionItem>
        <AccordionItem value="ai" title="AI" icon="◈" accent="#8b7cf6">
          Retrieval pipelines, evaluation harnesses, and agent tooling.
          <BadgeGroup className="mt-4">
            <Badge tone="violet">Python</Badge>
            <Badge tone="violet">RAG</Badge>
          </BadgeGroup>
        </AccordionItem>
        <AccordionItem value="photography" title="Photography" icon="✧" accent="#e8c47c">
          Portraiture, mostly available light.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const AllowMultiple: Story = {
  args: { allowMultiple: true, defaultValue: ["a", "b"] },
  render: (args) => (
    <div className="w-full max-w-xl">
      <Accordion {...args}>
        <AccordionItem value="a" title="First">
          Both panels can stay open at once.
        </AccordionItem>
        <AccordionItem value="b" title="Second">
          The height animates with a grid row, so nothing is measured in JS.
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
