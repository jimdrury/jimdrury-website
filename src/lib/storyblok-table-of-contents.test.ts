import { describe, expect, it } from "vitest";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import {
  getTableOfContentsHeadingsFromBloks,
  getTypographyHeadingIdByUid,
} from "./storyblok-table-of-contents";

const createStory = (body: unknown[]): BlogStory => {
  return {
    id: 1,
    name: "Story",
    slug: "story",
    full_slug: "blog/story",
    content: {
      body,
    },
  };
};

describe("storyblok-table-of-contents", () => {
  it("creates text-based slugs for h2 and h3 headings", () => {
    const headings = getTableOfContentsHeadingsFromBloks([
      {
        component: "typography",
        _uid: "uid-h2",
        as: "h2",
        content: "Getting Started",
      },
      {
        component: "typography",
        _uid: "uid-p",
        as: "p",
        content: "Paragraph text",
      },
      {
        component: "typography",
        _uid: "uid-h3",
        as: "h3",
        content: "Install & Configure",
      },
    ]);

    expect(headings).toEqual([
      {
        uid: "uid-h2",
        id: "getting-started",
        level: "h2",
        text: "Getting Started",
      },
      {
        uid: "uid-h3",
        id: "install--configure",
        level: "h3",
        text: "Install & Configure",
      },
    ]);
  });

  it("suffixes duplicate heading slugs", () => {
    const headings = getTableOfContentsHeadingsFromBloks([
      {
        component: "typography",
        _uid: "uid-1",
        as: "h2",
        content: "Overview",
      },
      {
        component: "typography",
        _uid: "uid-2",
        as: "h3",
        content: "Overview",
      },
      {
        component: "typography",
        _uid: "uid-3",
        as: "h3",
        content: "Overview",
      },
    ]);

    expect(headings.map((heading) => heading.id)).toEqual([
      "overview",
      "overview-1",
      "overview-2",
    ]);
  });

  it("resolves heading id by uid using the story toc map", () => {
    const story = createStory([
      {
        component: "typography",
        _uid: "uid-1",
        as: "h2",
        content: "Overview",
      },
      {
        component: "typography",
        _uid: "uid-2",
        as: "h3",
        content: "Overview",
      },
    ]);

    expect(
      getTypographyHeadingIdByUid({
        uid: "uid-2",
        story,
        content: "Overview",
      }),
    ).toBe("overview-1");
  });
});
