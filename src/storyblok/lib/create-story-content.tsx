import type { FC } from "react";
import { setCurrentStoryFromUnknown } from "@/lib/current-story-context";
import type { SbBlokData, StoryData } from "./types";

type BlokRendererProps = {
  blok: SbBlokData;
};

type StoryContentProps = {
  story: StoryData;
};

const isSbBlokData = (value: unknown): value is SbBlokData => {
  return (
    typeof value === "object" &&
    value !== null &&
    "component" in value &&
    typeof value.component === "string"
  );
};

const parseStoryContent = (story: StoryData): SbBlokData | null => {
  if (typeof story.content !== "string") {
    return isSbBlokData(story.content) ? story.content : null;
  }

  try {
    const parsedContent = JSON.parse(story.content) as unknown;
    return isSbBlokData(parsedContent) ? parsedContent : null;
  } catch (error) {
    console.error(
      "An error occurred while trying to parse the story content",
      error,
    );
    return null;
  }
};

export const createStoryContent = (
  BlokRenderer: FC<BlokRendererProps>,
): FC<StoryContentProps> => {
  const StoryContent: FC<StoryContentProps> = ({ story }) => {
    setCurrentStoryFromUnknown(story);
    const content = parseStoryContent(story);

    if (!content) {
      return null;
    }

    return <BlokRenderer blok={content} />;
  };

  StoryContent.displayName = "StoryContent";

  return StoryContent;
};
