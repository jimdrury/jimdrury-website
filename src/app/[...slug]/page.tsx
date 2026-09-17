import type { Metadata } from "next";
import { draftMode } from "next/headers";
import type { FC } from "react";
import { getPublishedPageParams } from "@/lib/published-pages";
import { buildStaticPageMetadata, MISSING_STORY_METADATA } from "@/lib/seo";
import { Render } from "./_components/render/render";
import { fetchStoryBySlug } from "./_helpers/story";

export const generateStaticParams = async () => {
  return getPublishedPageParams();
};

export const generateMetadata = async ({
  params,
}: PageProps<"/[...slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const storySlug = slug.join("/");
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await fetchStoryBySlug({ slug: storySlug, version });

  if (!story) {
    return MISSING_STORY_METADATA;
  }

  return buildStaticPageMetadata({ story, slug: storySlug });
};

const Page: FC<PageProps<"/[...slug]">> = async ({ params }) => {
  const { slug } = await params;
  const storySlug = slug.join("/");

  return <Render storySlug={storySlug} pathname={`/${storySlug}`} />;
};

export default Page;
