import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header, HeaderLogo, HeaderNav } from "./header";

const meta = {
  title: "Components/Header",
  component: Header,
  subcomponents: { HeaderLogo, HeaderNav },
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Header {...args}>
      <HeaderLogo href="/">Acme Co.</HeaderLogo>
      <HeaderNav>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/blog">Blog</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </HeaderNav>
    </Header>
  ),
};

export const LogoOnly: Story = {
  render: (args) => (
    <Header {...args}>
      <HeaderLogo href="/">My Brand</HeaderLogo>
    </Header>
  ),
};
