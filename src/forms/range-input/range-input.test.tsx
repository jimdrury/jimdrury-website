import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RangeInput } from "./range-input";

describe("RangeInput", () => {
  it("renders with label", () => {
    render(<RangeInput label="Volume" id="volume" />);
    expect(screen.getByLabelText("Volume")).toBeInTheDocument();
  });
});
