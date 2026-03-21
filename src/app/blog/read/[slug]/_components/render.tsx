import "server-only";

import { StoryblokStory } from "@storyblok/react/rsc";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { FC } from "react";

import { getDefaultStoryCategory } from "@/lib/blog";
import { setCurrentStory } from "@/lib/current-story-context";
import { buildArticleJsonLd, serializeJsonLd } from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";

type RenderProps = Pick<PageProps<"/blog/read/[slug]">, "params">;

export const Render: FC<RenderProps> = async ({ params }) => {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const story = await getArticleBySlug({ slug, version });

  if (!story) {
    notFound();
  }

  if (!isEnabled && !getDefaultStoryCategory(story)) {
    notFound();
  }

  setCurrentStory(story);
  const jsonLd = serializeJsonLd(buildArticleJsonLd(story));

  return (
    <main>
      <script type="application/ld+json">{jsonLd}</script>
      <StoryblokStory story={story} />
    </main>
  );
};
