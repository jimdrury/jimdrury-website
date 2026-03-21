import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "./select";

describe("Select", () => {
  it("renders with label and options", () => {
    render(
      <Select label="Headliner" id="headliner">
        <option value="">Please select</option>
        <option value="JM">John Mayer</option>
      </Select>,
    );
    expect(screen.getByLabelText("Headliner")).toBeInTheDocument();
    expect(screen.getByText("John Mayer")).toBeInTheDocument();
  });
});
