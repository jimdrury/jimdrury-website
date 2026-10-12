import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock("@/environment", () => ({
  environment: {
    STORYBLOK_ACCESS_TOKEN: "test-token",
    STORYBLOK_SPACE_ID: "12345",
    STORYBLOK_WEBHOOK_SECRET: "webhook-secret",
  },
}));

vi.mock("@/storyblok", () => ({
  getStoryblokApi: vi.fn(),
  getStoryblokCv: vi.fn(),
}));

vi.mock("@/lib/storyblok-story", () => ({
  fetchStoryBySlug: vi.fn(),
}));

describe("getDefaultStoryCategory", () => {
  it("uses a stable category when an article has no tags", async () => {
    const { getDefaultStoryCategory } = await import("./blog");

    expect(
      getDefaultStoryCategory({
        id: 1,
        name: "MCP tools as processes",
        slug: "mcp-tools-as-processes",
        full_slug: "blog/mcp-tools-as-processes",
        tag_list: [],
        content: { component: "article" },
      }),
    ).toBe("general");
  });

  it("prefers the ai tag when several tags are present", async () => {
    const { getDefaultStoryCategory } = await import("./blog");

    expect(
      getDefaultStoryCategory({
        id: 2,
        name: "AI at scale",
        slug: "ai-at-scale-known-cost-not-token-surprise",
        full_slug: "blog/ai-at-scale-known-cost-not-token-surprise",
        tag_list: ["gemini", "ai"],
        content: { component: "article" },
      }),
    ).toBe("ai");
  });
});
