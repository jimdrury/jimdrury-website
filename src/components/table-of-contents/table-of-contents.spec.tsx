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
  it("uses the heading font for On This Page titles", () => {
    render(<TableOfContents story={storyWithHeading} />);

    const titles = screen.getAllByText("On This Page");

    expect(titles).toHaveLength(2);
    for (const title of titles) {
      expect(title).toHaveClass("font-[family-name:var(--font-geist-sans)]");
    }
  });

  it("renders a jump icon on each heading link", () => {
    const { container } = render(<TableOfContents story={storyWithHeading} />);

    const links = screen.getAllByRole("link", { name: "Getting Started" });
    expect(links.length).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('a[href="#getting-started"] svg').length,
    ).toBeGreaterThan(0);
  });
});
