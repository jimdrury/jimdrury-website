import "server-only";
import Link from "next/link";
import type { FC } from "react";
import { BlogCardCompact } from "@/components/blog-card-compact";
import { Typography } from "@/components/typography";
import {
  formatStoryDate,
  getBlogIndexArchive,
  getDefaultStoryCategory,
  getStoryDateTime,
} from "@/lib/blog";
import { getArticlesWithPath } from "@/lib/seo";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type RecentPostsBlokData = SbBlokData & {
  title?: string;
  count?: number;
};

type RecentPostsBlokProps = {
  blok: RecentPostsBlokData;
};

export const RecentPostsBlok: FC<RecentPostsBlokProps> = async ({ blok }) => {
  const title = blok.title || "Recent Writing";
  const count = blok.count || 3;

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
      className="w-full bg-[var(--bg-primary)] py-8 md:py-12"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
        <div className="mb-6 flex items-end justify-between">
          <Typography size="4xl" asChild>
            <h2 className="text-[var(--fg-primary)]">{title}</h2>
          </Typography>
          <Link
            href="/blog"
            className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.5px] text-[var(--fg-primary)] underline underline-offset-2 hover:text-[var(--fg-secondary)]"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
          {recentStories.map(({ story, path }) => {
            const dateTime = getStoryDateTime(story);
            const formattedDate = formatStoryDate(story);

            return (
              <BlogCardCompact
                key={story.uuid}
                href={path}
                title={story.name}
                category={getDefaultStoryCategory(story) ?? undefined}
                excerpt={story.content?.excerpt}
                date={formattedDate}
                dateTime={dateTime}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
