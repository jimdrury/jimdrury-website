import { describe, expect, it, vi } from "vitest";
import { buildBlogSitemap } from "./build-blog-sitemap";

vi.mock("@/lib/blog", () => {
  return {
    getDefaultStoryCategory: vi.fn((story: { tag_list?: string[] }) => {
      return story.tag_list?.length ? "ai" : "general";
    }),
  };
});

vi.mock("@/lib/read-time", () => {
  return {
    estimateWordCount: () => 0,
  };
});

vi.mock("@/storyblok/blog-listings-utils", async () => {
  const actual = await vi.importActual<
    typeof import("@/storyblok/blog-listings-utils")
  >("@/storyblok/blog-listings-utils");

  return {
    ...actual,
    getFeaturedImageAsset: () => null,
    parseStoryblokImageDimensions: () => null,
  };
});

describe("buildBlogSitemap", () => {
  it("includes every released article, including posts without tags", () => {
    const entries = buildBlogSitemap([
      {
        id: 1,
        name: "MCP tools as processes",
        slug: "mcp-tools-as-processes",
        full_slug: "blog/mcp-tools-as-processes",
        tag_list: ["ai", "mcp"],
        first_published_at: "2026-09-07T09:00:00.000Z",
        content: { component: "article" },
      },
      {
        id: 2,
        name: "Untagged note",
        slug: "untagged-note",
        full_slug: "blog/untagged-note",
        tag_list: [],
        published_at: "2026-08-01T09:00:00.000Z",
        content: { component: "article" },
      },
    ]);

    expect(entries.map((entry) => entry.url)).toEqual([
      "https://www.jimdrury.co.uk/blog/ai/mcp-tools-as-processes",
      "https://www.jimdrury.co.uk/blog/general/untagged-note",
    ]);
  });
});
