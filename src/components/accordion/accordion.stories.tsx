import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaBolt, FaQuestionCircle, FaRocket } from "react-icons/fa";
import { Accordion, AccordionItem } from "./accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  subcomponents: { AccordionItem },
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

const shortBody = (
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt similique,
    quae hic dicta quo facere facilis praesentium a sunt.
  </p>
);

export const Default: Story = {
  render: () => (
    <Accordion>
      <AccordionItem title="What are the basic features?" open>
        {shortBody}
      </AccordionItem>
      <AccordionItem title="How do I get started?">{shortBody}</AccordionItem>
      <AccordionItem title="What support options are available?">
        {shortBody}
      </AccordionItem>
    </Accordion>
  ),
};

export const WithLeadingIcons: Story = {
  name: "With leading icons",
  render: () => (
    <Accordion>
      <AccordionItem
        title="What are the basic features?"
        icon={FaQuestionCircle}
        open
      >
        {shortBody}
      </AccordionItem>
      <AccordionItem title="How do I get started?" icon={FaRocket}>
        {shortBody}
      </AccordionItem>
      <AccordionItem title="What about performance?" icon={FaBolt}>
        {shortBody}
      </AccordionItem>
    </Accordion>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Accordion grouped>
      <AccordionItem title="What are the basic features?">
        {shortBody}
      </AccordionItem>
      <AccordionItem title="How do I get started?" open>
        {shortBody}
      </AccordionItem>
      <AccordionItem title="What support options are available?">
        {shortBody}
      </AccordionItem>
    </Accordion>
  ),
};
