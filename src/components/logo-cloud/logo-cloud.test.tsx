import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LogoCloud } from "./logo-cloud";

describe("LogoCloud", () => {
  it("renders the title when provided", () => {
    render(<LogoCloud title="Our Partners">Logos</LogoCloud>);

    expect(screen.getByText("Our Partners")).toBeInTheDocument();
  });

  it("does not render title when omitted", () => {
    render(<LogoCloud>Logos</LogoCloud>);

    expect(screen.queryByRole("heading")).toBeNull();
  });

  it("renders children", () => {
    render(
      <LogoCloud>
        <span>Logo 1</span>
        <span>Logo 2</span>
      </LogoCloud>,
    );

    expect(screen.getByText("Logo 1")).toBeInTheDocument();
    expect(screen.getByText("Logo 2")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <LogoCloud className="custom-class" data-testid="cloud">
        Logos
      </LogoCloud>,
    );

    expect(screen.getByTestId("cloud")).toHaveClass("custom-class");
  });

  it("passes through additional props", () => {
    render(<LogoCloud data-testid="my-cloud">Content</LogoCloud>);

    expect(screen.getByTestId("my-cloud")).toBeInTheDocument();
  });
});
