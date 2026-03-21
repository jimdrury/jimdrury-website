import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typography } from "./typography";

describe("Typography", () => {
  it("renders", () => {
    render(<Typography data-testid="component">Hello</Typography>);

    expect(screen.getByTestId("component")).toBeInTheDocument();
  });
});
