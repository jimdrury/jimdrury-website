import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Label } from "./label";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Email Address", htmlFor: "email" },
};

export const Muted: Story = {
  args: { children: "Optional Field", htmlFor: "optional", tone: "muted" },
};
