import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Header, HeaderLogo, HeaderNav } from "./header";

describe("Header", () => {
  it("renders as a header element", () => {
    render(<Header>Content</Header>);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Header className="custom-class" data-testid="header">
        Content
      </Header>,
    );

    expect(screen.getByTestId("header")).toHaveClass("custom-class");
  });

  it("renders composed header with logo and nav", () => {
    render(
      <Header>
        <HeaderLogo>Acme</HeaderLogo>
        <HeaderNav>
          <li>
            <a href="/about">About</a>
          </li>
        </HeaderNav>
      </Header>,
    );

    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("HeaderLogo renders plain text when href is omitted", () => {
    render(<HeaderLogo>Logo</HeaderLogo>);

    expect(screen.queryByRole("link", { name: "Logo" })).toBeNull();
    expect(screen.getByText("Logo")).toBeInTheDocument();
  });

  it("passes through additional props", () => {
    render(<Header data-testid="my-header">Content</Header>);

    expect(screen.getByTestId("my-header")).toBeInTheDocument();
  });
});
