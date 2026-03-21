import "server-only";

import { draftMode } from "next/headers";
import type { FC } from "react";
import { getArticlesByTag } from "@/storyblok/blog-listings";
import {
  BLOG_ARCHIVE_PAGE_SIZE,
  parsePageParam,
} from "@/storyblok/blog-listings-utils";
import { BlogArchive } from "./blog-archive";

type RenderProps = Pick<
  PageProps<"/blog/category/[category]">,
  "params" | "searchParams"
>;

export const Render: FC<RenderProps> = async ({ params, searchParams }) => {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const pageValue = resolvedSearchParams.page;
  const pageParam = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const page = parsePageParam(pageParam);
  const { isEnabled } = await draftMode();

  const version = isEnabled ? "draft" : "published";

  const pageIndex = page - 1;

  const [stories, nextPageStories] = await Promise.all([
    getArticlesByTag(category, pageIndex, version),
    getArticlesByTag(category, pageIndex + 1, version),
  ]);

  const hasNext = nextPageStories.length > 0;
  const total = hasNext
    ? page * BLOG_ARCHIVE_PAGE_SIZE + 1
    : (page - 1) * BLOG_ARCHIVE_PAGE_SIZE + stories.length;

  return (
    <BlogArchive
      title={`Category: ${category}`}
      pathname={`/blog/${category}`}
      stories={stories}
      pagination={{
        page,
        pageSize: BLOG_ARCHIVE_PAGE_SIZE,
        total,
        totalPages: hasNext ? page + 1 : page,
        hasPrevious: page > 1,
        hasNext,
      }}
      resolveHref={(story) => `/blog/${category}/${story.slug}`}
      emptyMessage={`No posts found in "${category}".`}
    />
  );
};
