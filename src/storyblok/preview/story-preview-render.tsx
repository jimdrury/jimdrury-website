import "server-only";
import type { FC } from "react";
import type { StoryData } from "@/storyblok/lib";
import { StoryContent } from "@/storyblok/renderer";

type StoryPreviewRenderProps = {
  pathname: string;
  story: StoryData;
};

export const StoryPreviewRender: FC<StoryPreviewRenderProps> = ({
  pathname,
  story,
}) => {
  return <StoryContent mode="draft" pathname={pathname} story={story} />;
};
