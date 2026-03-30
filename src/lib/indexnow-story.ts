import "server-only";
import { getStoryblokApi, getStoryblokCv } from "@/storyblok";
import type { StoryData } from "@/storyblok/lib";

type StoryblokStoryResponse = {
  data?: {
    story?: StoryData;
  };
};

export const fetchStoryBySlug = async ({
  slug,
  version,
}: {
  slug: string;
  version: "draft" | "published";
}): Promise<StoryData | null> => {
  const storyblokApi = getStoryblokApi();

  try {
    const response = (await storyblokApi.get(`cdn/stories/${slug}`, {
      version,
      cv: getStoryblokCv(),
    })) as StoryblokStoryResponse;

    return response.data?.story ?? null;
  } catch {
    return null;
  }
};
