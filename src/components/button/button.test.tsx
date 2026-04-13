import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

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

    expect(screen.getByTestId("component")).toHaveClass(
      "bg-[var(--bg-accent-blue)]",
    );
  });

  it("applies expand classes when expand is true", () => {
    render(
      <Button type="button" expand>
        Read more
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Read more" })).toHaveClass(
      "before:absolute",
      "before:inset-0",
      "before:content-['']",
    );
  });
});
