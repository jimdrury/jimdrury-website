import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RuleBox, RuleMarks } from "./rule-box";

describe("RuleBox", () => {
  it("renders children and four overflowing rules", () => {
    const { container } = render(
      <RuleBox data-testid="box">
        <p>Content</p>
      </RuleBox>,
    );

    expect(screen.getByTestId("box")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(container.querySelectorAll(".rule-mark-h")).toHaveLength(2);
    expect(container.querySelectorAll(".rule-mark-v")).toHaveLength(2);
  });

  it("marks the host as growable when grow is set", () => {
    render(
      <RuleBox grow data-testid="grow-box">
        Body
      </RuleBox>,
    );

    expect(screen.getByTestId("grow-box")).toHaveAttribute("data-grow", "true");
  });
});

describe("RuleMarks", () => {
  it("renders hidden registration marks", () => {
    const { container } = render(
      <div className="relative">
        <RuleMarks />
      </div>,
    );

    const marks = container.querySelector("[aria-hidden]");
    expect(marks).toBeInTheDocument();
    expect(container.querySelectorAll(".rule-mark-h")).toHaveLength(2);
    expect(container.querySelectorAll(".rule-mark-v")).toHaveLength(2);
  });

  it("renders four corner ticks in the corners variant", () => {
    const { container } = render(<RuleMarks variant="corners" />);

    expect(container.querySelectorAll(".rule-mark-h")).toHaveLength(0);
    expect(container.querySelectorAll("[aria-hidden] > span")).toHaveLength(4);
  });
});
