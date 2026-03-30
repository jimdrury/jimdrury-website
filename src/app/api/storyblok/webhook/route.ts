import { environment } from "@/environment";
import {
  parseWebhookPayload,
  resolveUrlsFromStory,
  submitToIndexNow,
  verifyWebhookSignature,
} from "@/lib/indexnow";
import { fetchStoryBySlug } from "@/lib/indexnow-story";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("webhook-signature");

  if (environment.STORYBLOK_WEBHOOK_SECRET && signature) {
    if (!verifyWebhookSignature(rawBody, signature)) {
      return Response.json(
        { error: "Invalid webhook signature" },
        { status: 401 },
      );
    }
  }

  const payload = parseWebhookPayload(rawBody);
  if (!payload) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (payload.action !== "story.published") {
    return Response.json({ ok: true, skipped: true, action: payload.action });
  }

  if (!payload.full_slug) {
    return Response.json(
      { error: "Missing full_slug in payload" },
      { status: 400 },
    );
  }

  if (!environment.INDEXNOW_KEY) {
    return Response.json(
      { error: "INDEXNOW_KEY is not configured" },
      { status: 500 },
    );
  }

  const story = await fetchStoryBySlug({
    slug: payload.full_slug,
    version: "published",
  });

  const urls = resolveUrlsFromStory(payload.full_slug, story);

  if (urls.length === 0) {
    return Response.json({ ok: true, skipped: true, reason: "no_urls" });
  }

  const indexNowResponse = await submitToIndexNow(urls);

  return Response.json({
    ok: indexNowResponse.ok,
    status: indexNowResponse.status,
    urls,
  });
}
