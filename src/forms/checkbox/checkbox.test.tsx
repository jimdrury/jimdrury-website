import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders with label", () => {
    render(<Checkbox label="Accept terms" id="terms" />);
    expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
  });
});
