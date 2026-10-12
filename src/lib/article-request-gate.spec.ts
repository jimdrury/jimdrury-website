import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import {
  canRenderArticleImage,
  decideArticleVisitorAccess,
  decideMarkdownVisitorAccess,
  getArticleRoute,
  isPublicArticleStory,
  isUnreleasedArticleStory,
  resolveArticleProxyAction,
} from "./article-request-gate";

const TODAY = "2026-10-12";
const FUTURE_SLUGS = [
  "devin-dreaming-agent-memory-review-the-writes",
  "agent-written-tests-marking-own-homework",
] as const;

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

const futureStory = (slug: string): BlogStory => {
  return makeStory({
    slug,
    full_slug: `blog/${slug}`,
    first_published_at: "2026-10-13T00:00:00.000Z",
  });
};

const releasedStory = (slug: string): BlogStory => {
  return makeStory({
    slug,
    full_slug: `blog/${slug}`,
    first_published_at: "2026-10-01T00:00:00.000Z",
  });
};

const articlePaths = (slug: string): string[] => {
  return [
    `/blog/${slug}`,
    `/blog/ai/${slug}`,
    `/blog/general/${slug}`,
    `/blog/ai/${slug}/markdown`,
    `/blog/ai/${slug}/opengraph-image`,
    `/blog/ai/${slug}/twitter-image`,
    `/blog/${slug}.md`,
    `/blog/ai/${slug}.md`,
  ];
};

describe("getArticleRoute", () => {
  it.each(FUTURE_SLUGS)("classifies every route that can render %s", (slug) => {
    expect(getArticleRoute(`/blog/${slug}`)).toEqual({
      kind: "bare",
      slug,
    });
    expect(getArticleRoute(`/blog/ai/${slug}`)).toEqual({
      kind: "canonical",
      category: "ai",
      slug,
    });
    expect(getArticleRoute(`/blog/general/${slug}`)).toEqual({
      kind: "canonical",
      category: "general",
      slug,
    });
    expect(getArticleRoute(`/blog/ai/${slug}/markdown`)).toEqual({
      kind: "alias",
      category: "ai",
      slug,
      alias: "markdown",
    });
    expect(getArticleRoute(`/blog/ai/${slug}/opengraph-image`)).toEqual({
      kind: "alias",
      category: "ai",
      slug,
      alias: "opengraph-image",
    });
    expect(getArticleRoute(`/blog/ai/${slug}/twitter-image`)).toEqual({
      kind: "alias",
      category: "ai",
      slug,
      alias: "twitter-image",
    });
    expect(getArticleRoute(`/blog/${slug}.md`)).toEqual({
      kind: "bare",
      slug,
    });
    expect(getArticleRoute(`/blog/ai/${slug}.md`)).toEqual({
      kind: "alias",
      category: "ai",
      slug,
      alias: "markdown",
    });
  });

  it("ignores the blog index, pagination, sitemap, and draft preview", () => {
    expect(getArticleRoute("/blog")).toBeNull();
    expect(getArticleRoute("/blog/page/2")).toBeNull();
    expect(getArticleRoute("/blog/sitemap.xml")).toBeNull();
    expect(getArticleRoute("/blog/_/draft-preview")).toBeNull();
  });
});

describe("isPublicArticleStory", () => {
  it("hides future-dated articles and non-articles", () => {
    expect(isPublicArticleStory(makeStory(), TODAY)).toBe(false);
    expect(
      isPublicArticleStory(
        makeStory({ first_published_at: "2026-10-12T00:00:00.000Z" }),
        TODAY,
      ),
    ).toBe(true);
    expect(
      isPublicArticleStory(
        makeStory({ content: { component: "page" } }),
        TODAY,
      ),
    ).toBe(false);
    expect(isPublicArticleStory(null, TODAY)).toBe(false);
  });
});

