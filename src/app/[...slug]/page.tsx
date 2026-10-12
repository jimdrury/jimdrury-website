import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { FC } from "react";
import { isUnreleasedArticleStory } from "@/lib/article-request-gate";
import {
  excludeHomeCatchAllParams,
  getPublishedPageParams,
} from "@/lib/published-pages";
import { buildStaticPageMetadata, MISSING_STORY_METADATA } from "@/lib/seo";
import { Render } from "./_components/render/render";
import { fetchStoryBySlug } from "./_helpers/story";

export const generateStaticParams = async () => {
  const params = excludeHomeCatchAllParams(await getPublishedPageParams());
  if (params.length === 0) {
    return [{ slug: ["about"] }];
  }

  return params;
};

export const generateMetadata = async ({
  params,
}: PageProps<"/[...slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const storySlug = slug.join("/");
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await fetchStoryBySlug({ slug: storySlug, version });

  if (!story || (!isEnabled && isUnreleasedArticleStory(story))) {
    return MISSING_STORY_METADATA;
  }

  return buildStaticPageMetadata({ story, slug: storySlug });
};

const Page: FC<PageProps<"/[...slug]">> = async ({ params }) => {
  const { slug } = await params;
  const storySlug = slug.join("/");
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    const story = await fetchStoryBySlug({
      slug: storySlug,
      version: "published",
    });

    if (isUnreleasedArticleStory(story)) {
      notFound();
    }
  }

  return <Render storySlug={storySlug} pathname={`/${storySlug}`} />;
};

export default Page;
