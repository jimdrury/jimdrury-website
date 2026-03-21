import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Banner } from "./banner";

describe("Banner", () => {
  it("renders children text", () => {
    render(<Banner>Important announcement</Banner>);

    expect(screen.getByText("Important announcement")).toBeInTheDocument();
  });

  it("renders dismiss button when onDismiss is provided", () => {
    const onDismiss = vi.fn();
    render(<Banner onDismiss={onDismiss}>Dismissable</Banner>);

    const button = screen.getByRole("button", { name: "Dismiss" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("does not render dismiss button without onDismiss", () => {
    render(<Banner>Static</Banner>);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("applies custom className", () => {
    render(
      <Banner className="custom-class" data-testid="banner">
        Test
      </Banner>,
    );

    expect(screen.getByTestId("banner")).toHaveClass("custom-class");
  });

  it("passes through additional props", () => {
    render(<Banner data-testid="my-banner">Content</Banner>);

    expect(screen.getByTestId("my-banner")).toBeInTheDocument();
  });
});
