import { beforeEach, describe, expect, it, vi } from "vitest";
import { StoryblokUnavailableError } from "@/lib/storyblok-errors";

const getMock = vi.fn();

vi.mock("@/storyblok", () => ({
  getStoryblokApi: () => ({
    get: getMock,
  }),
  getStoryblokCvParams: async (version: string) =>
    version === "published" ? { cv: 1 } : {},
}));

describe("fetchStoryBySlug", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it("returns the story on success", async () => {
    const story = { id: 1, name: "About", slug: "about", content: {} };
    getMock.mockResolvedValue({ data: { story } });

    const { fetchStoryBySlug } = await import("./storyblok-story");
    await expect(
      fetchStoryBySlug({ slug: "about", version: "published" }),
    ).resolves.toEqual(story);
  });

  it("sends the space cache version for published content only", async () => {
    getMock.mockResolvedValue({ data: { story: null } });

    const { fetchStoryBySlug } = await import("./storyblok-story");
    await fetchStoryBySlug({ slug: "about", version: "published" });
    await fetchStoryBySlug({ slug: "about", version: "draft" });

    expect(getMock).toHaveBeenNthCalledWith(1, "cdn/stories/about", {
      version: "published",
      cv: 1,
    });
    expect(getMock).toHaveBeenNthCalledWith(2, "cdn/stories/about", {
      version: "draft",
    });
  });

  it("encodes slug segments in the request path", async () => {
    getMock.mockResolvedValue({ data: { story: null } });

    const { fetchStoryBySlug } = await import("./storyblok-story");
    await fetchStoryBySlug({ slug: "blog/a b?c", version: "draft" });

    expect(getMock).toHaveBeenCalledWith("cdn/stories/blog/a%20b%3Fc", {
      version: "draft",
    });
  });

  it("returns null without calling Storyblok for dot segments", async () => {
    const { fetchStoryBySlug } = await import("./storyblok-story");

    await expect(
      fetchStoryBySlug({ slug: "../spaces/me", version: "published" }),
    ).resolves.toBeNull();
    await expect(
      fetchStoryBySlug({ slug: "blog/./x", version: "published" }),
    ).resolves.toBeNull();
    expect(getMock).not.toHaveBeenCalled();
  });

  it("returns null when Storyblok responds 404", async () => {
    getMock.mockRejectedValue({ status: 404 });

    const { fetchStoryBySlug } = await import("./storyblok-story");
    await expect(
      fetchStoryBySlug({ slug: "missing", version: "published" }),
    ).resolves.toBeNull();
  });

  it("rethrows 401, 429, and 5xx as StoryblokUnavailableError", async () => {
    const { fetchStoryBySlug } = await import("./storyblok-story");
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    getMock.mockRejectedValue({ status: 401 });
    await expect(
      fetchStoryBySlug({ slug: "about", version: "published" }),
    ).rejects.toBeInstanceOf(StoryblokUnavailableError);

    getMock.mockRejectedValue({ status: 429 });
    await expect(
      fetchStoryBySlug({ slug: "about", version: "draft" }),
    ).rejects.toMatchObject({
      name: "StoryblokUnavailableError",
      status: 429,
      slug: "about",
      version: "draft",
    });

    getMock.mockRejectedValue({ status: 500 });
    await expect(
      fetchStoryBySlug({ slug: "about", version: "published" }),
    ).rejects.toBeInstanceOf(StoryblokUnavailableError);

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
