import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SbBlokData } from "@/storyblok/lib";
import { ArticleBlok } from "./ArticleBlok";

const mocks = vi.hoisted(() => ({
  useStoryRenderContext: vi.fn(() => ({
    story: { content: { component: "page" } },
    pathname: "/",
  })),
  getSimilarArticleItems: vi.fn(async () => []),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ isEnabled: false })),
}));

vi.mock("@/lib/story-render-context", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/story-render-context")>();
  return {
    ...actual,
    useStoryRenderContext: () => mocks.useStoryRenderContext(),
  };
});

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
) => {
  const view = (await ArticleBlok({ blok })) as ReactElement;
  return render(view);
};

describe("ArticleBlok", () => {
  beforeEach(() => {
    mocks.useStoryRenderContext.mockReturnValue({
      story: { content: { component: "page" } },
      pathname: "/",
    });
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
    await renderArticle({
      _uid: "article-2",
      component: "article",
      story_name: "No sidebar",
      excerpt: "  ",
      categories: ["nextjs", " "],
      published_at: "2026-03-21T12:00:00.000Z",
      updated_at: "2026-03-22T12:00:00.000Z",
      body: [],
    });

    expect(screen.getAllByTestId("fallback-toc")).toHaveLength(2);
    expect(screen.getAllByTestId("fallback-similar")).toHaveLength(2);
    expect(
      document.querySelector('meta[itemProp="datePublished"]'),
    ).toHaveAttribute("content", "2026-03-21T12:00:00.000Z");
    expect(document.querySelector('meta[itemProp="keywords"]')).toHaveAttribute(
      "content",
      "nextjs",
    );
  });
});
