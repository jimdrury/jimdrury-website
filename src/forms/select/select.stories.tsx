import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./select";

const meta = {
  title: "Forms/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Headliner", id: "headliner" },
  render: (args) => (
    <Select {...args}>
      <option value="">Please select</option>
      <option value="JM">John Mayer</option>
      <option value="ED">Ed Sheeran</option>
      <option value="TS">Taylor Swift</option>
    </Select>
  ),
};
