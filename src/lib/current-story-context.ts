import "server-only";
import { cache } from "react";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

type CurrentStoryContext = {
  story: BlogStory | null;
};

const getCurrentStoryContext = cache((): CurrentStoryContext => {
  return {
    story: null,
  };
});

export const setCurrentStory = (story: BlogStory): void => {
  const context = getCurrentStoryContext();
  context.story = story;
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
  context.story = isBlogStory(story) ? story : null;
};

export const getCurrentStory = (): BlogStory | null => {
  return getCurrentStoryContext().story;
};
