import { describe, expect, it } from "vitest";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import {
  getArticleSlugFromPath,
  isPublicArticleStory,
} from "./article-request-gate";

const makeStory = (overrides: Partial<BlogStory> = {}): BlogStory => {
  return {
    id: 1,
    name: "Scheduled",
    slug: "scheduled",
    full_slug: "blog/scheduled",
    first_published_at: "2026-10-13T00:00:00.000Z",
    content: { component: "article" },
    ...overrides,
  };
};

describe("getArticleSlugFromPath", () => {
  it("reads the article slug and ignores pagination and preview paths", () => {
    expect(
      getArticleSlugFromPath(
        "/blog/ai/agent-written-tests-marking-own-homework",
      ),
    ).toBe("agent-written-tests-marking-own-homework");
    expect(getArticleSlugFromPath("/blog/page/2")).toBeNull();
    expect(getArticleSlugFromPath("/blog/_/draft-preview")).toBeNull();
    expect(getArticleSlugFromPath("/blog")).toBeNull();
  });
});

describe("isPublicArticleStory", () => {
  it("hides future-dated articles and non-articles", () => {
    const now = new Date("2026-10-12T12:00:00.000Z");

    expect(isPublicArticleStory(makeStory(), now)).toBe(false);
    expect(
      isPublicArticleStory(
        makeStory({ first_published_at: "2026-10-12T00:00:00.000Z" }),
        now,
      ),
    ).toBe(true);
    expect(
      isPublicArticleStory(makeStory({ content: { component: "page" } }), now),
    ).toBe(false);
    expect(isPublicArticleStory(null, now)).toBe(false);
  });
});
