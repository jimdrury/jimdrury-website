/** @vitest-environment node */

import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { proxy } from "./proxy";

const FUTURE = "2099-01-01T00:00:00.000Z";
const RELEASED = "2020-01-01T00:00:00.000Z";
const FUTURE_SLUGS = [
  "devin-dreaming-agent-memory-review-the-writes",
  "agent-written-tests-marking-own-homework",
] as const;

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

const storyResponse = (
  firstPublishedAt: string,
  component = "article",
): Response => {
  return new Response(
    JSON.stringify({
      story: {
        content: { component },
        first_published_at: firstPublishedAt,
      },
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
};

const requestFor = (pathname: string, cookie?: string): NextRequest => {
  return new NextRequest(`https://www.jimdrury.co.uk${pathname}`, {
    headers: cookie ? { cookie } : undefined,
  });
};

describe("proxy article release gate", () => {
  const originalToken = process.env.STORYBLOK_ACCESS_TOKEN;
  let requestedPaths: string[] = [];

  afterEach(() => {
    vi.unstubAllGlobals();
    requestedPaths = [];
    if (originalToken === undefined) {
      delete process.env.STORYBLOK_ACCESS_TOKEN;
    } else {
      process.env.STORYBLOK_ACCESS_TOKEN = originalToken;
    }
  });

  const stubStory = (firstPublishedAt: string, status = 200): void => {
    process.env.STORYBLOK_ACCESS_TOKEN = "test-token";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = new URL(String(input));
        requestedPaths.push(url.pathname);
        if (status === 404) {
          return new Response(null, { status: 404 });
        }

        return storyResponse(firstPublishedAt);
      }),
    );
  };

  it.each(
    FUTURE_SLUGS,
  )("rewrites unreleased %s to a real 404 before any route runs", async (slug) => {
    stubStory(FUTURE);

    for (const pathname of articlePaths(slug)) {
      const response = await proxy(requestFor(pathname));

      expect(response.headers.get("x-middleware-next")).toBeNull();
      expect(response.headers.get("x-middleware-rewrite")).toContain(
        "/article-not-found",
      );
    }

    expect(requestedPaths).toEqual(
      articlePaths(slug).map(() => `/v2/cdn/stories/blog/${slug}`),
    );
  });

  it("lets a released article through on the bare slug and its aliases", async () => {
    const slug = "mcp-tools-as-processes";
    stubStory(RELEASED);

    for (const pathname of articlePaths(slug)) {
      const response = await proxy(requestFor(pathname));

      expect(response.headers.get("x-middleware-rewrite")).toBeNull();
      expect(response.headers.get("x-middleware-next")).toBe("1");
    }
  });

  it("does not fetch or block the blog index, pagination, or sitemap", async () => {
    stubStory(FUTURE);

    for (const pathname of ["/blog/page/2", "/blog/sitemap.xml", "/blog"]) {
      const response = await proxy(requestFor(pathname));

      expect(response.headers.get("x-middleware-next")).toBe("1");
      expect(response.headers.get("x-middleware-rewrite")).toBeNull();
    }

    expect(requestedPaths).toEqual([]);
  });

  it("blocks a missing canonical story and leaves a missing bare slug alone", async () => {
    stubStory(FUTURE, 404);
    const slug = "devin-dreaming-agent-memory-review-the-writes";

    const canonical = await proxy(requestFor(`/blog/ai/${slug}`));
    const bare = await proxy(requestFor(`/blog/${slug}`));

    expect(canonical.headers.get("x-middleware-rewrite")).toContain(
      "/article-not-found",
    );
    expect(bare.headers.get("x-middleware-next")).toBe("1");
    expect(bare.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("fails open when Storyblok cannot be reached", async () => {
    process.env.STORYBLOK_ACCESS_TOKEN = "test-token";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network");
      }),
    );

    const response = await proxy(
      requestFor("/blog/devin-dreaming-agent-memory-review-the-writes"),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("skips the lookup for a draft preview cookie", async () => {
    stubStory(FUTURE);

    const response = await proxy(
      requestFor(
        "/blog/devin-dreaming-agent-memory-review-the-writes",
        "__prerender_bypass=1",
      ),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(requestedPaths).toEqual([]);
  });
});
