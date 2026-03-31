import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { Typography } from "./typography";

const TestAnchor = (props: { className?: string; children?: ReactNode }) => (
  <a data-testid="as-child-anchor" className={props.className} href="/x">
    {props.children}
  </a>
);

describe("Typography", () => {
  it("renders", () => {
    render(<Typography data-testid="component">Hello</Typography>);

    expect(screen.getByTestId("component")).toBeInTheDocument();
  });

  it("renders as paragraph by default", () => {
    render(<Typography data-testid="component">Hello</Typography>);

    expect(screen.getByTestId("component").tagName).toBe("P");
  });

  it("applies size token (including weight) to semantic heading via asChild", () => {
    render(
      <Typography asChild size="3xl">
        <h1>Heading</h1>
      </Typography>,
    );

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toHaveClass("text-[30px]");
    expect(heading).toHaveClass("font-bold");
  });

  it("derives weight from size (sm → normal)", () => {
    render(
      <Typography asChild size="sm">
        <h2>Heading</h2>
      </Typography>,
    );

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toHaveClass("text-[14px]");
    expect(heading).toHaveClass("font-normal");
  });

  it("derives weight from size (lg → medium)", () => {
    render(
      <Typography asChild size="lg">
        <h2>Heading</h2>
      </Typography>,
    );

    const heading = screen.getByRole("heading", { level: 2 });

    expect(heading).toHaveClass("font-medium");
  });

  it("merges styles onto child when asChild is true", () => {
    render(
      <Typography asChild size="lg">
        <TestAnchor>Link text</TestAnchor>
      </Typography>,
    );

    const anchor = screen.getByTestId("as-child-anchor");
    expect(anchor).toHaveClass("text-[18px]");
    expect(anchor).toHaveClass("font-medium");
    expect(anchor).toHaveAttribute("href", "/x");
  });

  it("applies explicit size when asChild wraps a heading", () => {
    render(
      <Typography asChild size="sm">
        <h1>Title</h1>
      </Typography>,
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-[14px]");
  });

  it("applies uppercase when uppercase is true", () => {
    render(
      <Typography data-testid="upper" uppercase>
        Caps
      </Typography>,
    );

    expect(screen.getByTestId("upper")).toHaveClass("uppercase");
  });
});
