import { describe, expect, it } from "vitest";
import {
  type BlogStory,
  buildPaginationHref,
  getArticlePublishedAtValue,
  getArticleReleaseDate,
  getNextUnreleasedReleaseAt,
  getPageFromPathname,
  getVisibleArticles,
  isArticleReleased,
  parsePageParam,
} from "./blog-listings-utils";

const makeStory = (overrides: Partial<BlogStory> = {}): BlogStory => {
  return {
    id: 1,
    name: "Test article",
    slug: "test-article",
    full_slug: "blog/test-article",
    content: { component: "article" },
    ...overrides,
  };
};

describe("parsePageParam", () => {
  it("defaults to page 1", () => {
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
  });

  it("parses valid page numbers", () => {
    expect(parsePageParam("2")).toBe(2);
    expect(parsePageParam("12")).toBe(12);
  });
});

describe("getPageFromPathname", () => {
  it("returns page 1 when the path has no pagination segment", () => {
    expect(getPageFromPathname("/blog")).toBe(1);
    expect(getPageFromPathname("/about")).toBe(1);
  });

  it("reads the trailing /page/N segment", () => {
    expect(getPageFromPathname("/blog/page/2")).toBe(2);
    expect(getPageFromPathname("/blog/page/4")).toBe(4);
  });
});

describe("buildPaginationHref", () => {
  it("returns the base path for page 1", () => {
    expect(buildPaginationHref("/blog", 1)).toBe("/blog");
    expect(buildPaginationHref("/blog/page/3", 1)).toBe("/blog");
  });

  it("appends /page/N for later pages", () => {
    expect(buildPaginationHref("/blog", 2)).toBe("/blog/page/2");
    expect(buildPaginationHref("/blog/page/2", 3)).toBe("/blog/page/3");
  });
});

describe("article release visibility", () => {
  const now = new Date("2026-09-24T15:30:00.000Z");

  it("prefers first_published_at over published_at", () => {
    const story = makeStory({
      first_published_at: "2026-09-20T12:00:00.000Z",
      published_at: "2026-09-22T12:00:00.000Z",
    });

    expect(getArticlePublishedAtValue(story)).toBe("2026-09-20T12:00:00.000Z");
    expect(getArticleReleaseDate(story)).toBe("2026-09-20");
  });

  it("treats a missing or invalid published date as already released", () => {
    expect(isArticleReleased(makeStory(), now)).toBe(true);
    expect(
      isArticleReleased(makeStory({ first_published_at: "   " }), now),
    ).toBe(true);
    expect(
      isArticleReleased(makeStory({ first_published_at: "not-a-date" }), now),
    ).toBe(true);
  });

  it("hides an article when the current date is before its published date", () => {
    const story = makeStory({
      first_published_at: "2026-09-25T00:00:00.000Z",
    });

    expect(isArticleReleased(story, now)).toBe(false);
    expect(isArticleReleased(story, new Date("2026-09-24T23:59:59.000Z"))).toBe(
      false,
    );
  });

  it("shows an article on and after its published calendar date", () => {
    const story = makeStory({
      first_published_at: "2026-09-24T23:00:00.000Z",
    });

    expect(isArticleReleased(story, now)).toBe(true);
    expect(
      isArticleReleased(
        makeStory({ first_published_at: "2026-09-23T08:00:00.000Z" }),
        now,
      ),
    ).toBe(true);
  });

  it("keeps future-dated articles in draft listings and drops them when published", () => {
    const past = makeStory({
      id: 1,
      slug: "past",
      first_published_at: "2026-09-20T12:00:00.000Z",
    });
    const future = makeStory({
      id: 2,
      slug: "future",
      first_published_at: "2026-12-01T09:00:00.000Z",
    });

    expect(getVisibleArticles([past, future], "draft", now)).toEqual([
      past,
      future,
    ]);
    expect(getVisibleArticles([past, future], "published", now)).toEqual([
      past,
    ]);
  });

  it("returns the next unreleased publish midnight for cache expiry", () => {
    const stories = [
      makeStory({
        slug: "later",
        first_published_at: "2026-12-02T00:00:00.000Z",
      }),
      makeStory({
        slug: "sooner",
        first_published_at: "2026-12-01T15:00:00.000Z",
      }),
      makeStory({
        slug: "live",
        first_published_at: "2026-09-01T00:00:00.000Z",
      }),
    ];

    expect(getNextUnreleasedReleaseAt(stories, now)).toEqual(
      new Date("2026-12-01T00:00:00.000Z"),
    );
    expect(
      getNextUnreleasedReleaseAt(
        [makeStory({ first_published_at: "2026-09-01T00:00:00.000Z" })],
        now,
      ),
    ).toBeNull();
  });
});
