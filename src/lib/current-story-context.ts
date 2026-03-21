import "server-only";
import { cache } from "react";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

type CurrentStoryContext = {
  story: BlogStory | null;
};

const getCurrentStoryContext = cache<CurrentStoryContext>(() => {
  return {
    story: null,
  };
});

export const setCurrentStory = (story: BlogStory): void => {
  const context = getCurrentStoryContext();
  context.story = story;
};

export const getCurrentStory = (): BlogStory | null => {
  return getCurrentStoryContext().story;
};
