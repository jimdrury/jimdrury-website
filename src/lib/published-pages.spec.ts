import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  cacheLife: () => undefined,
  cacheTag: () => undefined,
}));

vi.mock("@/storyblok", () => ({
  getStoryblokApi: () => ({ get: vi.fn() }),
  getStoryblokCv: () => 1,
}));

vi.mock("@/lib/cache-tags", () => ({
  getPublishedPagesTag: () => "published-pages",
}));

describe("excludeHomeCatchAllParams", () => {
  it("drops the home slug so /home is not a public catch-all path", async () => {
    const { excludeHomeCatchAllParams } = await import("./published-pages");

    expect(
      excludeHomeCatchAllParams([
        { slug: ["home"] },
        { slug: ["about"] },
        { slug: ["work", "talks"] },
      ]),
    ).toEqual([{ slug: ["about"] }, { slug: ["work", "talks"] }]);
  });

  it("returns an empty list when home is the only page", async () => {
    const { excludeHomeCatchAllParams } = await import("./published-pages");

    expect(excludeHomeCatchAllParams([{ slug: ["home"] }])).toEqual([]);
  });
});
