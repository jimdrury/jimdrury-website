import type { BlogStory } from "@/storyblok/blog-listings-utils";
import type { StoryData } from "@/storyblok/lib";

export const isArticleStory = (story: StoryData): story is BlogStory => {
  if (
    typeof story.content !== "object" ||
    story.content === null ||
    !("component" in story.content) ||
    story.content.component !== "article"
  ) {
    return false;
  }

  return (
    typeof story.id === "number" &&
    typeof story.slug === "string" &&
    typeof story.full_slug === "string" &&
    typeof story.name === "string"
  );
};
