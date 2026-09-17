import { describe, expect, it, vi } from "vitest";
import { getDefaultStoryCategory } from "@/lib/blog";

vi.mock("@/lib/blog", () => {
  return {
    getDefaultStoryCategory: vi.fn(() => undefined),
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

const makeStory = (overrides: Partial<Record<string, unknown>> = {}) => {
  return {
    id: 42,
    uuid: "story-uuid",
    name: "Your Claude Code setup is probably wrong...",
    slug: "your-claude-code-setup-is-probably-wrong-ill-tell-you-why",
    full_slug:
      "blog/ai/your-claude-code-setup-is-probably-wrong-ill-tell-you-why",
    content: {
      component: "article",
      body: [],
    },
    ...overrides,
  };
};

describe("buildOrganizationJsonLd", () => {
  it("returns expected Organization schema for homepage", async () => {
    const { buildOrganizationJsonLd } = await import("@/lib/seo");
    const jsonLd = buildOrganizationJsonLd();

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Jim Drury",
      url: "https://www.jimdrury.co.uk",
      logo: "https://www.jimdrury.co.uk/logo.png",
      description:
        "Latest writing, ideas, and technical deep dives from Jim Drury.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "technical support",
      },
    });

    expect(jsonLd.sameAs).toEqual([
      "https://www.linkedin.com/in/jimdrury",
      "https://x.com/jim_drury",
      "https://github.com/jimdrury",
    ]);
  });
});

describe("buildPersonJsonLd", () => {
  it("uses a person headshot image URL", async () => {
    const { buildPersonJsonLd } = await import("@/lib/seo");
    const jsonLd = buildPersonJsonLd();

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Jim Drury",
      url: "https://www.jimdrury.co.uk/about",
      image:
        "https://a.storyblok.com/f/291093583118629/1463x3182/3fe55ff77b/profile-picture-full.jpg?cv=1774741806321",
    });
  });
});

describe("buildArticleJsonLd", () => {
  it("uses Organization publisher with logo", async () => {
    const { buildArticleJsonLd } = await import("@/lib/seo");
    const jsonLd = buildArticleJsonLd(makeStory() as never);

    expect(jsonLd.publisher).toMatchObject({
      "@type": "Organization",
      name: "Jim Drury",
      url: "https://www.jimdrury.co.uk",
      logo: {
        "@type": "ImageObject",
        url: "https://www.jimdrury.co.uk/logo.png",
      },
    });
  });
});

describe("getArticlePath", () => {
  it("returns the categorized /blog/[category]/[slug] route", async () => {
    vi.mocked(getDefaultStoryCategory).mockReturnValue("ai");
    const { getArticlePath } = await import("@/lib/seo");

    expect(getArticlePath(makeStory() as never)).toBe(
      "/blog/ai/your-claude-code-setup-is-probably-wrong-ill-tell-you-why",
    );
  });

  it("refuses untagged articles instead of emitting /blog/null", async () => {
    vi.mocked(getDefaultStoryCategory).mockReturnValue(null);
    const { getArticlePath, getArticlesWithPath } = await import("@/lib/seo");
    const untagged = makeStory({ slug: "untagged-article" });
    const path = getArticlePath(untagged as never);
    const interpolatedNullHref = `/blog/${null}/${untagged.slug}`;

    expect(interpolatedNullHref).toBe("/blog/null/untagged-article");
    expect(path).toBeNull();
    expect(path).not.toBe(interpolatedNullHref);
    expect(getArticlesWithPath([untagged as never])).toEqual([]);
  });

  it("omits untagged stories from listing hrefs", async () => {
    vi.mocked(getDefaultStoryCategory).mockImplementation((story) => {
      return story.slug === "tagged" ? "nextjs" : null;
    });
    const { getArticlesWithPath } = await import("@/lib/seo");
    const hrefs = getArticlesWithPath([
      makeStory({ slug: "untagged-article" }) as never,
      makeStory({ slug: "tagged" }) as never,
    ]).map((item) => item.path);

    expect(hrefs).toEqual(["/blog/nextjs/tagged"]);
    expect(hrefs.join()).not.toContain("/blog/null");
  });
});

describe("getStaticPagePath", () => {
  it("maps home to the site root", async () => {
    const { getStaticPagePath } = await import("@/lib/seo");

    expect(getStaticPagePath("home")).toBe("/");
    expect(getStaticPagePath(["home"])).toBe("/");
  });

  it("prefixes other slugs with a slash", async () => {
    const { getStaticPagePath } = await import("@/lib/seo");

    expect(getStaticPagePath("about")).toBe("/about");
    expect(getStaticPagePath(["work", "talks"])).toBe("/work/talks");
  });
});

describe("MISSING_STORY_METADATA", () => {
  it("asks crawlers not to index or follow missing stories", async () => {
    const { MISSING_STORY_METADATA } = await import("@/lib/seo");

    expect(MISSING_STORY_METADATA).toEqual({
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});

describe("buildArticleBreadcrumbJsonLd", () => {
  it("returns home, blog, category, and article breadcrumb items", async () => {
    vi.mocked(getDefaultStoryCategory).mockReturnValue("ai");
    const { buildArticleBreadcrumbJsonLd } = await import("@/lib/seo");
    const jsonLd = buildArticleBreadcrumbJsonLd(makeStory() as never);

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.jimdrury.co.uk",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://www.jimdrury.co.uk/blog",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "AI",
          item: "https://www.jimdrury.co.uk/blog/ai",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Your Claude Code setup is probably wrong...",
          item: "https://www.jimdrury.co.uk/blog/ai/your-claude-code-setup-is-probably-wrong-ill-tell-you-why",
        },
      ],
    });
  });

  it("omits the article crumb when no public categorized path exists", async () => {
    vi.mocked(getDefaultStoryCategory).mockReturnValue(null);
    const { buildArticleBreadcrumbJsonLd } = await import("@/lib/seo");
    const jsonLd = buildArticleBreadcrumbJsonLd(makeStory() as never);

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.jimdrury.co.uk",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: "https://www.jimdrury.co.uk/blog",
        },
      ],
    });
    expect(JSON.stringify(jsonLd)).not.toContain("/blog/null");
    expect(JSON.stringify(jsonLd)).not.toContain(
      "/blog/your-claude-code-setup-is-probably-wrong-ill-tell-you-why",
    );
  });
});
