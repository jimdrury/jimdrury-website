import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer, FooterColumn } from "./footer";

describe("Footer", () => {
  it("renders as a footer element", () => {
    render(<Footer>Content</Footer>);

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Footer className="custom-class" data-testid="footer">
        Content
      </Footer>,
    );

    expect(screen.getByTestId("footer")).toHaveClass("custom-class");
  });

  it("renders composed footer with columns", () => {
    render(
      <Footer>
        <FooterColumn title="Product">
          <li>
            <a href="/features">Features</a>
          </li>
        </FooterColumn>
        <FooterColumn title="Company">
          <li>
            <a href="/about">About</a>
          </li>
        </FooterColumn>
      </Footer>,
    );

    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
  });

  it("passes through additional props", () => {
    render(<Footer data-testid="my-footer">Content</Footer>);

    expect(screen.getByTestId("my-footer")).toBeInTheDocument();
  });
});
