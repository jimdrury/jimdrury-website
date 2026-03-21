import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Typography } from "./typography";

const meta = {
  title: "Components/Typography",
  component: Typography,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Default paragraph text" },
};

export const Heading: Story = {
  args: { as: "h1", size: "3xl", weight: "bold", children: "Page Heading" },
};

export const Small: Story = {
  args: { size: "sm", children: "Small text" },
};

export const Bold: Story = {
  args: { weight: "bold", children: "Bold text" },
};
