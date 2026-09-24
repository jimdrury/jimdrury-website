import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { getStoryCacheTags, getStoryIdTag } from "@/lib/cache-tags";
import { fetchStoryBySlug as fetchStoryBySlugFromApi } from "@/lib/storyblok-story";
import type { StoryData } from "@/storyblok/lib";

export const fetchStoryBySlug = async ({
  slug,
  version,
}: {
  slug: string;
  version: "draft" | "published";
}): Promise<StoryData | null> => {
  "use cache";
  cacheLife("ultraLong");
  cacheTag(...getStoryCacheTags({ slug, version }));

  const story = await fetchStoryBySlugFromApi({ slug, version });
  if (typeof story?.id === "number") {
    cacheTag(getStoryIdTag({ id: story.id, version }));
  }

  return story;
};
