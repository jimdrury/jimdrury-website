import {
  BLOG_SCOPES,
  getBlogArticleSlugTag,
  getBlogVersionTag,
  getHomePageTag,
  getStoryPageTag,
  getStorySlugVersionTag,
  getStoryVersionTag,
} from "@/lib/cache-tags";
import { BLOG_PREFIX } from "@/storyblok/blog-listings-utils";

const PUBLISHED = "published" as const;

const getPublishedBlogVersionTags = (): string[] => {
  return Object.values(BLOG_SCOPES).map((scope) => {
    return getBlogVersionTag({ scope, version: PUBLISHED });
  });
};

export const getWebhookRevalidationTags = (fullSlug?: string): string[] => {
  if (!fullSlug) {
    return [
      getHomePageTag(),
      getStoryPageTag(),
      getStoryVersionTag(PUBLISHED),
      ...getPublishedBlogVersionTags(),
    ];
  }

  const normalizedSlug = fullSlug.replace(/\/$/, "");

  if (normalizedSlug.startsWith(BLOG_PREFIX)) {
    const articleSlug = normalizedSlug.slice(BLOG_PREFIX.length);
    const tags = getPublishedBlogVersionTags();

    if (articleSlug) {
      tags.push(
        getBlogArticleSlugTag({ slug: articleSlug, version: PUBLISHED }),
      );
    }

    return tags;
  }

  const tags = [
    getStoryPageTag(),
    getStoryVersionTag(PUBLISHED),
    getStorySlugVersionTag({ slug: normalizedSlug, version: PUBLISHED }),
  ];

  if (normalizedSlug === "home") {
    tags.push(getHomePageTag());
  }

  return tags;
};
