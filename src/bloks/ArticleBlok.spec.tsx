import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import type { SbBlokData, StoryData } from "@/storyblok/lib";
import { ArticleBlok } from "./ArticleBlok";

const mocks = vi.hoisted(() => ({
  getSimilarArticleItems: vi.fn(async () => []),
}));

const pageStory: StoryData = {
  content: { component: "page" },
};

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ isEnabled: false })),
}));

vi.mock("@/lib/similar-articles", () => ({
  getSimilarArticleItems: mocks.getSimilarArticleItems,
}));

vi.mock("@/storyblok/renderer", () => ({
  BlokRenderer: ({ blok }: { blok: SbBlokData }) => (
    <div data-testid={`nested-${blok.component}`}>{String(blok._uid)}</div>
  ),
}));

vi.mock("@/components/table-of-contents", () => ({
  TableOfContents: () => <nav data-testid="fallback-toc">On This Page</nav>,
}));

vi.mock("@/components/similar-articles", () => ({
  SimilarArticles: () => (
    <section data-testid="fallback-similar">Similar articles</section>
  ),
}));

vi.mock("@/components/article-navigation", () => ({
  ArticleNavigation: () => <nav data-testid="article-navigation" />,
}));

const renderArticle = async (
  blok: Parameters<typeof ArticleBlok>[0]["blok"],
  story: StoryData = pageStory,
) => {
  const view = (await ArticleBlok({
    blok,
    pathname: "/",
    story,
  })) as ReactElement;
  return render(view);
};

describe("ArticleBlok", () => {
  beforeEach(() => {
    mocks.getSimilarArticleItems.mockClear();
  });

  it("renders CMS pre_content and post_content in the article aside", async () => {
    await renderArticle({
      _uid: "article-1",
      component: "article",
      story_name: "Sidebar fields",
      excerpt: "Excerpt",
      body: [{ _uid: "body-1", component: "typography" }],
      pre_content: [{ _uid: "pre-1", component: "table_of_contents" }],
      post_content: [{ _uid: "post-1", component: "similar_articles" }],
    });

    const pre = screen.getAllByTestId("nested-table_of_contents");
    const post = screen.getAllByTestId("nested-similar_articles");

    expect(pre).toHaveLength(2);
    expect(post).toHaveLength(2);
    expect(pre[0]).toHaveTextContent("pre-1");
    expect(post[0]).toHaveTextContent("post-1");
    expect(screen.queryByTestId("fallback-toc")).toBeNull();
    expect(screen.queryByTestId("fallback-similar")).toBeNull();
    expect(mocks.getSimilarArticleItems).not.toHaveBeenCalled();
    expect(screen.getByTestId("nested-typography")).toHaveTextContent("body-1");
  });

  it("falls back to template TOC and similar articles when sidebar fields are empty", async () => {
    const story = {
      id: 7,
      name: "No sidebar",
      slug: "no-sidebar",
      full_slug: "blog/nextjs/no-sidebar",
      first_published_at: "2026-03-21T12:00:00.000Z",
      published_at: "2026-03-22T12:00:00.000Z",
      tag_list: ["nextjs", "nextjs"],
      content: {
        component: "article",
        excerpt: "Story excerpt",
      },
    } as BlogStory;

    await renderArticle(
      {
        _uid: "article-2",
        component: "article",
        story_name: "No sidebar",
        excerpt: "  ",
        categories: ["ignored"],
        published_at: "2020-01-01T00:00:00.000Z",
        updated_at: "2020-01-02T00:00:00.000Z",
        body: [],
      },
      story as StoryData,
    );

    expect(screen.getAllByTestId("fallback-toc")).toHaveLength(2);
    expect(screen.getAllByTestId("fallback-similar")).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "No sidebar" })).toHaveAttribute(
      "itemProp",
      "headline",
    );
    expect(document.querySelector("time")).toHaveAttribute(
      "dateTime",
      "2026-03-21T12:00:00.000Z",
    );
    expect(document.querySelector("time")).toHaveAttribute(
      "itemProp",
      "datePublished",
    );
    expect(document.querySelector('meta[itemProp="datePublished"]')).toBeNull();
    expect(
      document.querySelector('meta[itemProp="dateModified"]'),
    ).toHaveAttribute("content", "2026-03-22T12:00:00.000Z");
    expect(document.querySelector('meta[itemProp="keywords"]')).toHaveAttribute(
      "content",
      "nextjs",
    );
    expect(
      document.querySelector('[itemProp="author"] meta[itemProp="url"]'),
    ).toHaveAttribute("content", "https://www.jimdrury.co.uk/about");
    expect(
      document.querySelector('link[itemProp="mainEntityOfPage"]'),
    ).toHaveAttribute(
      "href",
      "https://www.jimdrury.co.uk/blog/nextjs/no-sidebar",
    );
    expect(document.querySelector('[itemProp="publisher"]')).toHaveAttribute(
      "itemType",
      "https://schema.org/Organization",
    );
  });
});
