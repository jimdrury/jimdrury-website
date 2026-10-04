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
});
