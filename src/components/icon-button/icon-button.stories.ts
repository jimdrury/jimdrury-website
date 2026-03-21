import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { IconButton } from "./icon-button";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Add item" },
};

export const Outlined: Story = {
  args: { label: "Add item", variant: "outlined" },
};

export const Ghost: Story = {
  args: { label: "Add item", variant: "ghost" },
};

export const Small: Story = {
  args: { label: "Add item", size: "sm" },
};

export const Large: Story = {
  args: { label: "Add item", size: "lg" },
};
