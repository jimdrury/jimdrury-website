import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

const { draftModeMock, getArticleBySlugMock, getDefaultStoryCategoryMock } =
  vi.hoisted(() => ({
    draftModeMock: vi.fn(),
    getArticleBySlugMock: vi.fn(),
    getDefaultStoryCategoryMock: vi.fn(() => "ai"),
  }));

vi.mock("next/headers", () => ({
  draftMode: draftModeMock,
}));

vi.mock("@/lib/blog", () => ({
  getDefaultStoryCategory: getDefaultStoryCategoryMock,
}));

vi.mock("@/storyblok/blog-listings", () => ({
  getArticleBySlug: getArticleBySlugMock,
}));

vi.mock("@/lib/article-markdown", () => ({
  renderArticleMarkdown: vi.fn(() => "# Released"),
}));

import { GET } from "./route";

const FUTURE_SLUGS = [
  "devin-dreaming-agent-memory-review-the-writes",
  "agent-written-tests-marking-own-homework",
] as const;

const article = (slug: string, firstPublishedAt?: string) => ({
  id: 1,
  name: "Article",
  slug,
  full_slug: `blog/${slug}`,
  first_published_at: firstPublishedAt,
  content: { component: "article" },
});

const getMarkdown = (slug: string, category = "ai") => {
  return GET(
    new Request(`https://www.jimdrury.co.uk/blog/${category}/${slug}.md`),
    { params: Promise.resolve({ category, slug }) },
  );
};

describe("GET /blog/[category]/[slug]/markdown", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-12T12:00:00.000Z"));
    draftModeMock.mockReset();
    getArticleBySlugMock.mockReset();
    draftModeMock.mockResolvedValue({ isEnabled: false });
    getDefaultStoryCategoryMock.mockReturnValue("ai");
  });

  it("serves markdown for the canonical category", async () => {
    getArticleBySlugMock.mockResolvedValue(
      article("my-post", "2020-01-01T00:00:00.000Z"),
    );

    const response = await getMarkdown("my-post", "ai");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/markdown");
    await expect(response.text()).resolves.toBe("# Released");
  });

  it("redirects a non-canonical path category to the canonical .md URL", async () => {
    getArticleBySlugMock.mockResolvedValue(
      article("my-post", "2020-01-01T00:00:00.000Z"),
    );

    const response = await getMarkdown("my-post", "frontend");

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.jimdrury.co.uk/blog/ai/my-post.md",
    );
  });

  it("returns 404 for a missing article", async () => {
    getArticleBySlugMock.mockResolvedValue(null);

    const response = await getMarkdown("missing", "ai");

    expect(response.status).toBe(404);
    expect(response.headers.get("location")).toBeNull();
  });

  it.each(
    FUTURE_SLUGS,
  )("returns 404 for unreleased %s before the markdown redirect", async (slug) => {
    getArticleBySlugMock.mockResolvedValue(
      article(slug, "2099-01-01T00:00:00.000Z"),
    );

    const response = await getMarkdown(slug, "general");

    expect(response.status).toBe(404);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects a released article only after the release gate passes", async () => {
    const slug = "mcp-tools-as-processes";
    getArticleBySlugMock.mockResolvedValue(
      article(slug, "2020-01-01T00:00:00.000Z"),
    );

    const redirected = await getMarkdown(slug, "general");

    expect(redirected.status).toBe(307);
    expect(redirected.headers.get("location")).toBe(
      `https://www.jimdrury.co.uk/blog/ai/${slug}.md`,
    );

    const rendered = await getMarkdown(slug, "ai");

    expect(rendered.status).toBe(200);
    expect(rendered.headers.get("content-type")).toContain("text/markdown");
    await expect(rendered.text()).resolves.toBe("# Released");
  });
});

describe(".md rewrite", () => {
  it("routes /blog/:category/:slug.md to the markdown handler", async () => {
    const { getPathMatch } = await import(
      "next/dist/shared/lib/router/utils/path-match"
    );
    const nextConfig = (await import("../../../../../../next.config")).default;
    const rewrites = await nextConfig.rewrites?.();
    const beforeFiles = Array.isArray(rewrites) ? [] : rewrites?.beforeFiles;
    const rule = beforeFiles?.find((entry) => entry.source.endsWith(".md"));

    expect(rule?.destination).toBe("/blog/:category/:slug/markdown");

    const match = getPathMatch(rule?.source ?? "", {
      removeUnnamedParams: true,
      strict: true,
    });
    expect(match("/blog/ai/my-post.md")).toEqual({
      category: "ai",
      slug: "my-post",
    });
  });
});
