import "server-only";

import Link from "next/link";
import type { FC } from "react";

import { BlogCard } from "@/components/blog-card";
import { Typography } from "@/components/typography";
import {
  type BlogArchivePagination,
  type BlogStory,
  buildPaginationHref,
  formatStoryDate,
  getFeaturedImageAsset,
  getStoryDateTime,
  parseStoryblokImageDimensions,
} from "@/lib/blog";

type BlogArchiveProps = {
  title: string;
  categoryLabel: string;
  pathname: string;
  stories: BlogStory[];
  pagination: BlogArchivePagination;
  resolveHref: (story: BlogStory) => string | undefined;
  emptyMessage: string;
};

export const BlogArchive: FC<BlogArchiveProps> = ({
  title,
  categoryLabel,
  pathname,
  stories,
  pagination,
  resolveHref,
  emptyMessage,
}) => {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 md:py-16">
      <Typography as="h1" size="3xl" weight="black">
        {title}
      </Typography>
      {stories.length === 0 ? (
        <Typography as="p" className="mt-6" size="lg" weight="normal">
          {emptyMessage}
        </Typography>
      ) : (
        <section className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6">
          {stories.map((story, index) => {
            const featuredImage = getFeaturedImageAsset(
              story.content.featured_image,
            );
            const imageSrc = featuredImage?.filename;
            const imageDimensions = parseStoryblokImageDimensions(imageSrc);

            return (
              <BlogCard
                key={story.id}
                href={resolveHref(story)}
                title={story.name}
                excerpt={story.content.excerpt}
                date={formatStoryDate(story)}
                dateTime={getStoryDateTime(story)}
                imageSrc={imageSrc}
                imageAlt={featuredImage?.alt || story.name}
                imageWidth={imageDimensions?.width}
                imageHeight={imageDimensions?.height}
                imageLoading={index < 3 ? "eager" : "lazy"}
                imageFetchPriority={index === 0 ? "high" : "auto"}
                category={categoryLabel}
              />
            );
          })}
        </section>
      )}
      <nav
        className="mt-10 flex items-center justify-between"
        aria-label="Pagination"
      >
        {pagination.hasPrevious ? (
          <Link
            href={buildPaginationHref(pathname, pagination.page - 1)}
            className="border-2 border-black bg-white px-4 py-2 font-semibold shadow-[4px_4px_0_0] hover:bg-yellow-100 focus-visible:focus-ring"
          >
            Previous
          </Link>
        ) : (
          <span />
        )}
        <Typography as="p" size="sm" weight="medium">
          Page {pagination.page} of {pagination.totalPages}
        </Typography>
        {pagination.hasNext ? (
          <Link
            href={buildPaginationHref(pathname, pagination.page + 1)}
            className="border-2 border-black bg-white px-4 py-2 font-semibold shadow-[4px_4px_0_0] hover:bg-yellow-100 focus-visible:focus-ring"
          >
            Next
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
};
