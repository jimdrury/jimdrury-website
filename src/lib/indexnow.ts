import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { environment } from "@/environment";
import { getArticleCanonicalUrl, SITE_ORIGIN } from "@/lib/seo";
import type { BlogStory } from "@/storyblok/blog-listings-utils";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const SITE_HOST = "www.jimdrury.co.uk";

type StoryblokWebhookPayload = {
  action: string;
  text?: string;
  story_id?: number;
  full_slug?: string;
  space_id?: number;
};

export const verifyWebhookSignature = (
  payload: string,
  signature: string | null,
): boolean => {
  const secret = environment.STORYBLOK_WEBHOOK_SECRET;
  if (!secret) {
    return false;
  }

  if (!signature) {
    return false;
  }

  const expected = createHmac("sha1", secret).update(payload).digest("hex");

  if (expected.length !== signature.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

export const parseWebhookPayload = (
  raw: string,
): StoryblokWebhookPayload | null => {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const payload = parsed as Record<string, unknown>;
    if (typeof payload.action !== "string") {
      return null;
    }

    return {
      action: payload.action,
      text: typeof payload.text === "string" ? payload.text : undefined,
      story_id:
        typeof payload.story_id === "number" ? payload.story_id : undefined,
      full_slug:
        typeof payload.full_slug === "string" ? payload.full_slug : undefined,
      space_id:
        typeof payload.space_id === "number" ? payload.space_id : undefined,
    };
  } catch {
    return null;
  }
};

const BLOG_PREFIX = "blog/";

export const resolveUrlsFromSlug = (
  fullSlug: string,
  story: BlogStory | null,
): string[] => {
  if (fullSlug.startsWith(BLOG_PREFIX)) {
    if (!story) {
      return [];
    }
    return [getArticleCanonicalUrl(story)];
  }

  const normalizedSlug = fullSlug.replace(/\/$/, "");

  if (normalizedSlug === "home") {
    return [`${SITE_ORIGIN}/`];
  }

  return [`${SITE_ORIGIN}/${normalizedSlug}`];
};

export const submitToIndexNow = async (urls: string[]): Promise<Response> => {
  const key = environment.INDEXNOW_KEY;
  if (!key) {
    throw new Error("INDEXNOW_KEY is not configured");
  }

  return fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: SITE_HOST,
      key,
      keyLocation: `https://${SITE_HOST}/${key}.txt`,
      urlList: urls,
    }),
  });
};
