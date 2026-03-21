import "server-only";

import { draftMode } from "next/headers";
import type { FC } from "react";

import {
  type BlogCategoryLink,
  getBlogIndexArchive,
  parsePageParam,
} from "@/lib/blog";
import { buildBlogIndexJsonLd, serializeJsonLd } from "@/lib/seo";

import { BlogIndex } from "./blog-index";

type RenderProps = Pick<PageProps<"/blog">, "searchParams">;

export const Render: FC<RenderProps> = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const pageValue = resolvedSearchParams.page;
  const pageParam = Array.isArray(pageValue) ? pageValue[0] : pageValue;
  const page = parsePageParam(pageParam);
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";

  const archive = await getBlogIndexArchive({
    page,
    version,
  });

  const categoryLinks: BlogCategoryLink[] = archive.categories.map(
    (category) => {
      return {
        ...category,
        href: `/blog/${category.slug}`,
      };
    },
  );
  const jsonLd = serializeJsonLd(
    buildBlogIndexJsonLd({
      page,
      stories: archive.stories,
    }),
  );

  return (
    <>
      <script type="application/ld+json">{jsonLd}</script>
      <BlogIndex
        title="Blogs"
        subtitle="Latest writing, ideas, and technical deep dives."
        stories={archive.stories}
        pagination={archive.pagination}
        categories={categoryLinks}
        pathname="/blog"
      />
    </>
  );
};
