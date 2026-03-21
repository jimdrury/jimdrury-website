import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "./link";

const meta = {
  title: "Components/Link",
  component: Link,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Read more", href: "/docs" },
};

export const Subtle: Story = {
  args: { children: "Learn more", href: "/learn-more", variant: "subtle" },
};

export const WithIcon: Story = {
  args: {
    children: "Read documentation",
    href: "/docs",
  },
  render: (args) => <Link {...args} icon={FaExternalLinkAlt} />,
};

export const IconEnd: Story = {
  args: {
    children: "Continue",
    href: "/next",
    iconPosition: "end",
  },
  render: (args) => <Link {...args} icon={FaArrowRight} />,
};
