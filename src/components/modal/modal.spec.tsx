import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "./modal";

describe("Modal", () => {
  it("renders the dialog element", () => {
    render(<Modal data-testid="modal" />);
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("renders children inside the dialog", () => {
    render(
      <Modal data-testid="modal">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("calls showModal when open and close when closed", () => {
    const showModalSpy = vi.fn();
    const closeSpy = vi.fn();
    const originalShowModal = HTMLDialogElement.prototype.showModal;
    const originalClose = HTMLDialogElement.prototype.close;

    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value: showModalSpy,
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value: closeSpy,
    });

    const { rerender } = render(<Modal open={false} data-testid="modal" />);
    expect(closeSpy).toHaveBeenCalledTimes(1);

    rerender(<Modal open data-testid="modal" />);
    expect(showModalSpy).toHaveBeenCalledTimes(1);

    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value: originalShowModal,
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value: originalClose,
    });
  });

  it("does not throw when dialog APIs are unavailable", () => {
    const originalShowModal = HTMLDialogElement.prototype.showModal;
    const originalClose = HTMLDialogElement.prototype.close;

    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value: undefined,
    });

    expect(() => render(<Modal open data-testid="modal" />)).not.toThrow();

    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
      configurable: true,
      value: originalShowModal,
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
      configurable: true,
      value: originalClose,
    });
  });
});

describe("ModalHeader", () => {
  it("renders the title", () => {
    render(<ModalHeader>My Title</ModalHeader>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders a close button when onClose is provided", () => {
    render(<ModalHeader onClose={() => {}}>Title</ModalHeader>);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("renders custom close label", () => {
    render(
      <ModalHeader onClose={() => {}} closeLabel="Dismiss">
        Title
      </ModalHeader>,
    );
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("does not render a close button without onClose", () => {
    render(<ModalHeader>Title</ModalHeader>);
    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
  });
});

describe("ModalBody", () => {
  it("renders children", () => {
    render(<ModalBody>Body content</ModalBody>);
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });
});

describe("ModalFooter", () => {
  it("renders children", () => {
    render(<ModalFooter>Footer content</ModalFooter>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });
});
