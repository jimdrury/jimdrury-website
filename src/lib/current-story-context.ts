import "server-only";
import { cache } from "react";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

type CurrentStoryContext = {
  story: BlogStory | null;
  storyName: string | null;
  storyUpdatedAt: string | null;
};

const getCurrentStoryContext = cache((): CurrentStoryContext => {
  return {
    story: null,
    storyName: null,
    storyUpdatedAt: null,
  };
});

export const setCurrentStory = (story: BlogStory): void => {
  const context = getCurrentStoryContext();
  context.story = story;
  context.storyName = story.name;
  context.storyUpdatedAt =
    story.published_at ?? story.first_published_at ?? null;
};

const isBlogStory = (value: unknown): value is BlogStory => {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (
    !("content" in value) ||
    typeof value.content !== "object" ||
    !value.content
  ) {
    return false;
  }

  if (
    !("component" in value.content) ||
    value.content.component !== "article"
  ) {
    return false;
  }

  return true;
};

export const setCurrentStoryFromUnknown = (story: unknown): void => {
  const context = getCurrentStoryContext();
  const storyObject =
    typeof story === "object" && story !== null
      ? (story as Record<string, unknown>)
      : null;
  context.storyName =
    storyObject && typeof storyObject.name === "string"
      ? storyObject.name
      : null;
  context.storyUpdatedAt =
    storyObject && typeof storyObject.published_at === "string"
      ? storyObject.published_at
      : storyObject && typeof storyObject.first_published_at === "string"
        ? storyObject.first_published_at
        : null;
  context.story = isBlogStory(story) ? story : null;
};

export const getCurrentStory = (): BlogStory | null => {
  return getCurrentStoryContext().story;
};

export const getCurrentStoryName = (): string | null => {
  return getCurrentStoryContext().storyName;
};

export const getCurrentStoryUpdatedAt = (): string | null => {
  return getCurrentStoryContext().storyUpdatedAt;
};
