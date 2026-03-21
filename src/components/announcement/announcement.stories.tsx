import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Announcement } from "./announcement";

const meta = {
  title: "Components/Announcement",
  component: Announcement,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof Announcement>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "We just launched our new feature — check it out!",
  },
};

export const AsLink: Story = {
  render: () => (
    <Announcement asChild>
      <a href="/changelog">Version 2.0 is here — read the changelog</a>
    </Announcement>
  ),
};
