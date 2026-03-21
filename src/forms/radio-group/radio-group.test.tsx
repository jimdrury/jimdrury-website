import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RadioGroup, RadioOption } from "./radio-group";

describe("RadioGroup", () => {
  it("renders options with labels", () => {
    render(
      <RadioGroup legend="Colour">
        <RadioOption label="Red" id="red" name="colour" value="red" />
        <RadioOption label="Blue" id="blue" name="colour" value="blue" />
      </RadioGroup>,
    );

    expect(screen.getByLabelText("Red")).toBeInTheDocument();
    expect(screen.getByLabelText("Blue")).toBeInTheDocument();
  });
});
