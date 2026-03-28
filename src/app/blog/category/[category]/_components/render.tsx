import "server-only";

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { FC } from "react";
import { getBlogCategoryArchive, parsePageParam } from "@/lib/blog";
import {
  buildBlogCategoryJsonLd,
  getArticlePath,
  serializeJsonLd,
} from "@/lib/seo";
import { getAllArticles } from "@/storyblok/blog-listings";
import { BlogIndex } from "../../../_components/blog-index";

type RenderProps = Pick<
  PageProps<"/blog/category/[category]">,
  "params" | "searchParams"
>;

export const Render: FC<RenderProps> = async ({ params, searchParams }) => {
  const { category } = await params;
  const normalizedCategory = category.trim();
  const resolvedSearchParams = await searchParams;
  const pageValue = resolvedSearchParams.page;
  const pageParam = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const page = parsePageParam(pageParam);
  const { isEnabled } = await draftMode();

  const version = isEnabled ? "draft" : "published";
  const archive = await getBlogCategoryArchive({
    category: normalizedCategory,
    page,
    version,
  });

  if (page === 1 && archive.stories.length === 0) {
    const allArticles = await getAllArticles(version);
    const article = allArticles.find(
      (story) => story.slug === normalizedCategory,
    );

    if (article) {
      const categoryPath = `/blog/${normalizedCategory}`;
      const articlePath = getArticlePath(article);
      redirect(
        articlePath === categoryPath
          ? `/blog/read/${article.slug}`
          : articlePath,
      );
    }
  }

  const jsonLd = serializeJsonLd(
    buildBlogCategoryJsonLd({
      category: normalizedCategory,
      page,
      stories: archive.stories,
    }),
  );

  return (
    <>
      <script type="application/ld+json">{jsonLd}</script>
      <BlogIndex
        title={`Category: ${normalizedCategory}`}
        subtitle={`Showing posts tagged "${normalizedCategory}".`}
        pathname={`/blog/${normalizedCategory}`}
        stories={archive.stories}
        pagination={archive.pagination}
        showCategorySidebar={false}
      />
    </>
  );
};
