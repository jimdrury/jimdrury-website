import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SimilarArticles } from "./similar-articles";

describe("SimilarArticles", () => {
  it("returns null when there are no items", () => {
    const { container } = render(<SimilarArticles items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders homepage compact cards for each item", () => {
    render(
      <SimilarArticles
        items={[
          {
            href: "/blog/nextjs/webmcp",
            title: "WebMCP",
            excerpt: "Discovery without an install.",
            publishedAt: "September 19, 2026",
            dateTime: "2026-09-19",
            imageSrc: "/hero.jpg",
            imageAlt: "Toolbox",
            category: "nextjs",
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "Similar Articles" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("nextjs")).toHaveClass(
      "absolute",
      "bottom-[-10px]",
      "left-4",
    );
    expect(
      screen.getByText("September 19, 2026").closest("time"),
    ).toHaveAttribute("datetime", "2026-09-19");
    expect(screen.getByRole("link", { name: /WebMCP/ })).toHaveAttribute(
      "href",
      "/blog/nextjs/webmcp",
    );
    expect(
      screen.getByText("Discovery without an install."),
    ).toBeInTheDocument();
  });

  it("uses the homepage card spacing between items", () => {
    render(
      <SimilarArticles
        items={[
          {
            href: "/blog/nextjs/one",
            title: "One",
          },
          {
            href: "/blog/nextjs/two",
            title: "Two",
          },
        ]}
      />,
    );

    expect(screen.getByRole("list")).toHaveClass(
      "space-y-4",
      "md:space-y-8",
      "lg:space-y-10",
    );
  });
});
