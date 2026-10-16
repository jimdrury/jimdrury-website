import "server-only";

import type { FC } from "react";
import { readCurrentUtcDay } from "@/lib/article-release";
import { isUnreleasedArticleStory } from "@/lib/article-request-gate";
import { getDefaultStoryCategory } from "@/lib/blog";
import {
  buildArticleBreadcrumbJsonLd,
  buildArticleJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import { getArticleBySlug } from "@/storyblok/blog-listings";

type ArticleJsonLdProps = {
  category: string;
  slug: string;
  version: "draft" | "published";
};

export const ArticleJsonLd: FC<ArticleJsonLdProps> = async ({
  category,
  slug,
  version,
}) => {
  const story = await getArticleBySlug({ slug, version });

  if (!story) {
    return null;
  }

  if (
    version === "published" &&
    isUnreleasedArticleStory(story, await readCurrentUtcDay())
  ) {
    return null;
  }

  const canonicalCategory = getDefaultStoryCategory(story);

  if (version === "published" && !canonicalCategory) {
    return null;
  }

  if (
    version === "published" &&
    canonicalCategory &&
    category !== canonicalCategory
  ) {
    return null;
  }

  const articleJsonLd = serializeJsonLd(buildArticleJsonLd(story));
  const breadcrumbJsonLd = serializeJsonLd(buildArticleBreadcrumbJsonLd(story));

  return (
    <>
      <script type="application/ld+json">{articleJsonLd}</script>
      <script type="application/ld+json">{breadcrumbJsonLd}</script>
    </>
  );
};
