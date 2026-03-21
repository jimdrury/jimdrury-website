import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Banner } from "./banner";

const meta = {
  title: "Components/Banner",
  component: Banner,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    children: "New feature available! Check out the latest updates.",
  },
} satisfies Meta<typeof Banner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dismissable: Story = {
  args: {
    onDismiss: () => {},
    children: "This banner can be dismissed.",
  },
};
