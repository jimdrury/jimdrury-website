import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  OsTitleBar,
  TitleBarButton,
  toChromeFilename,
  WindowFrame,
} from "./window-frame";

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

  it("draws overflowing crop marks instead of clipping the frame", () => {
    const { container } = render(
      <WindowFrame data-testid="frame" title="portrait.tiff">
        Body
      </WindowFrame>,
    );

    expect(screen.getByTestId("frame")).toHaveClass("overflow-visible");
    expect(container.querySelectorAll(".rule-mark-h")).toHaveLength(2);
    expect(container.querySelectorAll(".rule-mark-v")).toHaveLength(2);
  });
});

describe("OsTitleBar", () => {
  it("clips flush title-bar actions instead of letting them expand out", () => {
    const { container } = render(
      <OsTitleBar
        title="DESIGN.md"
        actions={<TitleBarButton>Copy</TitleBarButton>}
      />,
    );

    const bar = container.firstElementChild;
    expect(bar).toHaveClass("overflow-hidden", "h-[var(--chrome-bar-height)]");
    expect(screen.getByRole("button", { name: "Copy" })).toHaveClass(
      "h-full",
      "min-h-0",
    );
    expect(screen.getByRole("button", { name: "Copy" })).not.toHaveClass(
      "py-1",
      "py-1.5",
    );
  });
});

describe("toChromeFilename", () => {
  it("slugifies a label into a mono filename", () => {
    expect(toChromeFilename("Design")).toBe("design.md");
    expect(toChromeFilename("On This Page", "toc")).toBe("on-this-page.toc");
    expect(toChromeFilename(undefined)).toBe("untitled.md");
  });
});
