import "server-only";

import { StoryblokStory } from "@storyblok/react/rsc";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { FC } from "react";

import { getDefaultStoryCategory } from "@/lib/blog";
import { buildArticleJsonLd, serializeJsonLd } from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";

type RenderProps = Pick<PageProps<"/blog/read/[slug]">, "params">;
type StoryData = Awaited<ReturnType<typeof getArticleBySlug>>;
type CachedStory = NonNullable<StoryData>;

const mapStoryForRender = (story: CachedStory): CachedStory => {
  return {
    ...story,
    content: {
      categories: story.tag_list,
      published_at: story.first_published_at ?? story.published_at,
      ...story.content,
      story_name: story.name,
      updated_at: story.published_at,
    },
  };
};

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

  const storyForRender = mapStoryForRender(story);
  const jsonLd = serializeJsonLd(buildArticleJsonLd(story));

  return (
    <main>
      <script type="application/ld+json">{jsonLd}</script>
      <StoryblokStory story={storyForRender} />
    </main>
  );
};
