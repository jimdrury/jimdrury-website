import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkipLink } from "./skip-link";

const meta = {
  title: "Components/SkipLink",
  component: SkipLink,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SkipLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <SkipLink href="#main">Skip to main content</SkipLink>
      <p className="p-4 text-sm text-gray-500">
        Tab into this story to reveal the skip link.
      </p>
    </div>
  ),
};

export const CustomText: Story = {
  render: () => (
    <div>
      <SkipLink href="#content">Jump to content</SkipLink>
      <p className="p-4 text-sm text-gray-500">
        Tab into this story to reveal the skip link.
      </p>
    </div>
  ),
};
