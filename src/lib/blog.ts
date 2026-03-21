import "server-only";
import { format, isValid, parseISO } from "date-fns";
import { cacheLife, cacheTag } from "next/cache";
import { getStoryblokApi, getStoryblokCv } from "@/storyblok";
import { getArticlesByTag } from "@/storyblok/blog-listings";
import {
  BLOG_ARCHIVE_PAGE_SIZE,
  BLOG_CONTENT_TYPE,
  BLOG_PREFIX,
  type BlogStory,
  getFeaturedImageAsset,
  isArticleStory,
  parsePageParam,
  parseStoryblokImageDimensions,
  type StoryblokStoriesResponse,
} from "@/storyblok/blog-listings-utils";

export type { BlogStory } from "@/storyblok/blog-listings-utils";

export type BlogArchivePagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

const normalizeCategory = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const CANONICAL_CATEGORY_PRIORITY = [
  "nextjs",
  "codegen",
  "ai",
  "streaming",
  "innovation",
  "fastify",
  "typescript",
] as const;

export const getStoryCategories = (story: BlogStory): string[] => {
  const categories = (story.tag_list ?? [])
    .map((tag) => normalizeCategory(tag))
    .filter((category) => category.length > 0);

  return [...new Set(categories)];
};

const getStoryDateValue = (story: BlogStory): string | null => {
  return story.first_published_at ?? story.published_at ?? null;
};

const BLOG_FETCH_PER_PAGE = 100;

const getDatePrefix = ({
  year,
  month,
  day,
}: {
  year: string;
  month?: string;
  day?: string;
}): string | null => {
  if (!/^\d{4}$/.test(year)) {
    return null;
  }

  const parts = [year];

  if (month !== undefined) {
    if (!/^\d{1,2}$/.test(month)) {
      return null;
    }

    parts.push(month.padStart(2, "0"));
  }

  if (day !== undefined) {
    if (!/^\d{1,2}$/.test(day)) {
      return null;
    }

    parts.push(day.padStart(2, "0"));
  }

  return parts.join("-");
};

const getStoryDatePrefix = (story: BlogStory): string | null => {
  const value = getStoryDateValue(story);
  if (!value || value.length < 10) {
    return null;
  }

  const datePart = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : null;
};

const getStoriesByDatePrefix = async ({
  datePrefix,
  version,
}: {
  datePrefix: string;
  version: "draft" | "published";
}): Promise<BlogStory[]> => {
  "use cache";
  cacheLife("default");
  cacheTag(`blog-date-archive-${datePrefix}-${version}`);

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
    stories.push(
      ...batch.filter((story) => {
        const storyDate = getStoryDatePrefix(story);
        return storyDate ? storyDate.startsWith(datePrefix) : false;
      }),
    );

    if (batch.length < BLOG_FETCH_PER_PAGE) {
      break;
    }

    page += 1;
  }

  return stories;
};

export {
  BLOG_ARCHIVE_PAGE_SIZE,
  getArticlesByTag,
  getFeaturedImageAsset,
  parsePageParam,
  parseStoryblokImageDimensions,
};

export const getStoryDateTime = (story: BlogStory): string | undefined => {
  const value = getStoryDateValue(story);
  if (!value) {
    return undefined;
  }

  const date = parseISO(value);
  return isValid(date) ? value : undefined;
};

export const formatStoryDate = (story: BlogStory): string | undefined => {
  const value = getStoryDateValue(story);
  if (!value) {
    return undefined;
  }

  const date = parseISO(value);
  if (!isValid(date)) {
    return undefined;
  }

  const utcDateOnly = value.slice(0, 10);
  const calendarDate = parseISO(utcDateOnly);
  return isValid(calendarDate)
    ? format(calendarDate, "MMM d, yyyy")
    : undefined;
};

export const getDefaultStoryCategory = (story: BlogStory): string | null => {
  const categories = getStoryCategories(story);

  if (categories.length === 0) {
    return null;
  }

  if (categories.length === 1) {
    return categories[0];
  }

  for (const preferredCategory of CANONICAL_CATEGORY_PRIORITY) {
    if (categories.includes(preferredCategory)) {
      return preferredCategory;
    }
  }

  return categories[0];
};

export const buildPaginationHref = (pathname: string, page: number): string => {
  if (page <= 1) {
    return pathname;
  }

  return `${pathname}?page=${page}`;
};

export const getDateArchive = async ({
  year,
  month,
  day,
  page,
  version,
}: {
  year: string;
  month?: string;
  day?: string;
  page: number;
  version: "draft" | "published";
}): Promise<{ stories: BlogStory[]; pagination: BlogArchivePagination }> => {
  const datePrefix = getDatePrefix({ year, month, day });
  const currentPage = Number.isFinite(page) ? Math.max(1, Math.trunc(page)) : 1;

  if (!datePrefix) {
    return {
      stories: [],
      pagination: {
        page: currentPage,
        pageSize: BLOG_ARCHIVE_PAGE_SIZE,
        total: 0,
        totalPages: 1,
        hasPrevious: currentPage > 1,
        hasNext: false,
      },
    };
  }

  const stories = await getStoriesByDatePrefix({
    datePrefix,
    version,
  });
  const total = stories.length;
  const totalPages = Math.max(1, Math.ceil(total / BLOG_ARCHIVE_PAGE_SIZE));
  const boundedPage = Math.min(currentPage, totalPages);
  const startIndex = (boundedPage - 1) * BLOG_ARCHIVE_PAGE_SIZE;
  const pagedStories = stories.slice(
    startIndex,
    startIndex + BLOG_ARCHIVE_PAGE_SIZE,
  );

  return {
    stories: pagedStories,
    pagination: {
      page: boundedPage,
      pageSize: BLOG_ARCHIVE_PAGE_SIZE,
      total,
      totalPages,
      hasPrevious: boundedPage > 1,
      hasNext: boundedPage < totalPages,
    },
  };
};
