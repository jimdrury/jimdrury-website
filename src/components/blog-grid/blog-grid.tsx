import Link from "next/link";
import type { FC } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/button";
import { Typography } from "@/components/typography";
import {
  type BlogArchivePagination,
  type BlogStory,
  buildPaginationHref,
  formatStoryDate,
  getDefaultStoryCategory,
  getFeaturedImageAsset,
  getStoryDateTime,
  parseStoryblokImageDimensions,
} from "@/lib/blog";
import { getArticlePath } from "@/lib/seo";

type BlogGridProps = {
  stories: BlogStory[];
  pagination: BlogArchivePagination;
  pathname: string;
};

const getVisiblePages = (
  page: number,
  totalPages: number,
  windowSize: number,
): number[] => {
  if (totalPages <= windowSize) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const half = Math.floor(windowSize / 2);
  const start = Math.max(1, Math.min(page - half, totalPages - windowSize + 1));
  return Array.from({ length: windowSize }, (_, index) => start + index);
};

export const BlogGrid: FC<BlogGridProps> = ({
  stories,
  pagination,
  pathname,
}) => {
  const visiblePages = getVisiblePages(
    pagination.page,
    pagination.totalPages,
    5,
  );

  return (
    <>
      <main className="mx-auto container px-4">
        <section>
          {stories.length === 0 ? (
            <Typography asChild size="lg">
              <p>No posts found.</p>
            </Typography>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story, index) => {
                const featuredImage = getFeaturedImageAsset(
                  story.content.featured_image,
                );
                const imageSrc = featuredImage?.filename;
                const imageDimensions = parseStoryblokImageDimensions(imageSrc);

                return (
                  <BlogCard
                    key={story.id}
                    href={getArticlePath(story)}
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
                    category={getDefaultStoryCategory(story) ?? undefined}
                  />
                );
              })}
            </div>
          )}
        </section>
      </main>

      {pagination.totalPages > 1 ? (
        <nav
          className="flex w-full flex-wrap items-center justify-center gap-4 border-t-[3px] border-[#1a1a1a] px-6 py-12 md:px-20"
          aria-label="Pagination"
        >
          {pagination.hasPrevious ? (
            <Button asChild variant="secondary" size="small">
              <Link href={buildPaginationHref(pathname, pagination.page - 1)}>
                <FaArrowLeft aria-hidden className="size-3" />
                Prev
              </Link>
            </Button>
          ) : null}

          {visiblePages.map((pageNumber) => {
            const isCurrent = pageNumber === pagination.page;
            const variant = isCurrent ? "dark" : "secondary";
            return (
              <Button
                asChild
                key={`blog-grid-page-${pageNumber}`}
                variant={variant}
                size="small"
              >
                <Link
                  href={buildPaginationHref(pathname, pageNumber)}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {pageNumber}
                </Link>
              </Button>
            );
          })}

          {pagination.hasNext ? (
            <Button asChild variant="primary" size="small">
              <Link href={buildPaginationHref(pathname, pagination.page + 1)}>
                Next
                <FaArrowRight aria-hidden className="size-3" />
              </Link>
            </Button>
          ) : null}
        </nav>
      ) : null}
    </>
  );
};
