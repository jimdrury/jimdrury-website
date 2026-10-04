import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spine } from "./spine";

describe("Spine", () => {
  it("renders a pixel label and children", () => {
    render(
      <Spine label="About">
        <p>Lede</p>
      </Spine>,
    );

    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Lede")).toBeInTheDocument();
  });

  it("lets callers contain the rule so it does not overshoot a colour join", () => {
    const { container } = render(
      <Spine label="About" ruleClassName="bottom-0">
        <p>Lede</p>
      </Spine>,
    );

    expect(container.querySelector("[aria-hidden]")).toHaveClass("bottom-0");
    expect(container.querySelector("[aria-hidden]")).not.toHaveClass(
      "bottom-[-1.5rem]",
    );
  });
});
