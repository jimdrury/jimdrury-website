import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { getStoryCacheTags } from "@/lib/cache-tags";
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

  return fetchStoryBySlugFromApi({ slug, version });
};
