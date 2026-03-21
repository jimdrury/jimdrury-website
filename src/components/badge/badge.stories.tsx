import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { Badge } from "./badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { children: "Info", variant: "info" },
};

export const Success: Story = {
  args: { children: "Success", variant: "success" },
};

export const ErrorVariant: Story = {
  args: { children: "Error", variant: "error" },
};

export const Warning: Story = {
  args: { children: "Warning", variant: "warning" },
};

export const WithIcon: Story = {
  args: { children: "Verified", variant: "success" },
  render: (args) => <Badge {...args} icon={FaCheck} />,
};

export const IconEnd: Story = {
  args: { children: "Attention", variant: "warning", iconPosition: "end" },
  render: (args) => <Badge {...args} icon={FaExclamationTriangle} />,
};
