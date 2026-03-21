import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta = {
  title: "Forms/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Email", type: "email", id: "email" },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Email",
    type: "email",
    id: "email-placeholder",
    placeholder: "you@example.com",
  },
};
