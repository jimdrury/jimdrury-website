import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./label";

describe("Label", () => {
  it("renders", () => {
    render(
      <Label data-testid="component" htmlFor="email">
        Email
      </Label>,
    );

    expect(screen.getByTestId("component")).toBeInTheDocument();
  });
});
