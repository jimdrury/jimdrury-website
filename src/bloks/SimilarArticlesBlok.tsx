import "server-only";
import { draftMode } from "next/headers";
import type { FC } from "react";
import { SimilarArticles } from "@/components/similar-articles";
import { formatStoryDate, getStoryDateTime } from "@/lib/blog";
import { getCurrentStory } from "@/lib/current-story-context";
import { getArticlePath } from "@/lib/seo";
import { getLatestArticlesSeed } from "@/storyblok/blog-listings";
import type { BlogStory } from "@/storyblok/blog-listings-utils";
import { type SbBlokData, storyblokEditable } from "@/storyblok/lib";

type SimilarArticlesBlokData = SbBlokData & {
  count?: number;
};

type SimilarArticlesBlokProps = {
  blok: SimilarArticlesBlokData;
};

type RankedStory = {
  story: BlogStory;
  score: number;
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

export const SimilarArticlesBlok: FC<SimilarArticlesBlokProps> = async ({
  blok,
}) => {
  const currentStory = getCurrentStory();
  if (!currentStory) {
    return null;
  }

  const currentTagSet = getNormalizedTagSet(currentStory.tag_list);
  if (currentTagSet.size === 0) {
    return null;
  }

  const { isEnabled } = await draftMode();
  const version = isEnabled ? "draft" : "published";
  const count = Math.min(3, Math.max(1, Math.trunc(blok.count ?? 3)));
  const seedStories = await getLatestArticlesSeed(version);
  const filteredStories = seedStories.filter((story) => {
    return story.uuid !== currentStory.uuid && story.id !== currentStory.id;
  });

  const rankedStories = rankStoriesBySharedTags(filteredStories, currentTagSet);
  const selectedStories = rankedStories.slice(0, count);
  if (selectedStories.length === 0) {
    return null;
  }

  return (
    <div {...storyblokEditable(blok)}>
      <SimilarArticles
        items={selectedStories.map(({ story }) => ({
          href: getArticlePath(story),
          title: story.name,
          excerpt: story.content.excerpt?.trim(),
          publishedAt: formatStoryDate(story),
          dateTime: getStoryDateTime(story),
        }))}
      />
    </div>
  );
};
