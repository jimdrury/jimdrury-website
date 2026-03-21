import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders with label", () => {
    render(<Textarea label="Notes" id="notes" />);
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });
});
