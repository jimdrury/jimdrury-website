import type { FC } from "react";

import { buildArticleJsonLd, serializeJsonLd } from "@/lib/seo";
import type { StoryData } from "@/storyblok/lib";

import { isArticleStory } from "./is-article-story";

interface ArticleJsonLdProps {
  story: StoryData;
}

export const ArticleJsonLd: FC<ArticleJsonLdProps> = ({ story }) => {
  if (!isArticleStory(story)) {
    return null;
  }

  const jsonLd = serializeJsonLd(buildArticleJsonLd(story));

  return <script type="application/ld+json">{jsonLd}</script>;
};
