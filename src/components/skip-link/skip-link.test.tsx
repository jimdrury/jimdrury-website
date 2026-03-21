import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkipLink } from "./skip-link";

describe("SkipLink", () => {
  it("renders children text", () => {
    render(<SkipLink href="#main">Skip to main content</SkipLink>);

    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
  });

  it("renders a non-link element when href is omitted", () => {
    render(<SkipLink>Skip to main content</SkipLink>);

    expect(screen.queryByRole("link")).toBeNull();
  });

  it("accepts custom children", () => {
    render(<SkipLink>Jump to content</SkipLink>);

    expect(screen.getByText("Jump to content")).toBeInTheDocument();
  });

  it("accepts a custom href", () => {
    render(<SkipLink href="#content">Skip</SkipLink>);

    expect(screen.getByRole("link")).toHaveAttribute("href", "#content");
  });
});
