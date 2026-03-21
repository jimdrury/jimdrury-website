import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Surface } from "./surface";

const meta = {
  title: "Components/Surface",
  component: Surface,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Default surface content" },
};

export const Raised: Story = {
  args: { variant: "raised", children: "Raised surface" },
};

export const Flat: Story = {
  args: { variant: "flat", children: "Flat surface (no shadow)" },
};

export const SmallPadding: Story = {
  args: { padding: "sm", children: "Small padding" },
};
