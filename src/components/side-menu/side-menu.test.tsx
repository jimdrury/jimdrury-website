import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SideMenu, SideMenuItem } from "./side-menu";

describe("SideMenu", () => {
  it("renders a navigation element", () => {
    render(
      <SideMenu>
        <SideMenuItem href="/home">Home</SideMenuItem>
      </SideMenu>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders menu items as links", () => {
    render(
      <SideMenu>
        <SideMenuItem href="/about">About</SideMenuItem>
      </SideMenu>,
    );

    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("applies active styles to the active item", () => {
    render(
      <SideMenu>
        <SideMenuItem href="/dashboard" active>
          Dashboard
        </SideMenuItem>
      </SideMenu>,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveClass(
      "bg-yellow-300",
    );
  });
});
