import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DetailsItem, DetailsList } from "./details-list";

const meta = {
  title: "Components/DetailsList",
  component: DetailsList,
  subcomponents: { DetailsItem },
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof DetailsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DetailsList>
      <DetailsItem term="Name">Alice Johnson</DetailsItem>
      <DetailsItem term="Email">alice@example.com</DetailsItem>
      <DetailsItem term="Role">Engineer</DetailsItem>
      <DetailsItem term="Status">Active</DetailsItem>
    </DetailsList>
  ),
};
