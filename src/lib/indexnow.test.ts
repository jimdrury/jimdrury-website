import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/environment", () => ({
  environment: {
    STORYBLOK_ACCESS_TOKEN: "test-token",
    STORYBLOK_SPACE_ID: "12345",
    INDEXNOW_KEY: "abc123indexnowkey",
    STORYBLOK_WEBHOOK_SECRET: "test-webhook-secret",
  },
}));

vi.mock("@/lib/seo", () => ({
  SITE_ORIGIN: "https://www.jimdrury.co.uk",
  getArticleCanonicalUrl: vi.fn(
    (story: { slug: string }) =>
      `https://www.jimdrury.co.uk/blog/ai/${story.slug}`,
  ),
}));

const makeStory = (overrides: Partial<Record<string, unknown>> = {}) => ({
  id: 42,
  name: "Test Article",
  slug: "test-article",
  full_slug: "blog/test-article",
  content: { component: "article", body: [] },
  tag_list: ["ai"],
  ...overrides,
});

describe("verifyWebhookSignature", () => {
  it("returns true for a valid signature", async () => {
    const { verifyWebhookSignature } = await import("@/lib/indexnow");
    const payload = '{"action":"story.published"}';
    const signature = createHmac("sha1", "test-webhook-secret")
      .update(payload)
      .digest("hex");

    expect(verifyWebhookSignature(payload, signature)).toBe(true);
  });

  it("returns false for an invalid signature", async () => {
    const { verifyWebhookSignature } = await import("@/lib/indexnow");
    expect(
      verifyWebhookSignature('{"action":"story.published"}', "bad-sig"),
    ).toBe(false);
  });

  it("returns false when signature is null", async () => {
    const { verifyWebhookSignature } = await import("@/lib/indexnow");
    expect(verifyWebhookSignature('{"action":"story.published"}', null)).toBe(
      false,
    );
  });

  it("returns false when secret is not configured", async () => {
    const envMod = await import("@/environment");
    const original = envMod.environment.STORYBLOK_WEBHOOK_SECRET;
    (envMod.environment as Record<string, unknown>).STORYBLOK_WEBHOOK_SECRET =
      undefined;

    const { verifyWebhookSignature } = await import("@/lib/indexnow");
    expect(verifyWebhookSignature('{"action":"test"}', "some-sig")).toBe(false);

    (envMod.environment as Record<string, unknown>).STORYBLOK_WEBHOOK_SECRET =
      original;
  });
});

describe("parseWebhookPayload", () => {
  it("parses a valid story.published payload", async () => {
    const { parseWebhookPayload } = await import("@/lib/indexnow");
    const payload = JSON.stringify({
      action: "story.published",
      text: "A story was published",
      story_id: 123,
      full_slug: "blog/my-article",
      space_id: 456,
    });

    expect(parseWebhookPayload(payload)).toEqual({
      action: "story.published",
      text: "A story was published",
      story_id: 123,
      full_slug: "blog/my-article",
      space_id: 456,
    });
  });

  it("returns null for invalid JSON", async () => {
    const { parseWebhookPayload } = await import("@/lib/indexnow");
    expect(parseWebhookPayload("not json")).toBeNull();
  });

  it("returns null for non-object JSON", async () => {
    const { parseWebhookPayload } = await import("@/lib/indexnow");
    expect(parseWebhookPayload('"string"')).toBeNull();
  });

  it("returns null when action is missing", async () => {
    const { parseWebhookPayload } = await import("@/lib/indexnow");
    expect(parseWebhookPayload('{"full_slug":"test"}')).toBeNull();
  });

  it("handles missing optional fields", async () => {
    const { parseWebhookPayload } = await import("@/lib/indexnow");
    const result = parseWebhookPayload('{"action":"story.unpublished"}');

    expect(result).toEqual({
      action: "story.unpublished",
      text: undefined,
      story_id: undefined,
      full_slug: undefined,
      space_id: undefined,
    });
  });
});

describe("resolveUrlsFromSlug", () => {
  it("returns canonical URL for blog posts with a story", async () => {
    const { resolveUrlsFromSlug } = await import("@/lib/indexnow");
    const story = makeStory();

    const urls = resolveUrlsFromSlug("blog/test-article", story as never);
    expect(urls).toEqual(["https://www.jimdrury.co.uk/blog/ai/test-article"]);
  });

  it("returns empty array for blog posts when story is not available", async () => {
    const { resolveUrlsFromSlug } = await import("@/lib/indexnow");

    const urls = resolveUrlsFromSlug("blog/test-article", null);
    expect(urls).toEqual([]);
  });

  it("maps 'home' slug to site root", async () => {
    const { resolveUrlsFromSlug } = await import("@/lib/indexnow");

    const urls = resolveUrlsFromSlug("home", null);
    expect(urls).toEqual(["https://www.jimdrury.co.uk/"]);
  });

  it("handles static pages", async () => {
    const { resolveUrlsFromSlug } = await import("@/lib/indexnow");

    const urls = resolveUrlsFromSlug("about", null);
    expect(urls).toEqual(["https://www.jimdrury.co.uk/about"]);
  });

  it("strips trailing slash from slug", async () => {
    const { resolveUrlsFromSlug } = await import("@/lib/indexnow");

    const urls = resolveUrlsFromSlug("about/", null);
    expect(urls).toEqual(["https://www.jimdrury.co.uk/about"]);
  });
});

describe("submitToIndexNow", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("sends correct payload to IndexNow API", async () => {
    const { submitToIndexNow } = await import("@/lib/indexnow");

    await submitToIndexNow(["https://www.jimdrury.co.uk/blog/ai/test-article"]);

    expect(fetchSpy).toHaveBeenCalledWith("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "www.jimdrury.co.uk",
        key: "abc123indexnowkey",
        keyLocation: "https://www.jimdrury.co.uk/abc123indexnowkey.txt",
        urlList: ["https://www.jimdrury.co.uk/blog/ai/test-article"],
      }),
    });
  });

  it("throws when INDEXNOW_KEY is not configured", async () => {
    const envMod = await import("@/environment");
    const original = envMod.environment.INDEXNOW_KEY;
    (envMod.environment as Record<string, unknown>).INDEXNOW_KEY = undefined;

    const { submitToIndexNow } = await import("@/lib/indexnow");

    await expect(
      submitToIndexNow(["https://www.jimdrury.co.uk/test"]),
    ).rejects.toThrow("INDEXNOW_KEY is not configured");

    (envMod.environment as Record<string, unknown>).INDEXNOW_KEY = original;
  });
});
