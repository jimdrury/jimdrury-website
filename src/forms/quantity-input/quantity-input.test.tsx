import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuantityInput } from "./quantity-input";

describe("QuantityInput", () => {
  it("renders value and buttons", () => {
    render(<QuantityInput value={3} onChange={vi.fn()} />);

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
