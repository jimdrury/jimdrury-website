import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { FC } from "react";
import { getDefaultStoryCategory, getPublishedArticleParams } from "@/lib/blog";
import { buildArticleMetadata, MISSING_STORY_METADATA } from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";
import { BackToTop } from "./_components/back-to-top/back-to-top";
import { Render } from "./_components/render/render";

export const generateStaticParams = async () => {
  return getPublishedArticleParams();
};

export const generateMetadata = async ({
  params,
}: PageProps<"/blog/[category]/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await getArticleBySlug({ slug, version });

  if (!story || (!isEnabled && !getDefaultStoryCategory(story))) {
    return {
      title: "Article not found",
      ...MISSING_STORY_METADATA,
    };
  }

  return buildArticleMetadata(story);
};

const Page: FC<PageProps<"/blog/[category]/[slug]">> = async ({ params }) => {
  const { category, slug } = await params;
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await getArticleBySlug({ slug, version });

  if (!story) {
    notFound();
  }

  const canonicalCategory = getDefaultStoryCategory(story);

  if (!isEnabled && !canonicalCategory) {
    notFound();
  }

  if (!isEnabled && canonicalCategory && category !== canonicalCategory) {
    redirect(`/blog/${canonicalCategory}/${slug}`);
  }

  return (
    <>
      <Render params={params} />
      <BackToTop />
    </>
  );
};

export default Page;
