import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

const { draftModeMock, fetchStoryBySlugMock, notFoundMock } = vi.hoisted(
  () => ({
    draftModeMock: vi.fn(),
    fetchStoryBySlugMock: vi.fn(),
    notFoundMock: vi.fn(() => {
      throw new Error("NOT_FOUND");
    }),
  }),
);

vi.mock("next/headers", () => ({
  draftMode: draftModeMock,
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

vi.mock("@/lib/published-pages", () => ({
  excludeHomeCatchAllParams: (params: unknown) => params,
  getPublishedPageParams: vi.fn(async () => []),
}));

vi.mock("@/lib/blog", () => ({
  getDefaultStoryCategory: vi.fn(() => "ai"),
}));

vi.mock("./_helpers/story", () => ({
  fetchStoryBySlug: fetchStoryBySlugMock,
}));

vi.mock("./_components/render/render", () => ({
  Render: () => null,
}));

import Page, { generateMetadata } from "./page";

const FUTURE_SLUGS = [
  "devin-dreaming-agent-memory-review-the-writes",
  "agent-written-tests-marking-own-homework",
] as const;

const pageProps = (slug: string[]) => ({
  params: Promise.resolve({ slug }),
  searchParams: Promise.resolve({}),
});

const futureArticle = (slug: string) => ({
  id: 1,
  name: "Scheduled",
  slug,
  full_slug: `blog/${slug}`,
  first_published_at: "2099-01-01T00:00:00.000Z",
  content: { component: "article" },
});

describe("bare /blog/[slug] route", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-12T12:00:00.000Z"));
    draftModeMock.mockReset();
    fetchStoryBySlugMock.mockReset();
    notFoundMock.mockClear();
    draftModeMock.mockResolvedValue({ isEnabled: false });
  });

  it.each(
    FUTURE_SLUGS,
  )("returns not found for unreleased %s before rendering", async (slug) => {
    fetchStoryBySlugMock.mockResolvedValue(futureArticle(slug));

    await expect(Page(pageProps(["blog", slug]))).rejects.toThrow("NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalledOnce();
    expect(fetchStoryBySlugMock).toHaveBeenCalledWith({
      slug: `blog/${slug}`,
      version: "published",
    });
  });

  it.each(FUTURE_SLUGS)("noindexes unreleased %s", async (slug) => {
    fetchStoryBySlugMock.mockResolvedValue(futureArticle(slug));

    await expect(generateMetadata(pageProps(["blog", slug]))).resolves.toEqual({
      robots: { index: false, follow: false },
    });
  });

  it("renders a released article and a non-article page", async () => {
    fetchStoryBySlugMock.mockResolvedValue({
      ...futureArticle("mcp-tools-as-processes"),
      first_published_at: "2020-01-01T00:00:00.000Z",
    });

    await expect(
      Page(pageProps(["blog", "mcp-tools-as-processes"])),
    ).resolves.toBeTruthy();

    fetchStoryBySlugMock.mockResolvedValue({
      id: 2,
      name: "About",
      slug: "about",
      full_slug: "about",
      content: { component: "page" },
    });

    await expect(Page(pageProps(["about"]))).resolves.toBeTruthy();
    expect(notFoundMock).not.toHaveBeenCalled();
  });

  it("still renders an unreleased draft preview", async () => {
    draftModeMock.mockResolvedValue({ isEnabled: true });
    const slug = "devin-dreaming-agent-memory-review-the-writes";

    await expect(Page(pageProps(["blog", slug]))).resolves.toBeTruthy();
    expect(fetchStoryBySlugMock).not.toHaveBeenCalled();
    expect(notFoundMock).not.toHaveBeenCalled();
  });
});
