import type { FC } from "react";

import { getPublishedArticleParams } from "@/lib/blog";

import { ArticleJsonLd } from "./_components/article-json-ld/article-json-ld";

// Keep this slot blocking so BlogPosting JSON-LD is prerendered into <head>.
// A Suspense boundary streams the scripts into the body instead.
export const instant = false;

export const generateStaticParams = async () => {
  return getPublishedArticleParams();
};

const Page: FC<PageProps<"/blog/[category]/[slug]">> = async ({ params }) => {
  const { category, slug } = await params;

  return <ArticleJsonLd category={category} slug={slug} version="published" />;
};

export default Page;