describe("resolveArticleProxyAction", () => {
  it.each(
    FUTURE_SLUGS,
  )("blocks unreleased %s before any route can redirect or render", (slug) => {
    const story = futureStory(slug);

    for (const pathname of articlePaths(slug)) {
      expect(resolveArticleProxyAction({ pathname, story, today: TODAY })).toBe(
        "block",
      );
    }
  });

  it("lets a released article through on every article route", () => {
    const slug = "mcp-tools-as-processes";
    const story = releasedStory(slug);

    for (const pathname of articlePaths(slug)) {
      expect(resolveArticleProxyAction({ pathname, story, today: TODAY })).toBe(
        "next",
      );
    }
  });

  it("leaves non-article and public routes alone", () => {
    const page = makeStory({
      slug: "blog",
      content: { component: "page" },
    });

    expect(
      resolveArticleProxyAction({
        pathname: "/blog/about-the-blog",
        story: page,
        today: TODAY,
      }),
    ).toBe("next");
    expect(
      resolveArticleProxyAction({
        pathname: "/blog/missing-note",
        story: null,
        today: TODAY,
      }),
    ).toBe("next");
    expect(
      resolveArticleProxyAction({
        pathname: "/blog/page/2",
        story: futureStory("page"),
        today: TODAY,
      }),
    ).toBe("next");
    expect(
      resolveArticleProxyAction({
        pathname: "/blog/sitemap.xml",
        story: futureStory("sitemap"),
        today: TODAY,
      }),
    ).toBe("next");
    expect(
      resolveArticleProxyAction({
        pathname: "/blog/_/devin-dreaming-agent-memory-review-the-writes",
        story: futureStory("devin-dreaming-agent-memory-review-the-writes"),
        today: TODAY,
      }),
    ).toBe("next");
  });

  it("blocks a missing canonical or alias story and fails open when lookup fails", () => {
    expect(
      resolveArticleProxyAction({
        pathname: "/blog/ai/devin-dreaming-agent-memory-review-the-writes",
        story: null,
        today: TODAY,
      }),
    ).toBe("block");
    expect(
      resolveArticleProxyAction({
        pathname:
          "/blog/ai/agent-written-tests-marking-own-homework/opengraph-image",
        story: null,
        today: TODAY,
      }),
    ).toBe("block");
    expect(
      resolveArticleProxyAction({
        pathname: "/blog/agent-written-tests-marking-own-homework",
        story: undefined,
        today: TODAY,
      }),
    ).toBe("next");
  });

  it("skips the gate for draft previews", () => {
    expect(
      resolveArticleProxyAction({
        pathname: "/blog/devin-dreaming-agent-memory-review-the-writes",
        story: futureStory("devin-dreaming-agent-memory-review-the-writes"),
        draft: true,
        today: TODAY,
      }),
    ).toBe("next");
  });

  it("registers a proxy matcher for each article route", () => {
    const source = readFileSync(resolve(process.cwd(), "src/proxy.ts"), "utf8");

    expect(source).toContain('"/blog/:slug"');
    expect(source).toContain('"/blog/:category/:slug"');
    expect(source).toContain('"/blog/:category/:slug/markdown"');
    expect(source).toContain('"/blog/:category/:slug/opengraph-image"');
    expect(source).toContain('"/blog/:category/:slug/twitter-image"');
  });
});

