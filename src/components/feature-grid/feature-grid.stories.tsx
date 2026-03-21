import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaBolt, FaLock, FaRocket } from "react-icons/fa";
import { Feature, FeatureGrid } from "./feature-grid";

const meta = {
  title: "Components/FeatureGrid",
  component: FeatureGrid,
  subcomponents: { Feature },
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FeatureGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <FeatureGrid {...args}>
      <Feature icon={FaRocket} title="Fast">
        Lightning-fast performance out of the box.
      </Feature>
      <Feature icon={FaBolt} title="Powerful">
        Built with modern tools and best practices.
      </Feature>
      <Feature icon={FaLock} title="Secure">
        Enterprise-grade security baked in.
      </Feature>
    </FeatureGrid>
  ),
};
