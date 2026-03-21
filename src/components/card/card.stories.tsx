import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardBody, CardFooter, CardHeader } from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
  subcomponents: { CardHeader, CardBody, CardFooter },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <strong className="text-xs/none font-bold uppercase">
          System Message
        </strong>
      </CardHeader>
      <CardBody>
        <h3 className="text-lg font-semibold text-black">Retro Window</h3>
        <p className="mt-2 text-sm text-pretty">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </CardBody>
      <CardFooter>
        <p className="text-sm text-gray-700">Footer content</p>
      </CardFooter>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <strong className="text-xs/none font-bold uppercase">Notice</strong>
      </CardHeader>
      <CardBody>
        <p className="text-sm">A card with just a header and body.</p>
      </CardBody>
    </Card>
  ),
};

export const BodyOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardBody>
        <h3 className="text-lg font-semibold">Simple Card</h3>
        <p className="mt-2 text-sm text-pretty">
          A minimal card with only body content.
        </p>
      </CardBody>
    </Card>
  ),
};
