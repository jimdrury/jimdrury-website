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
    caption: "A sample image with a caption",
  },
  render: (args) => (
    <Media {...args}>
      {/* biome-ignore lint/performance/noImgElement: Story preview uses plain img fixture */}
      <img src="https://placehold.co/600x400" alt="Placeholder media" />
    </Media>
  ),
};

export const WithoutCaption: Story = {
  render: () => (
    <Media>
      {/* biome-ignore lint/performance/noImgElement: Story preview uses plain img fixture */}
      <img
        src="https://placehold.co/600x400"
        alt="Placeholder media without caption"
      />
    </Media>
  ),
};
