import type { MetadataRoute } from "next";
import { getArticleCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import { getAllArticles } from "@/storyblok/blog-listings";

const ROOT_URLS = [`${SITE_ORIGIN}/`, `${SITE_ORIGIN}/blog`] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = await getAllArticles("published");
  const urls = new Set<string>(ROOT_URLS);

  for (const story of stories) {
    urls.add(getArticleCanonicalUrl(story));
  }

  return [...urls].map((url) => ({
    url,
    changeFrequency: "weekly",
    priority: url === `${SITE_ORIGIN}/` ? 1 : 0.7,
  }));
}
