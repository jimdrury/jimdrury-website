import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { HomeCTAsBlok } from "./HomeCTAsBlok";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("HomeCTAsBlok", () => {
  it("falls back to default paths when CMS URLs are omitted", () => {
    const { container } = render(
      <HomeCTAsBlok
        blok={{
          component: "home_ctas",
        }}
      />,
    );

    expect(container.querySelector("section")).toHaveClass("py-8", "md:py-10");
    expect(screen.getByRole("link", { name: "Read the blog" })).toHaveAttribute(
      "href",
      "/blog",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  it("uses allowlisted CMS URLs", () => {
    render(
      <HomeCTAsBlok
        blok={{
          component: "home_ctas",
          primary_url: "/writing",
          secondary_url: "https://example.com/about",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "Read the blog" })).toHaveAttribute(
      "href",
      "/writing",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "https://example.com/about",
    );
  });

  it("ignores javascript and protocol-relative CMS URLs", () => {
    render(
      <HomeCTAsBlok
        blok={{
          component: "home_ctas",
          primary_url: "javascript:alert(1)",
          secondary_url: "//evil.com",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "Read the blog" })).toHaveAttribute(
      "href",
      "/blog",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });
});
