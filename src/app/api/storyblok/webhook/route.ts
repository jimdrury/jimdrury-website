import { environment } from "@/environment";
import {
  parseWebhookPayload,
  resolveUrlsFromSlug,
  submitToIndexNow,
  verifyWebhookSignature,
} from "@/lib/indexnow";
import { getArticleBySlug } from "@/storyblok/blog-listings";

const BLOG_PREFIX = "blog/";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("webhook-signature");

  if (environment.STORYBLOK_WEBHOOK_SECRET) {
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

  const isBlogPost = payload.full_slug.startsWith(BLOG_PREFIX);
  let story = null;

  if (isBlogPost) {
    const slug = payload.full_slug.slice(BLOG_PREFIX.length);
    story = await getArticleBySlug({ slug, version: "published" });
  }

  const urls = resolveUrlsFromSlug(payload.full_slug, story);

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
