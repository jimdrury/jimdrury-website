import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  draftModeMock,
  getArticleBySlugMock,
  getDefaultStoryCategoryMock,
  notFoundMock,
  redirectMock,
} = vi.hoisted(() => ({
  draftModeMock: vi.fn(),
  getArticleBySlugMock: vi.fn(),
  getDefaultStoryCategoryMock: vi.fn(() => "ai"),
  notFoundMock: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
  redirectMock: vi.fn((href: string) => {
    throw new Error(`REDIRECT:${href}`);
  }),
}));

vi.mock("next/headers", () => ({
  draftMode: draftModeMock,
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
  redirect: redirectMock,
}));

vi.mock("@/lib/blog", () => ({
  getDefaultStoryCategory: getDefaultStoryCategoryMock,
  getPublishedArticleParams: vi.fn(async () => []),
}));

vi.mock("@/storyblok/blog-listings", () => ({
  getArticleBySlug: getArticleBySlugMock,
}));

vi.mock("./_components/render/render", () => ({
  Render: () => null,
}));

vi.mock("./_components/back-to-top/back-to-top", () => ({
  BackToTop: () => null,
}));

import Page, { generateMetadata } from "./page";

const FUTURE_SLUGS = [
  "devin-dreaming-agent-memory-review-the-writes",
  "agent-written-tests-marking-own-homework",
] as const;

const article = (slug: string, firstPublishedAt: string) => ({
  id: 1,
  name: "Scheduled",
  slug,
  full_slug: `blog/${slug}`,
  first_published_at: firstPublishedAt,
  content: { component: "article" },
});

describe("category article route", () => {
  beforeEach(() => {
    draftModeMock.mockReset();
    getArticleBySlugMock.mockReset();
    notFoundMock.mockClear();
    redirectMock.mockClear();
    draftModeMock.mockResolvedValue({ isEnabled: false });
    getDefaultStoryCategoryMock.mockReturnValue("ai");
  });

  it.each(
    FUTURE_SLUGS,
  )("returns not found for unreleased %s before a category redirect", async (slug) => {
    getArticleBySlugMock.mockResolvedValue(
      article(slug, "2099-01-01T00:00:00.000Z"),
    );

    await expect(
      Page({ params: Promise.resolve({ category: "general", slug }) }),
    ).rejects.toThrow("NOT_FOUND");
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it.each(FUTURE_SLUGS)("noindexes unreleased %s", async (slug) => {
    getArticleBySlugMock.mockResolvedValue(
      article(slug, "2099-01-01T00:00:00.000Z"),
    );

    await expect(
      generateMetadata({
        params: Promise.resolve({ category: "general", slug }),
      }),
    ).resolves.toMatchObject({
      title: "Article not found",
      robots: { index: false, follow: false },
    });
  });

  it("redirects a released article only after the release gate passes", async () => {
    const slug = "mcp-tools-as-processes";
    getArticleBySlugMock.mockResolvedValue(
      article(slug, "2020-01-01T00:00:00.000Z"),
    );

    await expect(
      Page({ params: Promise.resolve({ category: "general", slug }) }),
    ).rejects.toThrow(`REDIRECT:/blog/ai/${slug}`);
    expect(notFoundMock).not.toHaveBeenCalled();

    await expect(
      Page({ params: Promise.resolve({ category: "ai", slug }) }),
    ).resolves.toBeTruthy();
  });
});
