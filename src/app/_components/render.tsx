import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import type { FC } from "react";
import { getStoryblokApi, getStoryblokCv } from "@/storyblok";
import { StoryContent } from "@/storyblok/renderer";

const StoryPreview = dynamic(() =>
  import("@/storyblok/preview").then((mod) => mod.StoryPreview),
);

export const Render: FC = async () => {
  const { isEnabled } = await draftMode();

  const { data } = await fetchData(isEnabled ? "draft" : "published");

  if (!isEnabled) {
    return <StoryContent story={data.story} />;
  }

  return (
    <StoryPreview storyId={data.story.id ?? 0} story={data.story}>
      <StoryContent story={data.story} />
    </StoryPreview>
  );
};

const fetchData = async (version: "draft" | "published") => {
  "use cache";
  cacheLife("default");
  cacheTag(`home-page`);
  const storyblokApi = getStoryblokApi();

  return storyblokApi.get("cdn/stories/home", {
    version,
    cv: getStoryblokCv(),
  });
};
