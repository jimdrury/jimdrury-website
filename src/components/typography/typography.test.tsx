import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typography } from "./typography";

describe("Typography", () => {
  it("renders", () => {
    render(<Typography data-testid="component">Hello</Typography>);

    expect(screen.getByTestId("component")).toBeInTheDocument();
  });

  it("uses predefined heading style for h1", () => {
    render(<Typography as="h1">Heading</Typography>);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveClass("text-3xl");
    expect(heading).toHaveClass("font-black");
  });

  it("ignores manual size and weight overrides for heading tags", () => {
    render(
      <Typography as="h2" size="sm" weight="normal">
        Heading
      </Typography>,
    );

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toHaveClass("text-2xl");
    expect(heading).toHaveClass("font-bold");
    expect(heading).not.toHaveClass("text-sm");
    expect(heading).not.toHaveClass("font-normal");
  });
});
