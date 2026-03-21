import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Surface } from "./surface";

describe("Surface", () => {
  it("renders", () => {
    render(<Surface data-testid="component" />);

    expect(screen.getByTestId("component")).toBeInTheDocument();
  });
});
