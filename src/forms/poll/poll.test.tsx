import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Poll, PollOption } from "./poll";

describe("Poll", () => {
  it("renders the question as legend", () => {
    render(
      <Poll question="Favourite colour?">
        <PollOption value="red">Red</PollOption>
      </Poll>,
    );

    expect(
      screen.getByRole("group", { name: "Favourite colour?" }),
    ).toBeInTheDocument();
  });

  it("renders options as radios", () => {
    render(
      <Poll question="Pick one">
        <PollOption value="a">Option A</PollOption>
        <PollOption value="b">Option B</PollOption>
      </Poll>,
    );

    expect(
      screen.getByRole("radio", { name: /Option A/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: /Option B/i }),
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Poll question="Test" className="custom-class" data-testid="poll">
        <PollOption value="a">A</PollOption>
      </Poll>,
    );

    expect(screen.getByTestId("poll")).toHaveClass("custom-class");
  });

  it("groups radios with name", () => {
    render(
      <Poll question="Q" name="colour">
        <PollOption value="red">Red</PollOption>
        <PollOption value="blue">Blue</PollOption>
      </Poll>,
    );

    const radios = screen.getAllByRole("radio");
    for (const r of radios) {
      expect(r).toHaveAttribute("name", "colour");
    }
  });

  it("calls onValueChange when selection changes", () => {
    const onValueChange = vi.fn();
    render(
      <Poll question="Q" onValueChange={onValueChange}>
        <PollOption value="a">A</PollOption>
        <PollOption value="b">B</PollOption>
      </Poll>,
    );

    fireEvent.click(screen.getByRole("radio", { name: /B/i }));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });
});

describe("PollOption", () => {
  it("displays vote count when provided", () => {
    render(
      <Poll question="Q">
        <PollOption value="react" votes={42}>
          React
        </PollOption>
      </Poll>,
    );

    expect(screen.getByText("42 votes")).toBeInTheDocument();
  });

  it("does not display votes when omitted", () => {
    render(
      <Poll question="Q">
        <PollOption value="react">React</PollOption>
      </Poll>,
    );

    expect(screen.queryByText(/votes/)).toBeNull();
  });

  it("passes through additional props to the input", () => {
    render(
      <Poll question="Q">
        <PollOption value="x" data-testid="option-input">
          Test
        </PollOption>
      </Poll>,
    );

    expect(screen.getByTestId("option-input")).toBeInTheDocument();
  });
});
