import {
  getBlogArticleSlugTag,
  getBlogListingVersionTags,
  getHomePageTag,
  getPublishedPagesTag,
  getStoryIdTag,
  getStorySlugVersionTag,
} from "@/lib/cache-tags";
import { BLOG_PREFIX } from "@/storyblok/blog-listings-utils";

const PUBLISHED = "published" as const;
const BLOG_LISTING_STORY_SLUG = BLOG_PREFIX.replace(/\/$/, "");

const getSharedWebhookTags = (): string[] => {
  return [
    getHomePageTag(),
    getPublishedPagesTag(),
    getStorySlugVersionTag({
      slug: BLOG_LISTING_STORY_SLUG,
      version: PUBLISHED,
    }),
    ...getBlogListingVersionTags(PUBLISHED),
  ];
};

export const getWebhookRevalidationTags = ({
  fullSlug,
  storyId,
}: {
  fullSlug?: string;
  storyId?: number;
} = {}): string[] => {
  const tags = new Set<string>(getSharedWebhookTags());

  // Clears entries cached under the story's previous slug after a move,
  // rename, or unpublish, which the new `full_slug` alone cannot reach.
  if (storyId !== undefined) {
    tags.add(getStoryIdTag({ id: storyId, version: PUBLISHED }));
  }

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
