import "server-only";

import type { BlogStory } from "@/storyblok/blog-listings-utils";

export const isBlogStory = (value: unknown): value is BlogStory => {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (
    !("content" in value) ||
    typeof value.content !== "object" ||
    value.content === null
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

export const asBlogStory = (story: unknown): BlogStory | null => {
  return isBlogStory(story) ? story : null;
};

export const getStoryName = (story: unknown): string | null => {
  if (!story || typeof story !== "object" || !("name" in story)) {
    return null;
  }

  return typeof story.name === "string" ? story.name : null;
};

export const getStoryUpdatedAt = (story: unknown): string | null => {
  if (!story || typeof story !== "object") {
    return null;
  }

  const record = story as Record<string, unknown>;

  if (typeof record.published_at === "string") {
    return record.published_at;
  }

  if (typeof record.first_published_at === "string") {
    return record.first_published_at;
  }

  return null;
};
