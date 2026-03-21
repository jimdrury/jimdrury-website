import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stat } from "./stat";

describe("Stat", () => {
  it("renders value and label", () => {
    render(<Stat label="Users" value="1,234" />);

    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("renders change with up trend", () => {
    render(
      <Stat label="Revenue" value="$500" change="10% increase" trend="up" />,
    );

    expect(screen.getByText(/10% increase/)).toBeInTheDocument();
    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });

  it("renders change with down trend", () => {
    render(
      <Stat label="Errors" value="23" change="5% decrease" trend="down" />,
    );

    expect(screen.getByText(/↓/)).toBeInTheDocument();
  });

  it("does not render change when not provided", () => {
    const { container } = render(<Stat label="Count" value="99" />);

    expect(container.querySelectorAll("p")).toHaveLength(2);
  });
});
