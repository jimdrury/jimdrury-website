import { draftMode } from "next/headers";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getArticleBySlug } from "@/storyblok/blog-listings";

vi.mock("next/headers", () => ({
  draftMode: vi.fn(),
}));

vi.mock("@/storyblok/blog-listings", () => ({
  getArticleBySlug: vi.fn(),
}));

vi.mock("@/lib/blog", () => ({
  getDefaultStoryCategory: vi.fn(() => "ai"),
}));

vi.mock("@/lib/article-markdown", () => ({
  renderArticleMarkdown: vi.fn(() => "# Article"),
}));

const article = {
  id: 1,
  name: "Article",
  slug: "my-post",
  full_slug: "blog/my-post",
  content: { component: "article" },
};

const get = async (category: string, slug: string) => {
  const { GET } = await import("./route");
  return GET(
    new Request(`https://www.jimdrury.co.uk/blog/${category}/${slug}.md`),
    { params: Promise.resolve({ category, slug }) },
  );
};

describe("GET /blog/[category]/[slug]/markdown", () => {
  beforeEach(() => {
    vi.mocked(draftMode).mockResolvedValue({
      isEnabled: false,
    } as Awaited<ReturnType<typeof draftMode>>);
    vi.mocked(getArticleBySlug).mockReset();
  });

  it("serves markdown for the canonical category", async () => {
    vi.mocked(getArticleBySlug).mockResolvedValue(article);

    const response = await get("ai", "my-post");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/markdown");
    expect(await response.text()).toBe("# Article");
  });

  it("redirects a non-canonical path category to the canonical .md URL", async () => {
    vi.mocked(getArticleBySlug).mockResolvedValue(article);

    const response = await get("frontend", "my-post");

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.jimdrury.co.uk/blog/ai/my-post.md",
    );
  });

  it("returns 404 for a missing article", async () => {
    vi.mocked(getArticleBySlug).mockResolvedValue(null);

    const response = await get("ai", "missing");

    expect(response.status).toBe(404);
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
