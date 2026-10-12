import { beforeEach, describe, expect, it, vi } from "vitest";

const { draftModeMock, getArticleBySlugMock, notFoundMock } = vi.hoisted(
  () => ({
    draftModeMock: vi.fn(),
    getArticleBySlugMock: vi.fn(),
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

vi.mock("next/og", () => ({
  ImageResponse: class ImageResponse {
    constructor(public readonly element: unknown) {}
  },
}));

vi.mock("@/lib/blog", () => ({
  getDefaultStoryCategory: vi.fn(() => "ai"),
}));

vi.mock("@/storyblok/blog-listings", () => ({
  getArticleBySlug: getArticleBySlugMock,
}));

vi.mock("./_components/social-image/social-image", () => ({
  getSocialImageFontOptions: vi.fn(async () => []),
  SocialImage: () => null,
  socialImageAlt: "Featured article preview",
  socialImageContentType: "image/png",
  socialImageSize: { width: 1200, height: 630 },
  toSocialImagePayload: (payload: unknown) => payload,
}));

import OpenGraphImage from "./opengraph-image";

const FUTURE_SLUGS = [
  "devin-dreaming-agent-memory-review-the-writes",
  "agent-written-tests-marking-own-homework",
] as const;

const article = (slug: string, firstPublishedAt: string) => ({
  id: 1,
  name: slug,
  slug,
  full_slug: `blog/${slug}`,
  first_published_at: firstPublishedAt,
  content: { component: "article" },
});

describe("article opengraph image route", () => {
  beforeEach(() => {
    draftModeMock.mockReset();
    getArticleBySlugMock.mockReset();
    notFoundMock.mockClear();
    draftModeMock.mockResolvedValue({ isEnabled: false });
  });

  it.each(FUTURE_SLUGS)("returns not found for unreleased %s", async (slug) => {
    getArticleBySlugMock.mockResolvedValue(
      article(slug, "2099-01-01T00:00:00.000Z"),
    );

    await expect(
      OpenGraphImage({
        params: Promise.resolve({ category: "ai", slug }),
      }),
    ).rejects.toThrow("NOT_FOUND");
  });

  it("renders an image for a released article", async () => {
    const slug = "mcp-tools-as-processes";
    getArticleBySlugMock.mockResolvedValue(
      article(slug, "2020-01-01T00:00:00.000Z"),
    );

    await expect(
      OpenGraphImage({
        params: Promise.resolve({ category: "ai", slug }),
      }),
    ).resolves.toBeTruthy();
    expect(notFoundMock).not.toHaveBeenCalled();
  });
});
