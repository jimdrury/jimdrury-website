import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaDownload, FaSave } from "react-icons/fa";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Click Here",
    asChild: false,
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: { children: "Secondary Button", variant: "secondary" },
};

export const Tertiary: Story = {
  args: { children: "Tertiary Button", variant: "tertiary" },
};

export const Ghost: Story = {
  args: { children: "Ghost Button", variant: "ghost" },
};

export const WithIcon: Story = {
  args: { children: "Save", type: "button" },
  render: (args) => <Button {...args} icon={FaSave} />,
};

export const IconEnd: Story = {
  args: { children: "Download", type: "button", iconPosition: "end" },
  render: (args) => <Button {...args} icon={FaDownload} />,
};

export const IconOnly: Story = {
  args: { children: "Save", type: "button", iconOnly: true },
  render: (args) => <Button {...args} icon={FaSave} />,
};
