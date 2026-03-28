import "server-only";
import type { FC } from "react";
import type { StoryData } from "@/storyblok/lib";
import { StoryContent } from "@/storyblok/renderer";

type StoryPreviewRenderProps = {
  story: StoryData;
};

export const StoryPreviewRender: FC<StoryPreviewRenderProps> = ({ story }) => {
  return <StoryContent story={story} />;
};
