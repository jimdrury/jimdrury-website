import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlogCard } from "./blog-card";

const meta = {
  title: "Components/BlogCard",
  component: BlogCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    title: "Getting Started with Neobrutalism",
    category: "Design",
    excerpt:
      "Learn how to build bold, retro-inspired interfaces using modern CSS and component patterns.",
    date: "April 1, 2025",
    dateTime: "2025-04-01",
    href: "/blog/getting-started-with-neobrutalism",
    imageSrc: "https://picsum.photos/1600/900",
    imageAlt: "Random placeholder landscape photo",
    imageWidth: 1600,
    imageHeight: 900,
    imageLoading: "eager",
    imageFetchPriority: "high",
  },
} satisfies Meta<typeof BlogCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutDate: Story = {
  args: {
    date: undefined,
    dateTime: undefined,
  },
};

export const WithoutExcerpt: Story = {
  args: {
    excerpt: undefined,
  },
};

export const LongExcerpt: Story = {
  args: {
    excerpt:
      "This is a much longer excerpt that should be clamped to two lines. It demonstrates how the line-clamp utility works to keep the card layout consistent across different content lengths in the grid.",
  },
};
