import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Button } from "@/components/button";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./modal";

const meta = {
  title: "Components/Modal",
  component: Modal,
  subcomponents: { ModalHeader, ModalBody, ModalFooter },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button type="button" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalHeader onClose={() => setOpen(false)}>
            Example Modal
          </ModalHeader>
          <ModalBody>
            <p>
              This is the modal body content. You can place any content here.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};
