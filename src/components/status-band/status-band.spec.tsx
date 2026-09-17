import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBand } from "./status-band";

describe("StatusBand", () => {
  it("renders the body content", () => {
    render(
      <StatusBand>
        <p>Head of Platform Innovation at Virgin Media O2.</p>
      </StatusBand>,
    );

    expect(
      screen.getByText("Head of Platform Innovation at Virgin Media O2."),
    ).toBeInTheDocument();
  });

  it("renders the optional badge alongside the body", () => {
    render(
      <StatusBand badge={<span>Now</span>}>
        <p>Currently shipping agentic engineering.</p>
      </StatusBand>,
    );

    expect(screen.getByText("Now")).toBeInTheDocument();
    expect(
      screen.getByText("Currently shipping agentic engineering."),
    ).toBeInTheDocument();
  });

  it("applies a custom className to the section", () => {
    render(
      <StatusBand className="custom-class" data-testid="status">
        <p>Body</p>
      </StatusBand>,
    );

    expect(screen.getByTestId("status")).toHaveClass("custom-class");
  });
});
