import { describe, expect, it } from "vitest";
import { getStoryblokDraftEnableRedirects } from "./storyblok-preview-redirects";

describe("getStoryblokDraftEnableRedirects", () => {
  it("enables draft on / because /:path* does not match the homepage", () => {
    const redirects = getStoryblokDraftEnableRedirects();
    const root = redirects.find((redirect) => redirect.source === "/");

    expect(root).toMatchObject({
      destination: "/api/storyblok/enable-draft?returnTo=/",
      permanent: false,
    });
    expect(root?.has?.map((entry) => entry.key)).toEqual([
      "_storyblok",
      "_storyblok_tk[space_id]",
      "_storyblok_tk[timestamp]",
      "_storyblok_tk[token]",
    ]);
  });

  it("sends Visual Editor /home hits to / after draft is enabled", () => {
    const redirects = getStoryblokDraftEnableRedirects();
    const home = redirects.find((redirect) => redirect.source === "/home");

    expect(home?.destination).toBe("/api/storyblok/enable-draft?returnTo=/");
  });

  it("keeps the catch-all preview redirect for blog and other pages", () => {
    const redirects = getStoryblokDraftEnableRedirects();
    const catchAll = redirects.find(
      (redirect) => redirect.source === "/:path*",
    );

    expect(catchAll?.destination).toBe(
      "/api/storyblok/enable-draft?returnTo=/:path*",
    );
  });
});

describe("next.config preview redirects", () => {
  it("registers homepage draft enable before the /home 301", async () => {
    const nextConfig = (await import("../../next.config")).default;
    const redirects = await nextConfig.redirects?.();
    const sources = redirects?.map((redirect) => redirect.source);

    expect(sources?.slice(0, 3)).toEqual(["/", "/home", "/:path*"]);
    expect(redirects?.at(-1)).toMatchObject({
      source: "/home",
      destination: "/",
      statusCode: 301,
    });
  });
});
