import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuantityInput } from "./quantity-input";

describe("QuantityInput", () => {
  it("renders value and buttons", () => {
    render(<QuantityInput value={3} onChange={vi.fn()} />);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("decrements and increments value when buttons are clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<QuantityInput value={6} onChange={onChange} min={5} max={8} />);

    const [decrementButton, incrementButton] = screen.getAllByRole("button");
    await user.click(decrementButton);
    await user.click(incrementButton);

    expect(onChange).toHaveBeenNthCalledWith(1, 5);
    expect(onChange).toHaveBeenNthCalledWith(2, 7);
  });

  it("disables decrement button at min and increment button at max", () => {
    const { rerender } = render(
      <QuantityInput value={2} onChange={vi.fn()} min={2} max={5} />,
    );

    let [decrementButton, incrementButton] = screen.getAllByRole("button");
    expect(decrementButton).toBeDisabled();
    expect(incrementButton).not.toBeDisabled();

    rerender(<QuantityInput value={5} onChange={vi.fn()} min={2} max={5} />);
    [decrementButton, incrementButton] = screen.getAllByRole("button");
    expect(decrementButton).not.toBeDisabled();
    expect(incrementButton).toBeDisabled();
  });
});
