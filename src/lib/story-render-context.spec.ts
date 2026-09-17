import { describe, expect, it } from "vitest";
import type { StoryData } from "@/storyblok/lib";
import {
  asBlogStory,
  getStoryName,
  getStoryUpdatedAt,
  isBlogStory,
} from "./story-render-context";

const articleStory = {
  id: 12,
  name: "Shipping agents",
  slug: "shipping-agents",
  full_slug: "blog/shipping-agents",
  published_at: "2026-04-13T12:00:00.000Z",
  content: {
    component: "article",
    body: [],
  },
};

const pageStory: StoryData = {
  name: "Privacy Policy",
  content: {
    component: "page",
  },
};

describe("story-render-context", () => {
  it("treats article stories as blog stories and ignores other types", () => {
    expect(isBlogStory(articleStory)).toBe(true);
    expect(asBlogStory(articleStory)?.slug).toBe("shipping-agents");
    expect(asBlogStory(pageStory)).toBeNull();
    expect(asBlogStory(null)).toBeNull();
    expect(asBlogStory("article")).toBeNull();
  });

  it("reads the story name and updated timestamp without mutation", () => {
    expect(getStoryName(articleStory)).toBe("Shipping agents");
    expect(getStoryUpdatedAt(articleStory)).toBe("2026-04-13T12:00:00.000Z");
    expect(
      getStoryUpdatedAt({
        content: { component: "page" },
        published_at: "2026-03-03T00:00:00.000Z",
        first_published_at: "2026-02-02T00:00:00.000Z",
      }),
    ).toBe("2026-03-03T00:00:00.000Z");
    expect(
      getStoryUpdatedAt({
        content: { component: "page" },
        first_published_at: "2026-02-02T00:00:00.000Z",
      }),
    ).toBe("2026-02-02T00:00:00.000Z");
    expect(getStoryName(null)).toBeNull();
    expect(getStoryUpdatedAt(null)).toBeNull();
    expect(getStoryName({ content: { component: "page" } })).toBeNull();
  });
});
