import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FileUploader } from "./file-uploader";

const meta = {
  title: "Forms/FileUploader",
  component: FileUploader,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { id: "file-upload" },
};

export const WithLabel: Story = {
  args: { label: "Upload your CV", id: "cv-upload" },
};

export const AcceptImages: Story = {
  args: { label: "Upload an image", id: "image-upload", accept: "image/*" },
};
