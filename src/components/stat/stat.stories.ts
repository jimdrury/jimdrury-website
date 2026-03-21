import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Stat } from "./stat";

const meta = {
  title: "Components/Stat",
  component: Stat,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Stat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Total Users", value: "12,340" },
};

export const WithChange: Story = {
  args: {
    label: "Revenue",
    value: "$48,200",
    change: "12% from last month",
    trend: "up",
  },
};

export const NegativeChange: Story = {
  args: {
    label: "Bounce Rate",
    value: "42%",
    change: "3% from last week",
    trend: "down",
  },
};
