import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Toast } from "./toast";

describe("Toast", () => {
  it("renders with the alert role", () => {
    render(<Toast>Message</Toast>);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders children text", () => {
    render(<Toast>Saved successfully</Toast>);

    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Toast variant="error">Error</Toast>);

    expect(screen.getByRole("alert")).toHaveClass("bg-red-100");
  });

  it("defaults to info variant", () => {
    render(<Toast>Info</Toast>);

    expect(screen.getByRole("alert")).toHaveClass("bg-blue-100");
  });

  it("renders dismiss button when onDismiss is provided", () => {
    const onDismiss = vi.fn();
    render(<Toast onDismiss={onDismiss}>Dismissable</Toast>);

    const button = screen.getByRole("button", { name: "Dismiss" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("does not render dismiss button without onDismiss", () => {
    render(<Toast>Static</Toast>);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("applies custom className", () => {
    render(<Toast className="custom-class">Test</Toast>);

    expect(screen.getByRole("alert")).toHaveClass("custom-class");
  });
});
