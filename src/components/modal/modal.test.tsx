import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
