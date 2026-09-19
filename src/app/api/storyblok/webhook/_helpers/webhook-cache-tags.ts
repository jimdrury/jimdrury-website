import {
  getBlogArticleSlugTag,
  getBlogListingVersionTags,
  getHomePageTag,
  getStorySlugVersionTag,
} from "@/lib/cache-tags";
import { BLOG_PREFIX } from "@/storyblok/blog-listings-utils";

const PUBLISHED = "published" as const;
const BLOG_LISTING_STORY_SLUG = BLOG_PREFIX.replace(/\/$/, "");

const getSharedWebhookTags = (): string[] => {
  return [
    getHomePageTag(),
    getStorySlugVersionTag({
      slug: BLOG_LISTING_STORY_SLUG,
      version: PUBLISHED,
    }),
    ...getBlogListingVersionTags(PUBLISHED),
  ];
};

export const getWebhookRevalidationTags = (fullSlug?: string): string[] => {
  const tags = new Set<string>(getSharedWebhookTags());

  if (!fullSlug) {
    return [...tags];
  }

  const normalizedSlug = fullSlug.replace(/\/$/, "");
  tags.add(
    getStorySlugVersionTag({ slug: normalizedSlug, version: PUBLISHED }),
  );

  if (normalizedSlug.startsWith(BLOG_PREFIX)) {
    const articleSlug = normalizedSlug.slice(BLOG_PREFIX.length);
    if (articleSlug) {
      tags.add(
        getBlogArticleSlugTag({ slug: articleSlug, version: PUBLISHED }),
      );
    }
  }

  return [...tags];
};
