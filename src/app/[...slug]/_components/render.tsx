import "server-only";

import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { FC } from "react";

import { buildStaticPageJsonLd, serializeJsonLd } from "@/lib/seo";
import type { StoryData } from "@/storyblok/lib";
import { StoryContent } from "@/storyblok/renderer";
import { fetchStoryBySlug } from "./story";

const StoryPreview = dynamic(() =>
  import("@/storyblok/preview").then((mod) => mod.StoryPreview),
);

type RenderProps = Pick<PageProps<"/[...slug]">, "params" | "searchParams">;

const isNonArticleStory = (story: StoryData): boolean => {
  return !(
    typeof story.content === "object" &&
    story.content !== null &&
    "component" in story.content &&
    story.content.component === "article"
  );
};

export const Render: FC<RenderProps> = async ({ params, searchParams }) => {
  const { slug } = await params;
  const storySlug = slug.join("/");
  const { isEnabled } = await draftMode();
  const resolvedSearchParams = await searchParams;
  const storyblokParam = resolvedSearchParams._storyblok;
  const isStoryblokPreviewRequest = Array.isArray(storyblokParam)
    ? storyblokParam.length > 0
    : Boolean(storyblokParam);
  const shouldUseDraftVersion = isEnabled || isStoryblokPreviewRequest;
  const version = shouldUseDraftVersion ? "draft" : "published";
  const story = await fetchStoryBySlug({ slug: storySlug, version });

  if (!story) {
    notFound();
  }

  const jsonLd = isNonArticleStory(story)
    ? serializeJsonLd(buildStaticPageJsonLd({ story, slug: storySlug }))
    : null;

  const storyContent = (
    <>
      {jsonLd ? <script type="application/ld+json">{jsonLd}</script> : null}
      <StoryContent story={story} />
    </>
  );

  if (!isEnabled) {
    return storyContent;
  }

  return (
    <StoryPreview storyId={story.id ?? 0} story={story}>
      {storyContent}
    </StoryPreview>
  );
};
