import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Textarea } from "./textarea";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Notes", id: "notes" },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Message",
    id: "message",
    placeholder: "Type your message here...",
  },
};
