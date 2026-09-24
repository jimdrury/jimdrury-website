import { cacheTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StoryblokUnavailableError } from "@/lib/storyblok-errors";
import { fetchStoryBySlug } from "@/lib/storyblok-story";
import { getStoryblokApi } from "@/storyblok";

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

describe("getArticleBySlug", () => {
  beforeEach(() => {
    vi.mocked(fetchStoryBySlug).mockReset();
    vi.mocked(cacheTag).mockReset();
  });

  it("returns the article when the shared story fetch succeeds", async () => {
    const story = {
      id: 1,
      name: "Test",
      slug: "test",
      full_slug: "blog/test",
      content: { component: "article" },
    };
    vi.mocked(fetchStoryBySlug).mockResolvedValue(story);

    const { getArticleBySlug } = await import("./blog-listings");
    await expect(
      getArticleBySlug({ slug: "test", version: "published" }),
    ).resolves.toEqual(story);
    expect(fetchStoryBySlug).toHaveBeenCalledWith({
      slug: "blog/test",
      version: "published",
    });
    expect(cacheTag).toHaveBeenCalledWith(
      "content:blog:article:published:test",
    );
    expect(cacheTag).not.toHaveBeenCalledWith("content:blog:article:published");
  });

  it("returns null for a true not-found result", async () => {
    vi.mocked(fetchStoryBySlug).mockResolvedValue(null);

    const { getArticleBySlug } = await import("./blog-listings");
    await expect(
      getArticleBySlug({ slug: "missing", version: "published" }),
    ).resolves.toBeNull();
  });

  it("returns null for a published article dated after today", async () => {
    vi.mocked(fetchStoryBySlug).mockResolvedValue({
      id: 2,
      name: "Scheduled",
      slug: "scheduled",
      full_slug: "blog/scheduled",
      first_published_at: "2099-01-01T00:00:00.000Z",
      content: { component: "article" },
    });

    const { getArticleBySlug } = await import("./blog-listings");
    await expect(
      getArticleBySlug({ slug: "scheduled", version: "published" }),
    ).resolves.toBeNull();
  });

  it("returns a future-dated article in draft preview", async () => {
    const story = {
      id: 3,
      name: "Scheduled",
      slug: "scheduled",
      full_slug: "blog/scheduled",
      first_published_at: "2099-01-01T00:00:00.000Z",
      content: { component: "article" },
    };
    vi.mocked(fetchStoryBySlug).mockResolvedValue(story);

    const { getArticleBySlug } = await import("./blog-listings");
    await expect(
      getArticleBySlug({ slug: "scheduled", version: "draft" }),
    ).resolves.toEqual(story);
  });

  it("does not swallow Storyblok unavailable errors", async () => {
    vi.mocked(fetchStoryBySlug).mockRejectedValue(
      new StoryblokUnavailableError({
        message: "Storyblok request failed for blog/test (published)",
        status: 503,
        slug: "blog/test",
        version: "published",
        cause: { status: 503 },
      }),
    );

    const { getArticleBySlug } = await import("./blog-listings");
    await expect(
      getArticleBySlug({ slug: "test", version: "published" }),
    ).rejects.toBeInstanceOf(StoryblokUnavailableError);
  });
});

describe("article listing visibility", () => {
  const pastStory = {
    id: 10,
    name: "Live",
    slug: "live",
    full_slug: "blog/live",
    tag_list: ["nextjs"],
    first_published_at: "2026-01-01T00:00:00.000Z",
    content: { component: "article" },
  };
  const futureStory = {
    id: 11,
    name: "Scheduled",
    slug: "scheduled",
    full_slug: "blog/scheduled",
    tag_list: ["nextjs"],
    first_published_at: "2099-01-01T00:00:00.000Z",
    content: { component: "article" },
  };

  beforeEach(() => {
    vi.mocked(getStoryblokApi).mockReset();
    vi.mocked(getStoryblokApi).mockReturnValue({
      get: vi.fn().mockResolvedValue({
        data: { stories: [futureStory, pastStory] },
      }),
    } as never);
  });

  it("omits future-dated articles from published listings", async () => {
    const { getAllArticles } = await import("./blog-listings");

    await expect(getAllArticles("published")).resolves.toEqual([pastStory]);
  });

  it("keeps future-dated articles in draft listings", async () => {
    const { getAllArticles } = await import("./blog-listings");

    await expect(getAllArticles("draft")).resolves.toEqual([
      futureStory,
      pastStory,
    ]);
  });

  it("paginates tagged articles after dropping unpublished dates", async () => {
    const { getArticlesByTag } = await import("./blog-listings");

    await expect(getArticlesByTag("nextjs", 0, "published")).resolves.toEqual([
      pastStory,
    ]);
  });

  it("counts tags from visible published articles only", async () => {
    const { getBlogTags } = await import("./blog-listings");

    await expect(getBlogTags("published")).resolves.toEqual([
      { slug: "nextjs", count: 1 },
    ]);
    await expect(getBlogTags("draft")).resolves.toEqual([
      { slug: "nextjs", count: 2 },
    ]);
  });
});
