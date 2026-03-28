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
        contactType: "Professional Services",
      },
    });

    expect(jsonLd.sameAs).toEqual([
      "https://www.linkedin.com/in/jimdrury",
      "https://x.com/jim_drury",
      "https://github.com/jimdrury",
    ]);
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
          name: "Ai",
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

  it("skips category breadcrumb when no default category exists", async () => {
    vi.mocked(getDefaultStoryCategory).mockReturnValue(undefined);
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
          name: "Your Claude Code setup is probably wrong...",
          item: "https://www.jimdrury.co.uk/blog/your-claude-code-setup-is-probably-wrong-ill-tell-you-why",
        },
      ],
    });
  });
});
