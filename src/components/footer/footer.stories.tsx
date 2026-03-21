import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer, FooterColumn } from "./footer";

const meta = {
  title: "Components/Footer",
  component: Footer,
  subcomponents: { FooterColumn },
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Footer {...args}>
      <FooterColumn title="Product">
        <li>
          <a href="/features">Features</a>
        </li>
        <li>
          <a href="/pricing">Pricing</a>
        </li>
      </FooterColumn>
      <FooterColumn title="Company">
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/careers">Careers</a>
        </li>
      </FooterColumn>
      <FooterColumn title="Resources">
        <li>
          <a href="/docs">Docs</a>
        </li>
        <li>
          <a href="/blog">Blog</a>
        </li>
      </FooterColumn>
      <FooterColumn title="Legal">
        <li>
          <a href="/privacy">Privacy</a>
        </li>
        <li>
          <a href="/terms">Terms</a>
        </li>
      </FooterColumn>
    </Footer>
  ),
};
