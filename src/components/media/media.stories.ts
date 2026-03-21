import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Media } from "./media";

const meta = {
  title: "Components/Media",
  component: Media,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Media>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://placehold.co/600x400",
    alt: "Placeholder image",
    caption: "A sample image with a caption",
  },
};

export const WithoutCaption: Story = {
  args: {
    src: "https://placehold.co/600x400",
    alt: "Placeholder image without caption",
  },
};
