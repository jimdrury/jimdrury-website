import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaHeart, FaStar } from "react-icons/fa";
import { Icon } from "./icon";

const meta = {
  title: "Components/Icon",
  component: Icon,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Icon>
      <FaStar />
    </Icon>
  ),
};

export const Small: Story = {
  render: () => (
    <Icon size="sm">
      <FaHeart />
    </Icon>
  ),
};

export const Large: Story = {
  render: () => (
    <Icon size="lg">
      <FaStar />
    </Icon>
  ),
};
