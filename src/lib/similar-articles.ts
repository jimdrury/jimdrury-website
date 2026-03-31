import "server-only";

import {
  formatStoryDate,
  getDefaultStoryCategory,
  getFeaturedImageAsset,
  getStoryDateTime,
  parseStoryblokImageDimensions,
} from "@/lib/blog";
import { getArticlePath } from "@/lib/seo";
import { getLatestArticlesSeed } from "@/storyblok/blog-listings";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

type RankedStory = {
  story: BlogStory;
  score: number;
};

export type SimilarArticleItem = {
  href: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  dateTime?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  category?: string;
};

const normalizeTag = (value: string): string => {
  return value.trim().toLowerCase();
};

const getNormalizedTagSet = (tags: string[] | undefined): Set<string> => {
  const normalizedTags = (tags ?? [])
    .map((tag) => normalizeTag(tag))
    .filter((tag) => tag.length > 0);
  return new Set(normalizedTags);
};

const getStoryTimestamp = (story: BlogStory): number => {
  const rawValue = story.first_published_at ?? story.published_at;
  if (!rawValue) {
    return 0;
  }

  const value = Date.parse(rawValue);
  return Number.isFinite(value) ? value : 0;
};

const rankStoriesBySharedTags = (
  stories: BlogStory[],
  currentTagSet: Set<string>,
): RankedStory[] => {
  return stories
    .map((story) => {
      const candidateTagSet = getNormalizedTagSet(story.tag_list);
      let score = 0;

      candidateTagSet.forEach((tag) => {
        if (currentTagSet.has(tag)) {
          score += 1;
        }
      });

      return {
        story,
        score,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const timestampDiff =
        getStoryTimestamp(b.story) - getStoryTimestamp(a.story);
      if (timestampDiff !== 0) {
        return timestampDiff;
      }

      const leftKey = a.story.uuid ?? a.story.slug ?? a.story.full_slug;
      const rightKey = b.story.uuid ?? b.story.slug ?? b.story.full_slug;
      return leftKey.localeCompare(rightKey);
    });
};

export const getSimilarArticleItems = async ({
  currentStory,
  version,
  count,
}: {
  currentStory: BlogStory;
  version: "draft" | "published";
  count: number;
}): Promise<SimilarArticleItem[]> => {
  const currentTagSet = getNormalizedTagSet(currentStory.tag_list);
  if (currentTagSet.size === 0) {
    return [];
  }

  const normalizedCount = Math.min(3, Math.max(1, Math.trunc(count)));
  const seedStories = await getLatestArticlesSeed(version);
  const filteredStories = seedStories.filter((story) => {
    return story.uuid !== currentStory.uuid && story.id !== currentStory.id;
  });
  const rankedStories = rankStoriesBySharedTags(filteredStories, currentTagSet);
  const selectedStories = rankedStories.slice(0, normalizedCount);

  return selectedStories.map(({ story }) => {
    const featuredImage = getFeaturedImageAsset(story.content.featured_image);
    const imageSrc = featuredImage?.filename;
    const imageDimensions = parseStoryblokImageDimensions(imageSrc);

    return {
      href: getArticlePath(story),
      title: story.name,
      excerpt: story.content.excerpt?.trim(),
      publishedAt: formatStoryDate(story),
      dateTime: getStoryDateTime(story),
      imageSrc,
      imageAlt: featuredImage?.alt || story.name,
      imageWidth: imageDimensions?.width,
      imageHeight: imageDimensions?.height,
      category: getDefaultStoryCategory(story) ?? undefined,
    };
  });
};
