import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VerticalMenu, VerticalMenuItem } from "./vertical-menu";

const meta = {
  title: "Components/VerticalMenu",
  component: VerticalMenu,
  subcomponents: { VerticalMenuItem },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VerticalMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <VerticalMenu>
      <VerticalMenuItem href="#home" active>
        Home
      </VerticalMenuItem>
      <VerticalMenuItem href="#about">About</VerticalMenuItem>
      <VerticalMenuItem href="#services">Services</VerticalMenuItem>
      <VerticalMenuItem href="#contact">Contact</VerticalMenuItem>
    </VerticalMenu>
  ),
};

export const NoActiveItem: Story = {
  render: () => (
    <VerticalMenu>
      <VerticalMenuItem href="#home">Home</VerticalMenuItem>
      <VerticalMenuItem href="#about">About</VerticalMenuItem>
      <VerticalMenuItem href="#services">Services</VerticalMenuItem>
    </VerticalMenu>
  ),
};
