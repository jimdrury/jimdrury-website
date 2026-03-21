import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TabContent, TabList, Tabs, TabTrigger } from "./tab";

const meta = {
  title: "Components/Tab",
  component: Tabs,
  subcomponents: { TabList, TabTrigger, TabContent },
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs>
      <TabList>
        <TabTrigger index={0}>Profile</TabTrigger>
        <TabTrigger index={1}>Account</TabTrigger>
        <TabTrigger index={2}>Settings</TabTrigger>
      </TabList>
      <TabContent index={0}>
        <p>Profile content goes here.</p>
      </TabContent>
      <TabContent index={1}>
        <p>Account content goes here.</p>
      </TabContent>
      <TabContent index={2}>
        <p>Settings content goes here.</p>
      </TabContent>
    </Tabs>
  ),
};

export const SecondTabActive: Story = {
  render: () => (
    <Tabs defaultIndex={1}>
      <TabList>
        <TabTrigger index={0}>Profile</TabTrigger>
        <TabTrigger index={1}>Account</TabTrigger>
        <TabTrigger index={2}>Settings</TabTrigger>
      </TabList>
      <TabContent index={0}>
        <p>Profile content goes here.</p>
      </TabContent>
      <TabContent index={1}>
        <p>Account content goes here.</p>
      </TabContent>
      <TabContent index={2}>
        <p>Settings content goes here.</p>
      </TabContent>
    </Tabs>
  ),
};
