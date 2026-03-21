import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerticalMenu, VerticalMenuItem } from "./vertical-menu";

describe("VerticalMenu", () => {
  it("renders a navigation element", () => {
    render(
      <VerticalMenu>
        <VerticalMenuItem href="/home">Home</VerticalMenuItem>
      </VerticalMenu>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders menu items as links", () => {
    render(
      <VerticalMenu>
        <VerticalMenuItem href="/about">About</VerticalMenuItem>
      </VerticalMenu>,
    );

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("applies active styles to the active item", () => {
    render(
      <VerticalMenu>
        <VerticalMenuItem href="/services" active>
          Services
        </VerticalMenuItem>
      </VerticalMenu>,
    );

    expect(screen.getByRole("link", { name: "Services" })).toHaveClass(
      "bg-yellow-300",
    );
  });
});
