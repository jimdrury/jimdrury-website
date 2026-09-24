import {
  parseStoryblokImageDimensions,
  type StoryblokImageDimensions,
} from "./image-dimensions";
import type { StoryblokAsset } from "./types";

export const BLOG_PREFIX = "blog/";
export const BLOG_CONTENT_TYPE = "article";
export const BLOG_ARCHIVE_PAGE_SIZE = 9;

type ImageBlok = {
  component?: string;
  image?: StoryblokAsset;
};

type ArticleContent = {
  body?: StoryblokBlok[];
  pre_content?: StoryblokBlok[];
  post_content?: StoryblokBlok[];
  component?: string;
  excerpt?: string;
  meta_description?: string;
  featured_image?: ImageBlok[];
  categories?: string[];
  published_at?: string | null;
  story_name?: string;
  updated_at?: string | null;
};

type StoryblokBlok = {
  _uid?: string;
  component?: string;
  [key: string]: unknown;
};

export type BlogStory = {
  id: number;
  uuid?: string;
  name: string;
  slug: string;
  full_slug: string;
  tag_list?: string[];
  first_published_at?: string | null;
  published_at?: string | null;
  content: ArticleContent;
};

export type StoryblokStoriesResponse = {
  data?: {
    stories?: BlogStory[];
  };
};

export const isArticleStory = (story: BlogStory): boolean => {
  return story.content?.component === BLOG_CONTENT_TYPE;
};

const ARTICLE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const getArticlePublishedAtValue = (story: BlogStory): string | null => {
  const value = story.first_published_at ?? story.published_at ?? null;
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const getArticleReleaseDate = (story: BlogStory): string | null => {
  const value = getArticlePublishedAtValue(story);
  if (!value || value.length < 10) {
    return null;
  }

  const datePart = value.slice(0, 10);
  return ARTICLE_DATE_PATTERN.test(datePart) ? datePart : null;
};

export const isArticleReleased = (
  story: BlogStory,
  now: Date = new Date(),
): boolean => {
  const releaseDate = getArticleReleaseDate(story);
  if (!releaseDate) {
    return true;
  }

  return now.toISOString().slice(0, 10) >= releaseDate;
};

export const getVisibleArticles = (
  stories: readonly BlogStory[],
  version: "draft" | "published",
  now: Date = new Date(),
): BlogStory[] => {
  if (version === "draft") {
    return [...stories];
  }

  return stories.filter((story) => isArticleReleased(story, now));
};

export const getNextUnreleasedReleaseAt = (
  stories: readonly BlogStory[],
  now: Date = new Date(),
): Date | null => {
  const currentDate = now.toISOString().slice(0, 10);
  let nextDate: string | null = null;

  for (const story of stories) {
    const releaseDate = getArticleReleaseDate(story);
    if (!releaseDate || releaseDate <= currentDate) {
      continue;
    }

    if (!nextDate || releaseDate < nextDate) {
      nextDate = releaseDate;
    }
  }

  return nextDate ? new Date(`${nextDate}T00:00:00.000Z`) : null;
};

export const parsePageParam = (page: string | undefined): number => {
  const parsed = Number.parseInt(page ?? "1", 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
};

const PAGINATION_PATH_PATTERN = /\/page\/\d+$/;

export const getPageFromPathname = (pathname: string): number => {
  const match = pathname.match(/\/page\/(\d+)$/);
  return parsePageParam(match?.[1]);
};

export const buildPaginationHref = (pathname: string, page: number): string => {
  const basePath = pathname.replace(PAGINATION_PATH_PATTERN, "") || "/";
  if (page <= 1) {
    return basePath;
  }

  return `${basePath}/page/${page}`;
};

export type { StoryblokImageDimensions };
export { parseStoryblokImageDimensions };

export const getFeaturedImageAsset = (
  featuredImageBloks: ImageBlok[] | undefined,
): StoryblokAsset | undefined => {
  const featuredImageBlok = featuredImageBloks?.[0];
  if (!featuredImageBlok || featuredImageBlok.component !== "image") {
    return undefined;
  }

  const image = featuredImageBlok.image;
  if (!image?.filename) {
    return undefined;
  }

  return image;
};
