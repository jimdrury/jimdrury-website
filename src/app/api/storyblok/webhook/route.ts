import { revalidateTag } from "next/cache";
import { environment } from "@/environment";
import {
  parseWebhookPayload,
  resolveUrlsFromStory,
  submitToIndexNow,
} from "@/lib/indexnow";
import { fetchStoryBySlug } from "@/lib/storyblok-story";
import {
  isValidStoryblokWebhookSignature,
  WEBHOOK_SIGNATURE_HEADER,
} from "./_helpers/verify-webhook-signature";
import { getWebhookRevalidationTags } from "./_helpers/webhook-cache-tags";

const POST = async (request: Request) => {
  const rawBody = await request.text();
  const signature = request.headers.get(WEBHOOK_SIGNATURE_HEADER);

  if (
    !isValidStoryblokWebhookSignature({
      rawBody,
      signature,
      secret: environment.STORYBLOK_WEBHOOK_SECRET,
    })
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = parseWebhookPayload(rawBody);
  if (!payload) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (
    payload.space_id !== undefined &&
    String(payload.space_id) !== environment.STORYBLOK_SPACE_ID
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invalidatedTags = getWebhookRevalidationTags(payload.full_slug);
  for (const tag of invalidatedTags) {
    revalidateTag(tag, "max");
  }

  if (payload.action !== "story.published") {
    return Response.json({
      ok: true,
      skipped: true,
      action: payload.action,
      invalidatedTags,
    });
  }

  if (!payload.full_slug) {
    return Response.json(
      { error: "Missing full_slug in payload" },
      { status: 400 },
    );
  }

  if (!environment.INDEXNOW_KEY) {
    return Response.json({
      ok: true,
      skipped: true,
      reason: "indexnow_unconfigured",
      invalidatedTags,
    });
  }

  let story: Awaited<ReturnType<typeof fetchStoryBySlug>>;
  try {
    story = await fetchStoryBySlug({
      slug: payload.full_slug,
      version: "published",
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch published story" },
      { status: 503 },
    );
  }

  if (!story) {
    return Response.json({
      ok: true,
      skipped: true,
      reason: "story_not_found",
      invalidatedTags,
    });
  }

  const urls = resolveUrlsFromStory(payload.full_slug, story);

  if (urls.length === 0) {
    return Response.json({
      ok: true,
      skipped: true,
      reason: "no_urls",
      invalidatedTags,
    });
  }

  const indexNowResponse = await submitToIndexNow(urls);

  return Response.json({
    ok: indexNowResponse.ok,
    status: indexNowResponse.status,
    urls,
    invalidatedTags,
  });
};

export { POST };
