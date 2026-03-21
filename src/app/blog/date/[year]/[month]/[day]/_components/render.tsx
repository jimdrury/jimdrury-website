import "server-only";

import { draftMode } from "next/headers";
import type { FC } from "react";
import { BlogArchive } from "@/app/blog/_components/BlogArchive";
import {
  getDateArchive,
  getDefaultStoryCategory,
  parsePageParam,
} from "@/lib/blog";

type RenderProps = Pick<
  PageProps<"/blog/date/[year]/[month]/[day]">,
  "params" | "searchParams"
>;

export const Render: FC<RenderProps> = async ({ params, searchParams }) => {
  const { year, month, day } = await params;
  const resolvedSearchParams = await searchParams;
  const pageValue = resolvedSearchParams.page;
  const pageParam = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const page = parsePageParam(pageParam);
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const archive = await getDateArchive({
    year,
    month,
    day,
    page,
    version,
  });

  return (
    <BlogArchive
      title={`Posts from ${year}-${month}-${day}`}
      pathname={`/blog/date/${year}/${month}/${day}`}
      stories={archive.stories}
      pagination={archive.pagination}
      resolveHref={(story) => {
        const category = getDefaultStoryCategory(story);
        return category ? `/blog/${category}/${story.slug}` : undefined;
      }}
      emptyMessage={`No posts found on ${year}-${month}-${day}.`}
    />
  );
};
