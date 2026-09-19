import { describe, expect, it } from "vitest";
import {
  getBlogArticleSlugTag,
  getBlogListingVersionTags,
  getBlogVersionTag,
  getHomePageTag,
  getPublishedPagesTag,
  getStoryCacheTags,
  getStorySlugVersionTag,
} from "./cache-tags";

describe("getStoryCacheTags", () => {
  it("tags a regular story with only its slug", () => {
    expect(getStoryCacheTags({ slug: "about", version: "published" })).toEqual([
      "content:story-page:published:about",
    ]);
  });

  it("adds the home page tag for the home story", () => {
    expect(getStoryCacheTags({ slug: "home", version: "published" })).toEqual([
      "content:story-page:published:home",
      "content:home-page",
    ]);
  });

  it("keeps draft home stories on the same home page tag", () => {
    expect(getStoryCacheTags({ slug: "home", version: "draft" })).toEqual([
      "content:story-page:draft:home",
      "content:home-page",
    ]);
  });
});

describe("getBlogListingVersionTags", () => {
  it("returns published listing scopes without the shared article tag", () => {
    const tags = getBlogListingVersionTags("published");

    expect(tags).toEqual([
      "content:blog:articles-by-tag:published",
      "content:blog:all-articles:published",
      "content:blog:latest-seed:published",
      "content:blog:tags:published",
      "content:blog:date-archive:published",
      "content:blog:index:published",
      "content:blog:category:published",
    ]);
    expect(tags).not.toContain("content:blog:article:published");
  });
});

describe("cache tag helpers", () => {
  it("builds stable home and published-pages tags", () => {
    expect(getHomePageTag()).toBe("content:home-page");
    expect(getPublishedPagesTag()).toBe("content:published-pages");
  });

  it("normalizes slug segments", () => {
    expect(
      getStorySlugVersionTag({ slug: "Work/Talks", version: "published" }),
    ).toBe("content:story-page:published:work%2Ftalks");
    expect(
      getBlogArticleSlugTag({ slug: "Test Article", version: "published" }),
    ).toBe("content:blog:article:published:test%20article");
  });

  it("still can name the shared article version tag without applying it", () => {
    expect(getBlogVersionTag({ scope: "article", version: "published" })).toBe(
      "content:blog:article:published",
    );
  });
});
