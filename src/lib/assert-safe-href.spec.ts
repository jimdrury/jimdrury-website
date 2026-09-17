import { describe, expect, it } from "vitest";
import { assertSafeHref, getSafeHref } from "./assert-safe-href";

describe("assertSafeHref", () => {
  it("allows same-origin relative paths", () => {
    expect(assertSafeHref("/blog")).toBe("/blog");
    expect(assertSafeHref("/blog/ai/post?page=2#comments")).toBe(
      "/blog/ai/post?page=2#comments",
    );
    expect(assertSafeHref("  /about  ")).toBe("/about");
  });

  it("allows fragment-only hrefs", () => {
    expect(assertSafeHref("#section")).toBe("#section");
  });

  it("allows https URLs", () => {
    expect(assertSafeHref("https://www.example.com/path")).toBe(
      "https://www.example.com/path",
    );
    expect(assertSafeHref("HTTPS://EXAMPLE.COM")).toBe("https://example.com/");
  });

  it.each([
    "javascript:alert(1)",
    "JAVASCRIPT:alert(1)",
    " javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "//evil.com",
    "///evil.com",
    "http://example.com",
    "mailto:test@example.com",
    "blob:https://example.com/uuid",
    "file:///etc/passwd",
    "/\\evil.com",
    "java\tscript:alert(1)",
    "",
    "   ",
  ])("rejects %j", (href) => {
    expect(() => assertSafeHref(href)).toThrow("Unsafe href");
  });
});

describe("getSafeHref", () => {
  it("returns undefined for missing, blank, or unsafe values", () => {
    expect(getSafeHref(undefined)).toBeUndefined();
    expect(getSafeHref(null)).toBeUndefined();
    expect(getSafeHref("")).toBeUndefined();
    expect(getSafeHref("javascript:alert(1)")).toBeUndefined();
    expect(getSafeHref("//evil.com")).toBeUndefined();
  });

  it("returns the allowlisted href", () => {
    expect(getSafeHref("/blog")).toBe("/blog");
    expect(getSafeHref("https://example.com/x")).toBe("https://example.com/x");
  });
});
