import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RangeInput } from "./range-input";

const meta = {
  title: "Forms/RangeInput",
  component: RangeInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Volume", id: "volume" },
};

export const WithMinMax: Story = {
  args: {
    label: "Brightness",
    id: "brightness",
    min: 0,
    max: 100,
    defaultValue: 50,
  },
};
