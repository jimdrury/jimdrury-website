import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  Alert,
  AlertBody,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "./alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  subcomponents: { AlertBody, AlertIcon, AlertTitle, AlertDescription },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: { variant: "info" },
  render: (args) => (
    <Alert {...args}>
      <AlertIcon>
        <FaInfoCircle className="size-5" />
      </AlertIcon>
      <AlertBody>
        <AlertTitle>Heads up</AlertTitle>
      </AlertBody>
    </Alert>
  ),
};

export const ContentOnly: Story = {
  args: { variant: "success" },
  render: (args) => (
    <Alert {...args}>
      <AlertIcon>
        <FaCheckCircle className="size-5" />
      </AlertIcon>
      <AlertBody>
        <AlertDescription>
          Your changes were saved. You can keep editing or leave this page.
        </AlertDescription>
      </AlertBody>
    </Alert>
  ),
};

export const TitleAndContent: Story = {
  args: { variant: "warning" },
  render: (args) => (
    <Alert {...args}>
      <AlertIcon>
        <FaExclamationTriangle className="size-5" />
      </AlertIcon>
      <AlertBody>
        <AlertTitle>Review required</AlertTitle>
        <AlertDescription>
          Some fields are missing or invalid. Fix them before submitting the
          form.
        </AlertDescription>
      </AlertBody>
    </Alert>
  ),
};

export const Info: Story = {
  args: { variant: "info" },
  render: (args) => (
    <Alert {...args}>
      <AlertIcon>
        <FaInfoCircle className="size-5" />
      </AlertIcon>
      <AlertBody>
        <AlertDescription>This is an informational message.</AlertDescription>
      </AlertBody>
    </Alert>
  ),
};

export const Success: Story = {
  args: { variant: "success" },
  render: (args) => (
    <Alert {...args}>
      <AlertIcon>
        <FaCheckCircle className="size-5" />
      </AlertIcon>
      <AlertBody>
        <AlertDescription>Operation completed successfully.</AlertDescription>
      </AlertBody>
    </Alert>
  ),
};

export const ErrorVariant: Story = {
  args: { variant: "error" },
  render: (args) => (
    <Alert {...args}>
      <AlertIcon>
        <FaTimesCircle className="size-5" />
      </AlertIcon>
      <AlertBody>
        <AlertDescription>
          Something went wrong. Please try again.
        </AlertDescription>
      </AlertBody>
    </Alert>
  ),
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: (args) => (
    <Alert {...args}>
      <AlertIcon>
        <FaExclamationTriangle className="size-5" />
      </AlertIcon>
      <AlertBody>
        <AlertDescription>Please review before continuing.</AlertDescription>
      </AlertBody>
    </Alert>
  ),
};
