import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "./dropdown";

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,
  subcomponents: { DropdownTrigger, DropdownContent, DropdownItem },
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger>Options</DropdownTrigger>
      <DropdownContent>
        <DropdownItem>Edit</DropdownItem>
        <DropdownItem>Duplicate</DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};
