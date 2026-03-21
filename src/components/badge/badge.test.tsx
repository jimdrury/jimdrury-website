import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

const TestIcon = (props: { className?: string }) => (
  <svg data-testid="icon" viewBox="0 0 24 24" {...props} />
);

describe("Badge", () => {
  it("renders text content", () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Badge variant="success">Done</Badge>);

    const badge = screen.getByText("Done");
    expect(badge).toHaveClass("bg-green-100");
  });

  it("defaults to info variant", () => {
    render(<Badge>Default</Badge>);

    const badge = screen.getByText("Default");
    expect(badge).toHaveClass("bg-blue-100");
  });

  it("merges custom className", () => {
    render(<Badge className="ml-2">Custom</Badge>);

    const badge = screen.getByText("Custom");
    expect(badge).toHaveClass("ml-2");
  });

  it("renders a supporting icon before the label", () => {
    const { container } = render(<Badge icon={TestIcon}>Labeled</Badge>);

    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
    expect(icon.parentElement).toHaveAttribute("aria-hidden");
    const badge = container.firstElementChild;
    expect(badge?.firstElementChild).toContainElement(icon);
    expect(badge?.querySelector("[data-testid=icon]")).toBeInTheDocument();
  });

  it("renders the icon after the label when iconPosition is end", () => {
    const { container } = render(
      <Badge icon={TestIcon} iconPosition="end">
        Next
      </Badge>,
    );

    const icon = screen.getByTestId("icon");
    const badge = container.firstElementChild;
    expect(badge?.lastElementChild).toBe(icon.parentElement);
  });
});
