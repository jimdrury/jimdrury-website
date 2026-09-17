import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  getStoryPageTag,
  getStorySlugVersionTag,
  getStoryVersionTag,
} from "@/lib/cache-tags";
import { getStoryblokApi, getStoryblokCv } from "@/storyblok";
import type { StoryData } from "@/storyblok/lib";

type StoryblokStoryResponse = {
  data?: {
    story?: StoryData;
  };
};

type StoryblokPageListResponse = {
  data?: {
    stories?: Array<{
      full_slug?: string;
      is_folder?: boolean;
    }>;
  };
};

const PAGE_LIST_PER_PAGE = 100;

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

export const getPublishedPageParams = async (): Promise<
  { slug: string[] }[]
> => {
  "use cache";
  cacheLife("ultraLong");
  cacheTag(getStoryPageTag());
  cacheTag(getStoryVersionTag("published"));

  const storyblokApi = getStoryblokApi();
  const params: { slug: string[] }[] = [];
  const seen = new Set<string>();
  let page = 1;

  while (true) {
    const response = (await storyblokApi.get("cdn/stories", {
      version: "published",
      content_type: "page",
      cv: getStoryblokCv(),
      page,
      per_page: PAGE_LIST_PER_PAGE,
    })) as StoryblokPageListResponse;

    const batch = response.data?.stories ?? [];
    for (const story of batch) {
      if (story.is_folder) {
        continue;
      }

      const fullSlug = (story.full_slug ?? "").replace(/\/$/, "");
      if (!fullSlug) {
        continue;
      }

      const slug = fullSlug.split("/").filter((segment) => segment.length > 0);
      if (slug.length === 0) {
        continue;
      }

      const key = slug.join("/");
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      params.push({ slug });
    }

    if (batch.length < PAGE_LIST_PER_PAGE) {
      break;
    }

    page += 1;
  }

  if (!seen.has("home")) {
    params.push({ slug: ["home"] });
  }

  if (params.length === 0) {
    return [{ slug: ["home"] }];
  }

  return params;
};
