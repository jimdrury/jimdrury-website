import "server-only";
import { mapStoryblokFetchError } from "@/lib/storyblok-errors";
import { getStoryblokApi, getStoryblokCvParams } from "@/storyblok";
import type { StoryData } from "@/storyblok/lib";

type StoryblokStoryResponse = {
  data?: {
    story?: StoryData;
  };
};

const toStoryPath = (slug: string): string | null => {
  const segments = slug.split("/").filter((segment) => segment.length > 0);
  if (
    segments.length === 0 ||
    segments.some((segment) => segment === "." || segment === "..")
  ) {
    return null;
  }

  return segments.map(encodeURIComponent).join("/");
};

export const fetchStoryBySlug = async ({
  slug,
  version,
}: {
  slug: string;
  version: "draft" | "published";
}): Promise<StoryData | null> => {
  const storyPath = toStoryPath(slug);
  if (!storyPath) {
    return null;
  }

  const storyblokApi = getStoryblokApi();

  try {
    const response = (await storyblokApi.get(`cdn/stories/${storyPath}`, {
      version,
      ...(await getStoryblokCvParams(version)),
    })) as StoryblokStoryResponse;

    return response.data?.story ?? null;
  } catch (error) {
    return mapStoryblokFetchError(error, { slug, version });
  }
};
