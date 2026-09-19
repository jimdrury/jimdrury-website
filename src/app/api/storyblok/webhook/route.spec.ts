import { revalidateTag } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitToIndexNow } from "@/lib/indexnow";
import { fetchStoryBySlug } from "@/lib/storyblok-story";

const WEBHOOK_SECRET = "webhook-secret";

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

const post = async (body: string, secret?: string | null) => {
  const url = new URL("https://www.jimdrury.co.uk/api/storyblok/webhook");
  if (secret !== null && secret !== undefined) {
    url.searchParams.set("secret", secret);
  }

  const { POST } = await import("./route");
  return POST(
    new Request(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
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

  it("returns 401 and does not revalidate when the secret is missing", async () => {
    const response = await post('{"action":"story.saved"}', null);

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(fetchStoryBySlug).not.toHaveBeenCalled();
  });

  it("returns 401 and does not revalidate when the secret is wrong", async () => {
    const response = await post('{"action":"story.saved"}', "wrong-secret");

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 400 without revalidating when a valid secret has an invalid JSON payload", async () => {
    const response = await post("not-json", WEBHOOK_SECRET);

    expect(response.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 401 when the secret is valid but the payload is for another space", async () => {
    const body = JSON.stringify({
      action: "story.saved",
      space_id: 99999,
    });
    const response = await post(body, WEBHOOK_SECRET);

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates scoped tags after a valid secret and payload", async () => {
    const body = JSON.stringify({
      action: "story.saved",
      full_slug: "about",
      space_id: 12345,
    });
    const response = await post(body, WEBHOOK_SECRET);
    const json = (await response.json()) as {
      ok: boolean;
      invalidatedTags: string[];
    };

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.invalidatedTags).toContain(
      "content:story-page:published:about",
    );
    expect(json.invalidatedTags).toContain("content:home-page");
    expect(json.invalidatedTags).toContain("content:blog:index:published");
    expect(json.invalidatedTags).not.toContain("content:story-page");
    expect(json.invalidatedTags).not.toContain("content:story-page:published");
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
    const response = await post(body, WEBHOOK_SECRET);

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
    const response = await post(body, WEBHOOK_SECRET);
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
    const response = await post(body, WEBHOOK_SECRET);
    const json = (await response.json()) as { ok: boolean; urls: string[] };

    expect(response.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.urls).toEqual(["https://www.jimdrury.co.uk/about"]);
    expect(submitToIndexNow).toHaveBeenCalledWith([
      "https://www.jimdrury.co.uk/about",
    ]);
  });
});
