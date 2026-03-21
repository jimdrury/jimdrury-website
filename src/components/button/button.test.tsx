import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

const TestIcon = (props: { className?: string }) => (
  <svg data-testid="icon" viewBox="0 0 24 24" {...props} />
);

describe("Button", () => {
  it("renders", () => {
    render(
      <Button data-testid="component" type="button">
        Save
      </Button>,
    );

    expect(screen.getByTestId("component")).toBeInTheDocument();
  });

  it("applies the tertiary variant classes", () => {
    render(
      <Button data-testid="component" type="button" variant="tertiary">
        Go
      </Button>,
    );

    expect(screen.getByTestId("component")).toHaveClass("bg-green-300");
  });

  it("renders a start icon", () => {
    render(
      <Button type="button" icon={TestIcon}>
        Label
      </Button>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass("gap-2");
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders an end icon when iconPosition is end", () => {
    render(
      <Button type="button" icon={TestIcon} iconPosition="end">
        Next
      </Button>,
    );

    const btn = screen.getByRole("button");
    expect(
      btn.lastElementChild?.querySelector("[data-testid=icon]"),
    ).toBeInTheDocument();
  });

  it("visually hides label text when iconOnly is true", () => {
    render(
      <Button type="button" icon={TestIcon} iconOnly>
        Close
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("p-3");
    expect(screen.getByText("Close")).toHaveClass("sr-only");
  });
});
