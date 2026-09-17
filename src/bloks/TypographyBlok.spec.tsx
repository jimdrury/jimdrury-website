import { render } from "@testing-library/react";
import type { FC } from "react";
import { describe, expect, it } from "vitest";
import { TableOfContents } from "@/components/table-of-contents";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import { TypographyBlok } from "./TypographyBlok";

type TypographyFixtureBlok = {
  _uid: string;
  component: "typography";
  as: "p" | "h2" | "h3" | "h4";
  content: string;
};

const createStory = (body: TypographyFixtureBlok[]): BlogStory => {
  return {
    id: 1,
    name: "Story",
    slug: "story",
    full_slug: "blog/story",
    content: {
      component: "article",
      body,
    },
  };
};

const BodyAndToc: FC<{ story: BlogStory }> = ({ story }) => {
  return (
    <div>
      {(story.content.body ?? []).map((blok) => (
        <TypographyBlok
          key={typeof blok._uid === "string" ? blok._uid : undefined}
          blok={{
            component: "typography",
            _uid: typeof blok._uid === "string" ? blok._uid : undefined,
            as: typeof blok.as === "string" ? blok.as : undefined,
            content:
              typeof blok.content === "string" ? blok.content : undefined,
          }}
          pathname="/blog/story"
          story={story}
        />
      ))}
      <TableOfContents maxHeadingLevel="h4" story={story} />
    </div>
  );
};

describe("TypographyBlok heading ids", () => {
  it("matches every TOC href to a heading id, including ampersands, duplicates, and h4", () => {
    const story = createStory([
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
        _uid: "uid-overview-1",
        as: "h2",
        content: "Overview",
      },
      {
        component: "typography",
        _uid: "uid-overview-2",
        as: "h3",
        content: "Overview",
      },
      {
        component: "typography",
        _uid: "uid-h4",
        as: "h4",
        content: "Caveats",
      },
    ]);

    const { container } = render(<BodyAndToc story={story} />);

    const headingIds = [
      "getting-started",
      "install--configure",
      "overview",
      "overview-1",
      "caveats",
    ];

    for (const id of headingIds) {
      expect(container.querySelector(`[id="${id}"]`)).not.toBeNull();
    }

    expect(container.querySelector("h4#caveats")).not.toBeNull();
    expect(container.querySelector('[id="install-configure"]')).toBeNull();

    const fragmentIds = [...container.querySelectorAll("a[href^='#']")]
      .map((anchor) => anchor.getAttribute("href")?.slice(1))
      .filter((id): id is string => Boolean(id));

    expect(fragmentIds.length).toBeGreaterThan(0);

    for (const id of fragmentIds) {
      expect(container.querySelector(`[id="${id}"]`)).not.toBeNull();
    }
  });
});
