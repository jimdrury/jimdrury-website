import {
  type BlogStory,
  isArticleReleased,
  isArticleStory,
} from "@/storyblok/blog-listings-utils";

const ARTICLE_PATH_PATTERN = /^\/blog\/([^/]+)\/([^/]+)\/?$/;
const RESERVED_CATEGORIES = new Set(["page", "_"]);

export const getArticleSlugFromPath = (pathname: string): string | null => {
  const match = ARTICLE_PATH_PATTERN.exec(pathname);
  const category = match?.[1];
  const slug = match?.[2];

  if (!category || !slug || RESERVED_CATEGORIES.has(category)) {
    return null;
  }

  return decodeURIComponent(slug);
};

export const isPublicArticleStory = (
  story: BlogStory | null,
  now: Date = new Date(),
): boolean => {
  if (!story || !isArticleStory(story)) {
    return false;
  }

  return isArticleReleased(story, now);
};
