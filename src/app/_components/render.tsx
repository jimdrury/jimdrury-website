import "server-only";

import { StoryblokStory } from "@storyblok/react/rsc";
import { cacheLife, cacheTag } from "next/cache";
import { draftMode } from "next/headers";
import type { FC } from "react";
import { getStoryblokApi, getStoryblokCv } from "@/storyblok";

export const Render: FC = async () => {
  const { isEnabled } = await draftMode();

  const { data } = await fetchData(isEnabled ? "draft" : "published");

  return <StoryblokStory story={data.story} />;
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
