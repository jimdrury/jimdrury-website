import "server-only";

import { draftMode } from "next/headers";
import type { FC } from "react";
import { getBlogCategoryArchive, parsePageParam } from "@/lib/blog";
import { buildBlogCategoryJsonLd, serializeJsonLd } from "@/lib/seo";
import { BlogIndex } from "../../_components/blog-index";

type RenderProps = Pick<
  PageProps<"/blog/[category]">,
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
