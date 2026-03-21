import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SideMenu, SideMenuItem } from "./side-menu";

const meta = {
  title: "Components/SideMenu",
  component: SideMenu,
  subcomponents: { SideMenuItem },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SideMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SideMenu>
      <SideMenuItem href="#dashboard" active>
        Dashboard
      </SideMenuItem>
      <SideMenuItem href="#settings">Settings</SideMenuItem>
      <SideMenuItem href="#profile">Profile</SideMenuItem>
      <SideMenuItem href="#logout">Logout</SideMenuItem>
    </SideMenu>
  ),
};

export const NoActiveItem: Story = {
  render: () => (
    <SideMenu>
      <SideMenuItem href="#dashboard">Dashboard</SideMenuItem>
      <SideMenuItem href="#settings">Settings</SideMenuItem>
      <SideMenuItem href="#profile">Profile</SideMenuItem>
    </SideMenu>
  ),
};
