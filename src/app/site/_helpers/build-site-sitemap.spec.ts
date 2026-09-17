import { describe, expect, it, vi } from "vitest";
import { buildSiteSitemap } from "./build-site-sitemap";

vi.mock("@/lib/blog", () => {
  return {
    getDefaultStoryCategory: vi.fn(() => null),
  };
});

vi.mock("@/lib/read-time", () => {
  return {
    estimateWordCount: () => 0,
  };
});

vi.mock("@/storyblok/blog-listings-utils", () => {
  return {
    getFeaturedImageAsset: () => null,
    parseStoryblokImageDimensions: () => null,
  };
});

describe("buildSiteSitemap", () => {
  it("maps published page params to public URLs with home as /", () => {
    const entries = buildSiteSitemap([
      { slug: ["home"] },
      { slug: ["about"] },
      { slug: ["blog"] },
    ]);

    expect(entries.map((entry) => entry.url)).toEqual([
      "https://www.jimdrury.co.uk/",
      "https://www.jimdrury.co.uk/about",
      "https://www.jimdrury.co.uk/blog",
    ]);
    expect(entries[0]).toMatchObject({
      changeFrequency: "weekly",
      priority: 1,
    });
  });

  it("does not emit /home", () => {
    const [home] = buildSiteSitemap([{ slug: ["home"] }]);

    expect(home?.url).toBe("https://www.jimdrury.co.uk/");
    expect(home?.url).not.toBe("https://www.jimdrury.co.uk/home");
  });
});
