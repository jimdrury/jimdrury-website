import { render } from "@testing-library/react";
import { FaAngleDoubleDown } from "react-icons/fa";
import { describe, expect, it } from "vitest";
import { IconBox } from "./icon-box";

describe("IconBox", () => {
  it("renders a boxed decorative icon", () => {
    const { container } = render(
      <IconBox data-testid="box">
        <FaAngleDoubleDown />
      </IconBox>,
    );

    const box = container.querySelector("[data-testid=box]");
    expect(box).toHaveAttribute("aria-hidden");
    expect(box).toHaveClass("size-5");
    expect(box?.querySelector("svg")).toBeInTheDocument();
  });

  it("supports the larger size", () => {
    const { container } = render(
      <IconBox size="md" data-testid="box">
        <FaAngleDoubleDown />
      </IconBox>,
    );

    expect(container.querySelector("[data-testid=box]")).toHaveClass("size-7");
  });
});
