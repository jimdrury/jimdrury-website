import type { FC } from "react";

import { buildArticleBreadcrumbJsonLd, serializeJsonLd } from "@/lib/seo";
import type { StoryData } from "@/storyblok/lib";

import { isArticleStory } from "./is-article-story";

interface ArticleBreadcrumbJsonLdProps {
  story: StoryData;
}

export const ArticleBreadcrumbJsonLd: FC<ArticleBreadcrumbJsonLdProps> = ({
  story,
}) => {
  if (!isArticleStory(story)) {
    return null;
  }

  const jsonLd = serializeJsonLd(buildArticleBreadcrumbJsonLd(story));

  return <script type="application/ld+json">{jsonLd}</script>;
};
