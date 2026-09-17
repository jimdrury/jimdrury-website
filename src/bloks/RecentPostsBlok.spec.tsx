import { render, screen } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecentPostsBlok } from "./RecentPostsBlok";

const mocks = vi.hoisted(() => ({
  getBlogIndexArchive: vi.fn(),
  getArticlesWithPath: vi.fn(),
  getFeaturedImageAsset: vi.fn(),
  parseStoryblokImageDimensions: vi.fn(),
  getDefaultStoryCategory: vi.fn(),
  formatStoryDate: vi.fn(),
  getStoryDateTime: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    fetchPriority,
  }: {
    alt: string;
    src: string;
    fetchPriority?: "high" | "low" | "auto";
  }) => (
    // biome-ignore lint/performance/noImgElement: next/image mock for unit tests
    <img alt={alt} src={src} fetchPriority={fetchPriority} />
  ),
}));

vi.mock("@/lib/blog", () => ({
  getBlogIndexArchive: mocks.getBlogIndexArchive,
  getFeaturedImageAsset: mocks.getFeaturedImageAsset,
  parseStoryblokImageDimensions: mocks.parseStoryblokImageDimensions,
  getDefaultStoryCategory: mocks.getDefaultStoryCategory,
  formatStoryDate: mocks.formatStoryDate,
  getStoryDateTime: mocks.getStoryDateTime,
}));

vi.mock("@/lib/seo", () => ({
  getArticlesWithPath: mocks.getArticlesWithPath,
}));

const renderRecentPosts = async (
  blok: Parameters<typeof RecentPostsBlok>[0]["blok"],
) => {
  const view = (await RecentPostsBlok({ blok })) as ReactElement;
  return render(view);
};

describe("RecentPostsBlok", () => {
  beforeEach(() => {
    mocks.getBlogIndexArchive.mockResolvedValue({ stories: [{ uuid: "1" }] });
    mocks.getArticlesWithPath.mockReturnValue([
      {
        story: {
          uuid: "story-1",
          name: "First post",
          content: { excerpt: "Hello" },
        },
        path: "/blog/nextjs/first-post",
      },
      {
        story: {
          uuid: "story-2",
          name: "Second post",
          content: { excerpt: "World" },
        },
        path: "/blog/nextjs/second-post",
      },
    ]);
    mocks.getFeaturedImageAsset.mockReturnValue({
      filename: "https://a.storyblok.com/f/1/800x600/img.jpg",
      alt: "Cover",
    });
    mocks.parseStoryblokImageDimensions.mockReturnValue({
      width: 800,
      height: 600,
    });
    mocks.getDefaultStoryCategory.mockReturnValue("nextjs");
    mocks.formatStoryDate.mockReturnValue("1 Jan 2026");
    mocks.getStoryDateTime.mockReturnValue("2026-01-01");
  });

  it("renders featured images on a secondary background", async () => {
    const { container } = await renderRecentPosts({
      component: "recent_posts",
      title: "Recent Writing",
      count: 3,
    });

    expect(container.querySelector("section")).toHaveClass(
      "bg-[var(--bg-secondary)]",
    );
    expect(screen.getAllByRole("img", { name: "Cover" })).toHaveLength(2);
    expect(screen.getAllByRole("img", { name: "Cover" })[0]).toHaveAttribute(
      "src",
      "https://a.storyblok.com/f/1/800x600/img.jpg",
    );
    expect(screen.getAllByRole("img", { name: "Cover" })[0]).toHaveAttribute(
      "fetchpriority",
      "high",
    );
    expect(screen.getByRole("link", { name: /First post/ })).toHaveAttribute(
      "href",
      "/blog/nextjs/first-post",
    );
    expect(screen.getByRole("link", { name: "View all →" })).toHaveAttribute(
      "href",
      "/blog",
    );
  });

  it("returns null when there are no categorized articles", async () => {
    mocks.getArticlesWithPath.mockReturnValue([]);

    const { container } = await renderRecentPosts({
      component: "recent_posts",
    });

    expect(container).toBeEmptyDOMElement();
  });
});
