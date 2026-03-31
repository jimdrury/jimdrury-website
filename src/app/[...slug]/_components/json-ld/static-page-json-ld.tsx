import type { FC } from "react";

import { buildStaticPageJsonLd, serializeJsonLd } from "@/lib/seo";
import type { StoryData } from "@/storyblok/lib";

import { isArticleStory } from "./is-article-story";

interface StaticPageJsonLdProps {
  story: StoryData;
  storySlug: string;
}

export const StaticPageJsonLd: FC<StaticPageJsonLdProps> = ({
  story,
  storySlug,
}) => {
  if (isArticleStory(story)) {
    return null;
  }

  const jsonLd = serializeJsonLd(
    buildStaticPageJsonLd({ story, slug: storySlug }),
  );

  return <script type="application/ld+json">{jsonLd}</script>;
};
