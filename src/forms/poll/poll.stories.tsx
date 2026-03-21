import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Poll, PollOption } from "./poll";

const meta = {
  title: "Forms/Poll",
  component: Poll,
  subcomponents: { PollOption },
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    question: "What's your favourite framework?",
    name: "framework",
  },
} satisfies Meta<typeof Poll>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Poll {...args}>
      <PollOption value="react">React</PollOption>
      <PollOption value="vue">Vue</PollOption>
      <PollOption value="svelte">Svelte</PollOption>
    </Poll>
  ),
};

export const WithVotes: Story = {
  render: (args) => (
    <Poll {...args}>
      <PollOption value="react" votes={42}>
        React
      </PollOption>
      <PollOption value="vue" votes={28}>
        Vue
      </PollOption>
      <PollOption value="svelte" votes={15}>
        Svelte
      </PollOption>
    </Poll>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState("react");
    return (
      <Poll {...args} value={value} onValueChange={setValue}>
        <PollOption value="react">React</PollOption>
        <PollOption value="vue">Vue</PollOption>
        <PollOption value="svelte">Svelte</PollOption>
      </Poll>
    );
  },
};
