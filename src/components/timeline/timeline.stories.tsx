import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Timeline, TimelineItem } from "./timeline";

const meta = {
  title: "Components/Timeline",
  component: Timeline,
  subcomponents: { TimelineItem },
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Timeline>
      <TimelineItem date="March 2026" title="Project launched">
        Initial release with core features.
      </TimelineItem>
      <TimelineItem date="February 2026" title="Beta testing">
        Invited early adopters to test the platform.
      </TimelineItem>
      <TimelineItem date="January 2026" title="Development started">
        Kicked off the project with a small team.
      </TimelineItem>
    </Timeline>
  ),
};
