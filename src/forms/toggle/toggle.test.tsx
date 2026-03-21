import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toggle } from "./toggle";

describe("Toggle", () => {
  it("renders with label", () => {
    render(<Toggle label="Dark mode" id="dark-mode" />);
    expect(screen.getByLabelText("Dark mode")).toBeInTheDocument();
  });
});
