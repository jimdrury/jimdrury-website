import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./divider";

describe("Divider", () => {
  it("renders a separator", () => {
    render(<Divider />);

    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(<Divider label="OR" />);

    expect(screen.getByText("OR")).toBeInTheDocument();
  });
});
