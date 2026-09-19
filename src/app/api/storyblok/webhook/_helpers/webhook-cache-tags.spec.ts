import { describe, expect, it } from "vitest";
import { ALL_CONTENT_CACHE_TAGS } from "@/lib/cache-tags";
import { getWebhookRevalidationTags } from "./webhook-cache-tags";

const SHARED_TAGS = [
  "content:home-page",
  "content:story-page:published:blog",
  "content:blog:articles-by-tag:published",
  "content:blog:all-articles:published",
  "content:blog:latest-seed:published",
  "content:blog:tags:published",
  "content:blog:date-archive:published",
  "content:blog:index:published",
  "content:blog:category:published",
] as const;

const expectSharedListingAndHomeTags = (tags: string[]) => {
  for (const tag of SHARED_TAGS) {
    expect(tags).toContain(tag);
  }

  expect(tags).not.toContain("content:story-page");
  expect(tags).not.toContain("content:story-page:published");
  expect(tags).not.toContain("content:blog:article:published");
  expect(tags.every((tag) => !tag.includes(":draft"))).toBe(true);
};

describe("getWebhookRevalidationTags", () => {
  it("revalidates the article, blog listings, and homepage for an article publish", () => {
    const tags = getWebhookRevalidationTags("blog/test-article");

    expect(tags).toContain("content:blog:article:published:test-article");
    expect(tags).toContain("content:story-page:published:blog%2Ftest-article");
    expectSharedListingAndHomeTags(tags);
  });

  it("revalidates the changed page, blog listings, and homepage for a page publish", () => {
    const tags = getWebhookRevalidationTags("about");

    expect(tags).toContain("content:story-page:published:about");
    expect(tags).not.toContain("content:story-page:published:work");
    expectSharedListingAndHomeTags(tags);
  });

  it("includes the home page tag for the home slug", () => {
    const tags = getWebhookRevalidationTags("home");

    expect(tags).toContain("content:home-page");
    expect(tags).toContain("content:story-page:published:home");
    expectSharedListingAndHomeTags(tags);
  });

  it("falls back to homepage and listings when the slug is missing", () => {
    const tags = getWebhookRevalidationTags();

    expect(tags).toEqual(expect.arrayContaining([...SHARED_TAGS]));
    expect(tags).toHaveLength(SHARED_TAGS.length);
    expectSharedListingAndHomeTags(tags);
  });

  it("does not use the full all-content tag list", () => {
    const tags = getWebhookRevalidationTags("about");
    const allContent = new Set(ALL_CONTENT_CACHE_TAGS);

    expect(tags).not.toEqual([...ALL_CONTENT_CACHE_TAGS]);
    expect(tags.some((tag) => !allContent.has(tag))).toBe(true);
  });
});
