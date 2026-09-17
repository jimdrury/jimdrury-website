import type { Metadata } from "next";
import { draftMode } from "next/headers";
import type { FC } from "react";
import { BackToTop } from "@/components/back-to-top";
import { getDefaultStoryCategory, getPublishedArticleParams } from "@/lib/blog";
import { buildArticleMetadata } from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";
import { Render } from "./_components/render";

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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildArticleMetadata(story);
};

const Page: FC<PageProps<"/blog/[category]/[slug]">> = ({ params }) => {
  return (
    <>
      <Render params={params} />
      <BackToTop />
    </>
  );
};

export default Page;
