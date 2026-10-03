import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import { TableOfContents } from "./table-of-contents";

const storyWithHeading = {
  id: 1,
  name: "Story",
  slug: "story",
  full_slug: "blog/story",
  content: {
    component: "article",
    body: [
      {
        _uid: "uid-h2",
        component: "typography",
        as: "h2",
        content: "Getting Started",
      },
    ],
  },
} as BlogStory;

describe("TableOfContents", () => {
  it("labels the window On This Page", () => {
    render(<TableOfContents story={storyWithHeading} />);

    expect(screen.getAllByText("On This Page").length).toBeGreaterThan(0);
  });

  it("renders a boxed jump icon on each heading link", () => {
    const { container } = render(<TableOfContents story={storyWithHeading} />);

    const links = screen.getAllByRole("link", { name: /Getting Started/ });
    expect(links.length).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('a[href="#getting-started"] svg').length,
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('a[href="#getting-started"] [aria-hidden] svg')
        .length,
    ).toBeGreaterThan(0);
  });

  it("prefixes each heading with a zero-padded index", () => {
    render(<TableOfContents story={storyWithHeading} />);

    expect(screen.getAllByText("01").length).toBeGreaterThan(0);
  });
});
