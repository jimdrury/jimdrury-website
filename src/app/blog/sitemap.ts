import type { MetadataRoute } from "next";
import { getDefaultStoryCategory } from "@/lib/blog";
import { getArticleCanonicalUrl } from "@/lib/seo";
import { getAllArticles } from "@/storyblok/blog-listings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = await getAllArticles("published");
  const entries: MetadataRoute.Sitemap = [];

  for (const story of stories) {
    if (!getDefaultStoryCategory(story)) {
      continue;
    }
    entries.push({
      url: getArticleCanonicalUrl(story),
      lastModified: story.published_at ?? story.first_published_at ?? undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
