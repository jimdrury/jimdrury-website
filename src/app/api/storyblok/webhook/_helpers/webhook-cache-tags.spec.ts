import { describe, expect, it } from "vitest";
import { ALL_CONTENT_CACHE_TAGS } from "@/lib/cache-tags";
import { getWebhookRevalidationTags } from "./webhook-cache-tags";

describe("getWebhookRevalidationTags", () => {
  it("scopes article publishes to blog listing and article tags", () => {
    const tags = getWebhookRevalidationTags("blog/test-article");

    expect(tags).toContain("content:blog:article:published:test-article");
    expect(tags).toContain("content:blog:index:published");
    expect(tags.every((tag) => !tag.includes(":draft"))).toBe(true);
  });

  it("scopes page publishes to the story slug tag", () => {
    const tags = getWebhookRevalidationTags("about");

    expect(tags).toContain("content:story-page:published:about");
    expect(tags).toContain("content:story-page:published");
    expect(tags).not.toContain("content:blog:index:published");
  });

  it("includes the home page tag for the home slug", () => {
    const tags = getWebhookRevalidationTags("home");

    expect(tags).toContain("content:home-page");
    expect(tags).toContain("content:story-page:published:home");
  });

  it("does not use the full all-content tag list", () => {
    const tags = getWebhookRevalidationTags("about");
    const allContent = new Set(ALL_CONTENT_CACHE_TAGS);

    expect(tags).not.toEqual([...ALL_CONTENT_CACHE_TAGS]);
    expect(tags.some((tag) => !allContent.has(tag))).toBe(true);
  });
});
