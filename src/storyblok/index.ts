import "server-only";
import { apiPlugin, storyblokInit } from "@storyblok/js";
import { cache } from "react";
import { environment } from "@/environment";

type StoryblokSpaceResponse = {
  data?: {
    space?: {
      version?: unknown;
    };
  };
};

export const getStoryblokApi = () => {
  const api = storyblokInit({
    accessToken: environment.STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      region: "eu",
      // The client's "auto" mode reuses a cv remembered in module memory, which
      // goes stale on warm serverless instances after a publish. We pass cv
      // explicitly instead, so never let the client attach one.
      cache: { clear: "manual", cv: "manual" },
    },
  }).storyblokApi;

  if (!api) {
    throw new Error("Storyblok API failed to initialize.");
  }

  return api;
};

/**
 * The space's current cache version (`cv`). Sending it lets Storyblok serve
 * published content from its CDN; it changes on every publish.
 *
 * Fetched fresh for each render pass rather than cached with "use cache": a
 * stale-while-revalidate `cv` could make a post-publish refill store the old
 * content. Only fills of our own caches reach here, so the extra call is rare.
 */
export const getStoryblokCv = cache(async (): Promise<number> => {
  try {
    const response = (await getStoryblokApi().get(
      "cdn/spaces/me",
    )) as StoryblokSpaceResponse;
    const version = response.data?.space?.version;

    if (typeof version === "number" && Number.isFinite(version)) {
      return version;
    }

    console.warn("Storyblok spaces/me returned no cache version");
  } catch (error) {
    console.warn("Failed to fetch Storyblok cache version", error);
  }

  // Busting the CDN cache is slower but always fresh, so it is a safe fallback.
  return Date.now();
});

/**
 * `cv` request params for a content version. Drafts are never served from
 * Storyblok's CDN cache, so they don't need one.
 */
export const getStoryblokCvParams = async (
  version: "draft" | "published",
): Promise<{ cv?: number }> => {
  if (version !== "published") {
    return {};
  }

  return { cv: await getStoryblokCv() };
};
