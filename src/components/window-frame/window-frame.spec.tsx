import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WindowFrame } from "./window-frame";

describe("WindowFrame", () => {
  it("renders children", () => {
    render(
      <WindowFrame data-testid="frame">
        <p>Content</p>
      </WindowFrame>,
    );

    expect(screen.getByTestId("frame")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders a title bar when a title is provided", () => {
    render(<WindowFrame title="preview.ts">Body</WindowFrame>);

    expect(screen.getByText("preview.ts")).toBeInTheDocument();
  });
});
