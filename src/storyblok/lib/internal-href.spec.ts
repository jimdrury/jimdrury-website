import { describe, expect, it } from "vitest";

import { getNextLinkHref, normalizeRichTextHref } from "./internal-href";

describe("normalizeRichTextHref", () => {
  it("returns undefined when href and anchor are missing", () => {
    expect(normalizeRichTextHref(undefined)).toBeUndefined();
    expect(normalizeRichTextHref("   ")).toBeUndefined();
  });

  it("keeps relative and absolute hrefs", () => {
    expect(normalizeRichTextHref("/about")).toBe("/about");
    expect(normalizeRichTextHref("https://example.com/x")).toBe(
      "https://example.com/x",
    );
  });

  it("prefixes story slugs that omit a leading slash", () => {
    expect(normalizeRichTextHref("about", "story")).toBe("/about");
    expect(normalizeRichTextHref("blog/ai/post", "story")).toBe(
      "/blog/ai/post",
    );
    expect(normalizeRichTextHref("about#career")).toBe("/about#career");
  });

  it("does not rewrite hashes, absolute URLs, or already-relative story hrefs", () => {
    expect(normalizeRichTextHref("#section", "story")).toBe("#section");
    expect(normalizeRichTextHref("/about", "story")).toBe("/about");
    expect(
      normalizeRichTextHref("https://www.jimdrury.co.uk/about", "story"),
    ).toBe("https://www.jimdrury.co.uk/about");
  });

  it("appends a Storyblok anchor when href has no hash", () => {
    expect(normalizeRichTextHref("/about", "story", "team")).toBe(
      "/about#team",
    );
    expect(normalizeRichTextHref(undefined, "story", "team")).toBe("#team");
  });

  it("leaves an existing hash in place", () => {
    expect(normalizeRichTextHref("/about#existing", "story", "team")).toBe(
      "/about#existing",
    );
  });
});

describe("getNextLinkHref", () => {
  it("returns relative paths for Next.js routing", () => {
    expect(getNextLinkHref("/about")).toBe("/about");
    expect(getNextLinkHref("/blog/ai/post?page=2#comments")).toBe(
      "/blog/ai/post?page=2#comments",
    );
    expect(getNextLinkHref("about#career")).toBe("/about#career");
  });

  it("maps the homepage story slug to /", () => {
    expect(getNextLinkHref("/home")).toBe("/");
    expect(getNextLinkHref("/home/")).toBe("/");
    expect(getNextLinkHref("/home?utm=1#top")).toBe("/?utm=1#top");
  });

  it("rewrites same-origin absolute URLs to a site-relative path", () => {
    expect(getNextLinkHref("https://www.jimdrury.co.uk/about")).toBe("/about");
    expect(getNextLinkHref("https://jimdrury.co.uk/blog/ai/post#x")).toBe(
      "/blog/ai/post#x",
    );
    expect(getNextLinkHref("https://www.jimdrury.co.uk/home")).toBe("/");
  });

  it("returns undefined for fragments and external URLs", () => {
    expect(getNextLinkHref("#section")).toBeUndefined();
    expect(getNextLinkHref("https://example.com/about")).toBeUndefined();
    expect(getNextLinkHref("https://storyblok.com")).toBeUndefined();
    expect(getNextLinkHref("javascript:alert(1)")).toBeUndefined();
    expect(getNextLinkHref("not a url")).toBeUndefined();
    expect(getNextLinkHref("")).toBeUndefined();
  });
});
