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

export const parsePageParam = (page: string | undefined): number => {
  const parsed = Number.parseInt(page ?? "1", 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
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