describe("decideArticleVisitorAccess", () => {
  it("returns not-found for an unreleased article before a category redirect", () => {
    const slug = "devin-dreaming-agent-memory-review-the-writes";

    expect(
      decideArticleVisitorAccess({
        story: futureStory(slug),
        category: "general",
        slug,
        draft: false,
        canonicalCategory: "ai",
        today: TODAY,
      }),
    ).toEqual({ type: "not-found" });
  });

  it("redirects a released article only after the release gate passes", () => {
    const slug = "mcp-tools-as-processes";

    expect(
      decideArticleVisitorAccess({
        story: releasedStory(slug),
        category: "general",
        slug,
        draft: false,
        canonicalCategory: "ai",
        today: TODAY,
      }),
    ).toEqual({ type: "redirect", href: `/blog/ai/${slug}` });
    expect(
      decideArticleVisitorAccess({
        story: releasedStory(slug),
        category: "ai",
        slug,
        draft: false,
        canonicalCategory: "ai",
        today: TODAY,
      }),
    ).toEqual({ type: "render" });
  });

  it("renders an unreleased draft and hides a story with no category", () => {
    const slug = "agent-written-tests-marking-own-homework";

    expect(
      decideArticleVisitorAccess({
        story: futureStory(slug),
        category: "ai",
        slug,
        draft: true,
        canonicalCategory: "ai",
        today: TODAY,
      }),
    ).toEqual({ type: "render" });
    expect(
      decideArticleVisitorAccess({
        story: releasedStory(slug),
        category: "ai",
        slug,
        draft: false,
        canonicalCategory: null,
        today: TODAY,
      }),
    ).toEqual({ type: "not-found" });
    expect(
      decideArticleVisitorAccess({
        story: null,
        category: "ai",
        slug,
        draft: false,
        canonicalCategory: "ai",
        today: TODAY,
      }),
    ).toEqual({ type: "not-found" });
  });
});

describe("decideMarkdownVisitorAccess", () => {
  it("returns not-found for an unreleased article before the markdown redirect", () => {
    const slug = "agent-written-tests-marking-own-homework";

    expect(
      decideMarkdownVisitorAccess({
        story: futureStory(slug),
        requestedCategory: "general",
        slug,
        draft: false,
        canonicalCategory: "ai",
        today: TODAY,
      }),
    ).toEqual({ type: "not-found" });
  });

  it("redirects a released markdown alias only after the release gate passes", () => {
    const slug = "mcp-tools-as-processes";

    expect(
      decideMarkdownVisitorAccess({
        story: releasedStory(slug),
        requestedCategory: "General",
        slug,
        draft: false,
        canonicalCategory: "ai",
        today: TODAY,
      }),
    ).toEqual({ type: "redirect", href: `/blog/ai/${slug}.md` });
    expect(
      decideMarkdownVisitorAccess({
        story: releasedStory(slug),
        requestedCategory: "AI",
        slug,
        draft: false,
        canonicalCategory: "ai",
        today: TODAY,
      }),
    ).toEqual({ type: "render" });
  });
});

describe("canRenderArticleImage", () => {
  it("hides open graph and twitter images for unreleased articles", () => {
    const slug = "devin-dreaming-agent-memory-review-the-writes";

    expect(
      canRenderArticleImage({
        story: futureStory(slug),
        draft: false,
        today: TODAY,
      }),
    ).toBe(false);
    expect(
      canRenderArticleImage({ story: null, draft: false, today: TODAY }),
    ).toBe(false);
    expect(
      canRenderArticleImage({
        story: releasedStory(slug),
        draft: false,
        today: TODAY,
      }),
    ).toBe(true);
    expect(
      canRenderArticleImage({
        story: futureStory(slug),
        draft: true,
        today: TODAY,
      }),
    ).toBe(true);
  });
});

describe("isUnreleasedArticleStory", () => {
  it("recognises a future-dated article on the bare slug route", () => {
    expect(
      isUnreleasedArticleStory(
        futureStory("devin-dreaming-agent-memory-review-the-writes"),
        TODAY,
      ),
    ).toBe(true);
    expect(
      isUnreleasedArticleStory(
        releasedStory("agent-written-tests-marking-own-homework"),
        TODAY,
      ),
    ).toBe(false);
    expect(
      isUnreleasedArticleStory(
        makeStory({ content: { component: "page" } }),
        TODAY,
      ),
    ).toBe(false);
    expect(isUnreleasedArticleStory(null, TODAY)).toBe(false);
  });
});
