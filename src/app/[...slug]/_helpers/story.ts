import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  getStoryPageTag,
  getStorySlugVersionTag,
  getStoryVersionTag,
} from "@/lib/cache-tags";
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
  cacheTag(getStoryPageTag());
  cacheTag(getStoryVersionTag(version));
  cacheTag(getStorySlugVersionTag({ slug, version }));

  return fetchStoryBySlugFromApi({ slug, version });
};
