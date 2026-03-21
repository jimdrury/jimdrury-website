import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "../button/button";
import { Toast } from "./toast";
import { useToast } from "./use-toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    children: "This is a toast notification.",
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { variant: "info" },
};

export const Success: Story = {
  args: { variant: "success", children: "Changes saved successfully." },
};

export const ErrorVariant: Story = {
  args: { variant: "error", children: "Failed to save changes." },
};

export const Dismissable: Story = {
  args: {
    variant: "info",
    onDismiss: () => {},
    children: "You can dismiss this toast.",
  },
};

export const TriggeredBottomRight: Story = {
  render: () => {
    const { toasts, toast, dismiss } = useToast();

    return (
      <div className="min-h-40">
        <Button
          type="button"
          onClick={() =>
            toast({
              message: "Changes saved successfully.",
              variant: "success",
            })
          }
        >
          Trigger Toast
        </Button>

        <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2">
          {toasts.map((item) => (
            <Toast
              key={item.id}
              variant={item.variant}
              onDismiss={() => dismiss(item.id)}
              className="pointer-events-auto"
            >
              {item.message}
            </Toast>
          ))}
        </div>
      </div>
    );
  },
};
