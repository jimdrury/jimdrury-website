"use server";

import { draftMode } from "next/headers";
import type { ReactElement } from "react";
import type { StoryData } from "@/storyblok/lib";
import { StoryPreviewRender } from "@/storyblok/preview/story-preview-render";

const isStoryData = (value: unknown): value is StoryData => {
  return typeof value === "object" && value !== null && "content" in value;
};

export const renderStoryPreview = async (
  story: unknown,
): Promise<ReactElement | null> => {
  if (!isStoryData(story)) {
    return null;
  }

  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return null;
  }

  return <StoryPreviewRender story={story} />;
};
