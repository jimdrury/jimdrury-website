import { beforeEach, describe, expect, it, vi } from "vitest";
import { StoryblokUnavailableError } from "@/lib/storyblok-errors";
import { fetchStoryBySlug } from "@/lib/storyblok-story";

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
  });

  it("returns null for a true not-found result", async () => {
    vi.mocked(fetchStoryBySlug).mockResolvedValue(null);

    const { getArticleBySlug } = await import("./blog-listings");
    await expect(
      getArticleBySlug({ slug: "missing", version: "published" }),
    ).resolves.toBeNull();
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
