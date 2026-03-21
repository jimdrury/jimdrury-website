import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toggle } from "./toggle";

const meta = {
  title: "Forms/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Dark mode", id: "dark-mode" },
};

export const Checked: Story = {
  args: { label: "Notifications", id: "notifications", defaultChecked: true },
};
