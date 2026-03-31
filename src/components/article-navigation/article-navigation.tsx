import "server-only";

import Link from "next/link";
import type { FC } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/button";
import { getArticlePath } from "@/lib/seo";
import { getLatestArticlesSeed } from "@/storyblok/blog-listings";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

export interface ArticleNavigationProps {
  currentStory: BlogStory;
  version: "draft" | "published";
}

const getStoryTimestamp = (story: BlogStory): number => {
  const value = story.first_published_at ?? story.published_at;
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sortStoriesByPublishDateDesc = (stories: BlogStory[]): BlogStory[] => {
  return [...stories].sort((left, right) => {
    const timestampDiff = getStoryTimestamp(right) - getStoryTimestamp(left);
    if (timestampDiff !== 0) {
      return timestampDiff;
    }

    const leftKey = left.uuid ?? left.slug ?? left.full_slug;
    const rightKey = right.uuid ?? right.slug ?? right.full_slug;
    return leftKey.localeCompare(rightKey);
  });
};

export const ArticleNavigation: FC<ArticleNavigationProps> = async ({
  currentStory,
  version,
}) => {
  const stories = sortStoriesByPublishDateDesc(
    await getLatestArticlesSeed(version),
  );
  const currentIndex = stories.findIndex((story) => {
    return story.id === currentStory.id || story.uuid === currentStory.uuid;
  });

  let previousStory: BlogStory | undefined;
  let nextStory: BlogStory | undefined;

  if (currentIndex >= 0) {
    previousStory = stories[currentIndex + 1];
    nextStory = stories[currentIndex - 1];
  } else {
    const currentTimestamp = getStoryTimestamp(currentStory);
    previousStory = stories.find((story) => {
      return getStoryTimestamp(story) < currentTimestamp;
    });
    nextStory = stories.find((story) => {
      return getStoryTimestamp(story) > currentTimestamp;
    });
  }

  if (!previousStory && !nextStory) {
    return null;
  }

  return (
    <nav
      className="mx-auto flex w-full items-center justify-between gap-4 border-t-[3px] border-[#1a1a1a] px-5 py-6 md:px-12 md:py-10 2xl:max-w-6xl"
      aria-label="Article navigation"
    >
      {previousStory ? (
        <Button asChild variant="secondary" size="small">
          <Link href={getArticlePath(previousStory)}>
            <FaArrowLeft aria-hidden className="size-3" />
            Prev
          </Link>
        </Button>
      ) : (
        <span />
      )}

      {nextStory ? (
        <Button asChild variant="primary" size="small">
          <Link href={getArticlePath(nextStory)}>
            Next
            <FaArrowRight aria-hidden className="size-3" />
          </Link>
        </Button>
      ) : null}
    </nav>
  );
};
