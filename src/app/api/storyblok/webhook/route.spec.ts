import { createHmac } from "node:crypto";
import { revalidateTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitToIndexNow } from "@/lib/indexnow";
import { fetchStoryBySlug } from "@/lib/storyblok-story";

vi.mock("@/environment", () => ({
  environment: {
    STORYBLOK_ACCESS_TOKEN: "test-token",
    STORYBLOK_SPACE_ID: "12345",
    STORYBLOK_WEBHOOK_SECRET: "webhook-secret",
    INDEXNOW_KEY: "abc123indexnowkey",
  },
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

vi.mock("@/lib/storyblok-story", () => ({
  fetchStoryBySlug: vi.fn(),
}));

vi.mock("@/lib/seo", () => ({
  SITE_ORIGIN: "https://www.jimdrury.co.uk",
  getArticleCanonicalUrl: vi.fn(
    (story: { slug: string }) =>
      `https://www.jimdrury.co.uk/blog/ai/${story.slug}`,
  ),
}));

vi.mock("@/lib/indexnow", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/indexnow")>();
  return {
    ...actual,
    submitToIndexNow: vi.fn(),
  };
});

const WEBHOOK_SECRET = "webhook-secret";

const sign = (body: string, secret = WEBHOOK_SECRET): string => {
  return createHmac("sha1", secret).update(body).digest("hex");
};

const post = async (body: string, signature?: string | null) => {
  const headers = new Headers({ "content-type": "application/json" });
  if (signature !== null && signature !== undefined) {
    headers.set("webhook-signature", signature);
  }

  const { POST } = await import("./route");
  return POST(
    new Request("https://www.jimdrury.co.uk/api/storyblok/webhook", {
      method: "POST",
      headers,
      body,
    }),
  );
};

describe("POST /api/storyblok/webhook", () => {
  beforeEach(() => {
    vi.mocked(revalidateTag).mockReset();
    vi.mocked(fetchStoryBySlug).mockReset();
    vi.mocked(submitToIndexNow).mockReset();
    vi.mocked(submitToIndexNow).mockResolvedValue(
      new Response(null, { status: 200 }),
    );
  });

  it("returns 401 and does not revalidate when the signature is missing", async () => {
    const response = await post('{"action":"story.saved"}', null);

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(fetchStoryBySlug).not.toHaveBeenCalled();
  });

  it("returns 401 and does not revalidate when the signature is invalid", async () => {
    const response = await post('{"action":"story.saved"}', "not-a-signature");

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 400 without revalidating when a signed payload is invalid JSON", async () => {
    const body = "not-json";
    const response = await post(body, sign(body));

    expect(response.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 401 when the signed payload is for another space", async () => {
    const body = JSON.stringify({
      action: "story.saved",
      space_id: 99999,
    });
    const response = await post(body, sign(body));

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates scoped tags after a valid signed payload", async () => {
    const body = JSON.stringify({
      action: "story.saved",
      full_slug: "about",
      space_id: 12345,
    });
    const response = await post(body, sign(body));
    const json = (await response.json()) as {
      ok: boolean;
      invalidatedTags: string[];
    };

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.invalidatedTags).toContain(
      "content:story-page:published:about",
    );
    expect(revalidateTag).toHaveBeenCalled();
    expect(fetchStoryBySlug).not.toHaveBeenCalled();
  });

  it("returns 503 without IndexNow when the published-story fetch fails", async () => {
    vi.mocked(fetchStoryBySlug).mockRejectedValue(new Error("CMS down"));
    const body = JSON.stringify({
      action: "story.published",
      full_slug: "about",
      space_id: 12345,
    });
    const response = await post(body, sign(body));

    expect(response.status).toBe(503);
    expect(submitToIndexNow).not.toHaveBeenCalled();
    expect(revalidateTag).toHaveBeenCalled();
  });

  it("does not submit IndexNow when the published story cannot be fetched", async () => {
    vi.mocked(fetchStoryBySlug).mockResolvedValue(null);
    const body = JSON.stringify({
      action: "story.published",
      full_slug: "attacker-slug",
      space_id: 12345,
    });
    const response = await post(body, sign(body));
    const json = (await response.json()) as {
      skipped: boolean;
      reason: string;
    };

    expect(response.status).toBe(200);
    expect(json.skipped).toBe(true);
    expect(json.reason).toBe("story_not_found");
    expect(submitToIndexNow).not.toHaveBeenCalled();
  });

  it("submits IndexNow only after a successful published-story fetch", async () => {
    vi.mocked(fetchStoryBySlug).mockResolvedValue({
      id: 99,
      name: "About",
      slug: "about",
      full_slug: "about",
      content: { component: "page" },
    });
    const body = JSON.stringify({
      action: "story.published",
      full_slug: "about",
      space_id: 12345,
    });
    const response = await post(body, sign(body));
    const json = (await response.json()) as { ok: boolean; urls: string[] };

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.urls).toEqual(["https://www.jimdrury.co.uk/about"]);
    expect(submitToIndexNow).toHaveBeenCalledWith([
      "https://www.jimdrury.co.uk/about",
    ]);
  });
});
