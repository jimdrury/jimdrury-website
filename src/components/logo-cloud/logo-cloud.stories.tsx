import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaAws, FaDocker, FaGithub, FaReact, FaSlack } from "react-icons/fa";
import { LogoCloud } from "./logo-cloud";

const meta = {
  title: "Components/LogoCloud",
  component: LogoCloud,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    title: "Trusted by industry leaders",
  },
} satisfies Meta<typeof LogoCloud>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <LogoCloud {...args}>
      <FaGithub className="size-10 text-gray-700" />
      <FaReact className="size-10 text-gray-700" />
      <FaAws className="size-10 text-gray-700" />
      <FaDocker className="size-10 text-gray-700" />
      <FaSlack className="size-10 text-gray-700" />
    </LogoCloud>
  ),
};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
  },
  render: (args) => (
    <LogoCloud {...args}>
      <FaGithub className="size-10 text-gray-700" />
      <FaReact className="size-10 text-gray-700" />
      <FaAws className="size-10 text-gray-700" />
    </LogoCloud>
  ),
};
