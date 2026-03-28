import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getStoryblokApi, getStoryblokCv } from "@/storyblok";
import {
  BLOG_ARCHIVE_PAGE_SIZE,
  BLOG_CONTENT_TYPE,
  BLOG_PREFIX,
  type BlogStory,
  isArticleStory,
  type StoryblokStoriesResponse,
} from "@/storyblok/blog-listings-utils";

const BLOG_FETCH_PER_PAGE = 100;

type StoryblokTag = {
  name?: string;
  taggings_count?: number | string;
};

type StoryblokTagsResponse = {
  data?: {
    tags?: StoryblokTag[];
  };
};

export const getArticlesByTag = async (
  tag: string,
  index: number,
  version: "draft" | "published" = "published",
): Promise<BlogStory[]> => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`blog-articles-${tag}-${index}-${version}`);

  const normalizedTag = tag.trim();
  if (!normalizedTag) {
    return [];
  }

  const storyblokApi = getStoryblokApi();
  const pageIndex = Number.isFinite(index) ? Math.max(0, Math.trunc(index)) : 0;
  const response = (await storyblokApi.get("cdn/stories", {
    version,
    cv: getStoryblokCv(),
    starts_with: BLOG_PREFIX,
    content_type: BLOG_CONTENT_TYPE,
    with_tag: normalizedTag,
    sort_by: "first_published_at:desc",
    page: pageIndex + 1,
    per_page: BLOG_ARCHIVE_PAGE_SIZE,
  })) as StoryblokStoriesResponse;

  return (response.data?.stories ?? []).filter(isArticleStory);
};

export const getAllArticles = async (
  version: "draft" | "published" = "published",
): Promise<BlogStory[]> => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`blog-articles-all-${version}`);

  const storyblokApi = getStoryblokApi();
  const stories: BlogStory[] = [];
  let page = 1;

  while (true) {
    const response = (await storyblokApi.get("cdn/stories", {
      version,
      cv: getStoryblokCv(),
      starts_with: BLOG_PREFIX,
      content_type: BLOG_CONTENT_TYPE,
      sort_by: "first_published_at:desc",
      page,
      per_page: BLOG_FETCH_PER_PAGE,
    })) as StoryblokStoriesResponse;

    const batch = (response.data?.stories ?? []).filter(isArticleStory);
    stories.push(...batch);

    if (batch.length < BLOG_FETCH_PER_PAGE) {
      break;
    }

    page += 1;
  }

  return stories;
};

export const getBlogTags = async (
  version: "draft" | "published" = "published",
): Promise<{ slug: string; count: number }[]> => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`blog-tags-${version}`);

  const storyblokApi = getStoryblokApi();
  const response = (await storyblokApi.get("cdn/tags", {
    version,
    cv: getStoryblokCv(),
    starts_with: BLOG_PREFIX,
  })) as StoryblokTagsResponse;

  return (response.data?.tags ?? [])
    .map((tag) => {
      const slug = (tag.name ?? "").trim();
      const count =
        typeof tag.taggings_count === "string"
          ? Number.parseInt(tag.taggings_count, 10)
          : (tag.taggings_count ?? 0);

      return {
        slug,
        count: Number.isFinite(count) ? count : 0,
      };
    })
    .filter((tag) => tag.slug.length > 0)
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.slug.localeCompare(b.slug);
    });
};

type StoryblokStoryResponse = {
  data?: {
    story?: BlogStory;
  };
};

export const getArticleBySlug = async ({
  slug,
  version,
}: {
  slug: string;
  version: "draft" | "published";
}): Promise<BlogStory | null> => {
  "use cache";
  cacheLife("minutes");
  cacheTag(`blog-article-${slug}-${version}`);

  const normalizedSlug = slug.trim();
  if (!normalizedSlug) {
    return null;
  }

  const storyblokApi = getStoryblokApi();

  try {
    const response = (await storyblokApi.get(
      `cdn/stories/${BLOG_PREFIX}${normalizedSlug}`,
      {
        version,
        cv: getStoryblokCv(),
      },
    )) as StoryblokStoryResponse;
    const story = response.data?.story;

    return story && isArticleStory(story) ? story : null;
  } catch {
    return null;
  }
};
