import { describe, expect, it } from "vitest";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import {
  getTableOfContentsHeadingsFromBloks,
  getTypographyHeadingId,
  getTypographyHeadingIdByUid,
} from "./table-of-contents";

const createStory = (
  body: NonNullable<BlogStory["content"]["body"]>,
): BlogStory => {
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
  it("slugs ampersands with github-slugger, not collapsed hyphens", () => {
    expect(getTypographyHeadingId("Install & Configure")).toBe(
      "install--configure",
    );
  });

  it("creates text-based slugs for h2, h3, and h4 headings", () => {
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
      {
        component: "typography",
        _uid: "uid-h4",
        as: "h4",
        content: "Caveats",
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
      {
        uid: "uid-h4",
        id: "caveats",
        level: "h4",
        text: "Caveats",
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

  it("resolves h4 heading ids by uid", () => {
    const story = createStory([
      {
        component: "typography",
        _uid: "uid-h4",
        as: "h4",
        content: "Caveats",
      },
    ]);

    expect(
      getTypographyHeadingIdByUid({
        uid: "uid-h4",
        story,
        content: "Caveats",
      }),
    ).toBe("caveats");
  });
});
