import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./link";

const TestIcon = (props: { className?: string }) => (
  <svg data-testid="icon" viewBox="0 0 24 24" {...props} />
);

describe("Link", () => {
  it("renders", () => {
    render(
      <Link href="/docs" data-testid="component">
        Docs
      </Link>,
    );

    expect(screen.getByTestId("component")).toBeInTheDocument();
  });

  it("renders a start icon", () => {
    render(
      <Link href="/out" icon={TestIcon}>
        External
      </Link>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveClass("inline-flex");
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders an end icon when iconPosition is end", () => {
    render(
      <Link href="/next" icon={TestIcon} iconPosition="end">
        Next
      </Link>,
    );

    const link = screen.getByRole("link");
    expect(
      link.lastElementChild?.querySelector("[data-testid=icon]"),
    ).toBeInTheDocument();
  });
});
