import Link from "next/link";
import type { FC } from "react";

import { BlogCard } from "@/components/blog-card";
import { Button } from "@/components/button";
import { Typography } from "@/components/typography";
import {
  type BlogArchivePagination,
  type BlogCategoryLink,
  type BlogStory,
  buildPaginationHref,
  formatStoryDate,
  getDefaultStoryCategory,
  getFeaturedImageAsset,
  getStoryDateTime,
  parseStoryblokImageDimensions,
} from "@/lib/blog";
import { getArticlePath } from "@/lib/seo";

type BlogIndexProps = {
  title: string;
  subtitle: string;
  stories: BlogStory[];
  pagination: BlogArchivePagination;
  categories?: BlogCategoryLink[];
  pathname: string;
  showCategorySidebar?: boolean;
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

export const BlogIndex: FC<BlogIndexProps> = ({
  title,
  subtitle,
  stories,
  pagination,
  categories = [],
  pathname,
  showCategorySidebar = true,
}) => {
  const shouldShowCategorySidebar =
    showCategorySidebar && categories.length > 0;
  const storyGridClassName = shouldShowCategorySidebar
    ? "grid gap-6 md:grid-cols-2"
    : "grid gap-6 md:grid-cols-2 lg:grid-cols-3";
  const visiblePages = getVisiblePages(
    pagination.page,
    pagination.totalPages,
    5,
  );

  return (
    <>
      <section className="w-full bg-black">
        <div className="aspect-[32/9] md:aspect-[40/7] lg:aspect-[48/7]" />
      </section>
      <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4">
        <div className="rounded-md border-4 border-black bg-yellow-300 p-6 shadow-[8px_8px_0_0] shadow-black">
          <Typography as="h1" size="3xl" weight="black">
            {title}
          </Typography>
          <Typography as="p" size="sm" weight="bold" className="mt-2">
            {subtitle}
          </Typography>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 md:pb-14 md:pt-10">
        <section
          className={
            shouldShowCategorySidebar
              ? "grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]"
              : "grid gap-8"
          }
        >
          <div>
            {stories.length === 0 ? (
              <Typography as="p" size="lg" weight="normal">
                No posts found.
              </Typography>
            ) : (
              <div className={storyGridClassName}>
                {stories.map((story, index) => {
                  const featuredImage = getFeaturedImageAsset(
                    story.content.featured_image,
                  );
                  const imageSrc = featuredImage?.filename;
                  const imageDimensions =
                    parseStoryblokImageDimensions(imageSrc);

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
                      category={getDefaultStoryCategory(story) ?? "design"}
                    />
                  );
                })}
              </div>
            )}

            <nav
              className="mt-8 flex flex-wrap items-center gap-3"
              aria-label="Pagination"
            >
              {pagination.hasPrevious ? (
                <Button asChild variant="secondary" size="small">
                  <Link
                    href={buildPaginationHref(pathname, pagination.page - 1)}
                  >
                    Previous
                  </Link>
                </Button>
              ) : null}

              {visiblePages.map((pageNumber) => {
                const isCurrent = pageNumber === pagination.page;
                const variant = isCurrent ? "primary" : "secondary";
                return (
                  <Button
                    asChild
                    key={`blog-page-${pageNumber}`}
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
                <Button asChild variant="secondary" size="small">
                  <Link
                    href={buildPaginationHref(pathname, pagination.page + 1)}
                  >
                    Next
                  </Link>
                </Button>
              ) : null}
            </nav>
          </div>

          {shouldShowCategorySidebar ? (
            <aside className="space-y-3">
              <div className="rounded-md border-2 border-black bg-zinc-100 p-4 shadow-[4px_4px_0_0]">
                <Typography as="h2" size="lg" weight="bold" className="mb-3">
                  Categories
                </Typography>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={category.href}
                        className="flex items-center justify-between gap-3 rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-semibold transition-colors hover:bg-yellow-200"
                      >
                        <span className="truncate underline decoration-2 underline-offset-2 [text-decoration-skip-ink:none]">
                          {category.label}
                        </span>
                        <span className="shrink-0 text-zinc-700">
                          ({category.count})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </section>
      </main>
    </>
  );
};
