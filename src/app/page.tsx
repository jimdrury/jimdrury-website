import { StoryblokStory } from "@storyblok/react/rsc";
import { draftMode } from "next/headers";
import { getStoryblokApi } from "@/storyblok";

export default async function Home() {
  const { data } = await fetchData();

  return <StoryblokStory story={data.story} />;
}

async function fetchData() {
  const { isEnabled } = await draftMode();
  const storyblokApi = getStoryblokApi();
  const version = isEnabled ? "draft" : "published";

  return storyblokApi.get("cdn/stories/home", { version });
}
