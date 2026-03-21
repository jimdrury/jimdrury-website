import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./icon-button";

describe("IconButton", () => {
  it("renders", () => {
    render(<IconButton data-testid="component" />);

    expect(screen.getByTestId("component")).toBeInTheDocument();
  });

  it("calls click handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<IconButton onClick={onClick} />);
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
