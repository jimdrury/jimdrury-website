import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { QuantityInput } from "./quantity-input";

const meta = {
  title: "Forms/QuantityInput",
  component: QuantityInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof QuantityInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 1, min: 0, max: 10 },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <QuantityInput {...args} value={value} onChange={setValue} />;
  },
};

export const AtMinimum: Story = {
  args: { value: 0, min: 0, max: 10 },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <QuantityInput {...args} value={value} onChange={setValue} />;
  },
};
