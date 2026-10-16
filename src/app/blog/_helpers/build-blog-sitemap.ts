import type { MetadataRoute } from "next";
import { getArticleCanonicalUrl } from "@/lib/seo";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

export const buildBlogSitemap = (
  stories: readonly BlogStory[],
): MetadataRoute.Sitemap => {
  const entries: MetadataRoute.Sitemap = [];

  for (const story of stories) {
    const url = getArticleCanonicalUrl(story);
    if (!url) {
      continue;
    }

    entries.push({
      url,
      lastModified: story.published_at ?? story.first_published_at ?? undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
};
