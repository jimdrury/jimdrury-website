import "server-only";

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import type { FC } from "react";
import {
  getBlogCategoryArchive,
  getDefaultStoryCategory,
  parsePageParam,
} from "@/lib/blog";
import { buildBlogCategoryJsonLd, serializeJsonLd } from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";
import { BlogIndex } from "../../_components/blog-index";

type RenderProps = Pick<
  PageProps<"/blog/[category]">,
  "params" | "searchParams"
>;

export const Render: FC<RenderProps> = async ({ params, searchParams }) => {
  await connection();
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const pageValue = resolvedSearchParams.page;
  const pageParam = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const page = parsePageParam(pageParam);
  const { isEnabled } = await draftMode();

  const version = isEnabled ? "draft" : "published";

  const article = await getArticleBySlug({ slug: category, version });
  if (article) {
    const canonicalCategory = getDefaultStoryCategory(article) ?? "general";
    redirect(`/blog/${canonicalCategory}/${category}`);
  }

  const archive = await getBlogCategoryArchive({
    category,
    page,
    version,
  });
  const jsonLd = serializeJsonLd(
    buildBlogCategoryJsonLd({
      category,
      page,
      stories: archive.stories,
    }),
  );

  return (
    <>
      <script type="application/ld+json">{jsonLd}</script>
      <BlogIndex
        title={`Category: ${category}`}
        subtitle={`Showing posts tagged "${category}".`}
        pathname={`/blog/${category}`}
        stories={archive.stories}
        pagination={archive.pagination}
        showCategorySidebar={false}
      />
    </>
  );
};
