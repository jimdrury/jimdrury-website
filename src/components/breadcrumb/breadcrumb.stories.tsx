import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumb, BreadcrumbItem } from "./breadcrumb";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  subcomponents: { BreadcrumbItem },
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb homeHref="/">
      <BreadcrumbItem href="/category">Category</BreadcrumbItem>
      <BreadcrumbItem href="/category/product">Product</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const WithCurrentPage: Story = {
  render: () => (
    <Breadcrumb homeHref="/">
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem active>Current Page</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const TextOnlyTrail: Story = {
  name: "Without home icon",
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem active>Current Page</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const SingleItem: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem active>Home</BreadcrumbItem>
    </Breadcrumb>
  ),
};
