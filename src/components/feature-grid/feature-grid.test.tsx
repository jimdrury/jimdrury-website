import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Feature, FeatureGrid } from "./feature-grid";

const TestIcon = (props: { className?: string }) => (
  <svg data-testid="icon" viewBox="0 0 24 24" {...props} />
);

describe("FeatureGrid", () => {
  it("renders children", () => {
    render(
      <FeatureGrid>
        <Feature title="Speed">Fast performance</Feature>
      </FeatureGrid>,
    );

    expect(screen.getByText("Speed")).toBeInTheDocument();
    expect(screen.getByText("Fast performance")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <FeatureGrid className="custom-class" data-testid="grid">
        <Feature title="Test">Content</Feature>
      </FeatureGrid>,
    );

    expect(screen.getByTestId("grid")).toHaveClass("custom-class");
  });
});

describe("Feature", () => {
  it("renders title and children", () => {
    render(<Feature title="Security">Secure by default</Feature>);

    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Secure by default")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(
      <Feature title="Fast" icon={TestIcon}>
        Description
      </Feature>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("does not render icon when omitted", () => {
    const { container } = render(<Feature title="Basic">Content</Feature>);

    expect(container.querySelector("span.mb-3")).toBeNull();
  });

  it("passes through additional props", () => {
    render(
      <Feature title="Test" data-testid="feature">
        Content
      </Feature>,
    );

    expect(screen.getByTestId("feature")).toBeInTheDocument();
  });
});
