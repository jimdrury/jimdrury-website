import "server-only";
import Link from "next/link";
import type { FC } from "react";
import { BlogCardCompact } from "@/components/blog-card-compact";
import { SectionTitle } from "@/components/section-title";
import {
  formatStoryDate,
  getBlogIndexArchive,
  getDefaultStoryCategory,
  getFeaturedImageAsset,
  getStoryDateTime,
  parseStoryblokImageDimensions,
} from "@/lib/blog";
import { getArticlesWithPath } from "@/lib/seo";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type RecentPostsBlokData = SbBlokData & {
  title?: string;
  count?: number | string;
};

type RecentPostsBlokProps = {
  blok: RecentPostsBlokData;
};

const parseCount = (value: unknown): number => {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3;
};

export const RecentPostsBlok: FC<RecentPostsBlokProps> = async ({ blok }) => {
  const title = blok.title?.trim() || "Recent Writing";
  const count = parseCount(blok.count);

  const { stories } = await getBlogIndexArchive({
    page: 1,
    version: "published",
  });

  const recentStories = getArticlesWithPath(stories).slice(0, count);

  if (recentStories.length === 0) {
    return null;
  }

  return (
    <section
      {...storyblokEditable(blok)}
      className="w-full bg-[var(--bg-secondary)] pt-8 pb-1.5 md:pt-12"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
        <div className="mb-6 flex items-end justify-between">
          <SectionTitle>{title}</SectionTitle>
          <Link
            href="/blog"
            className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.5px] text-[var(--fg-primary)] underline underline-offset-2 hover:text-[var(--fg-secondary)]"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
          {recentStories.map(({ story, path }, index) => {
            const featuredImage = getFeaturedImageAsset(
              story.content?.featured_image,
            );
            const imageSrc = featuredImage?.filename;
            const imageDimensions = parseStoryblokImageDimensions(imageSrc);

            return (
              <BlogCardCompact
                key={story.uuid}
                href={path}
                title={story.name}
                category={getDefaultStoryCategory(story) ?? undefined}
                excerpt={story.content?.excerpt}
                date={formatStoryDate(story)}
                dateTime={getStoryDateTime(story)}
                imageSrc={imageSrc}
                imageAlt={featuredImage?.alt || story.name}
                imageWidth={imageDimensions?.width}
                imageHeight={imageDimensions?.height}
                imageLoading={index < 3 ? "eager" : "lazy"}
                imageFetchPriority={index === 0 ? "high" : "auto"}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
