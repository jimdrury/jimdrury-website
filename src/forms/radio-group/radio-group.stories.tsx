import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadioGroup, RadioOption } from "./radio-group";

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  subcomponents: { RadioOption },
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { legend: "Favourite colour" },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioOption label="Red" id="red" name="colour" value="red" />
      <RadioOption label="Green" id="green" name="colour" value="green" />
      <RadioOption label="Blue" id="blue" name="colour" value="blue" />
    </RadioGroup>
  ),
};

export const WithDefault: Story = {
  args: { legend: "Size" },
  render: (args) => (
    <RadioGroup {...args}>
      <RadioOption label="Small" id="sm" name="size" value="sm" />
      <RadioOption
        label="Medium"
        id="md"
        name="size"
        value="md"
        defaultChecked
      />
      <RadioOption label="Large" id="lg" name="size" value="lg" />
    </RadioGroup>
  ),
};
