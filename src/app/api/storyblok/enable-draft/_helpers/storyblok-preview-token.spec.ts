import crypto from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  getSafeReturnTo,
  isValidStoryblokToken,
} from "./storyblok-preview-token";

vi.mock("@/environment", () => ({
  environment: {
    STORYBLOK_ACCESS_TOKEN: "test-preview-token",
    STORYBLOK_SPACE_ID: "12345",
  },
}));

const REQUEST_ORIGIN = "https://www.jimdrury.co.uk";
const SPACE_ID = "12345";
const ACCESS_TOKEN = "test-preview-token";

const hashToken = (timestamp: string): string => {
  return crypto
    .createHash("sha1")
    .update(`${SPACE_ID}:${ACCESS_TOKEN}:${timestamp}`)
    .digest("hex");
};

const currentTimestamp = (): string => {
  return String(Math.floor(Date.now() / 1000));
};

describe("getSafeReturnTo", () => {
  it("returns same-origin paths unchanged", () => {
    expect(getSafeReturnTo("/blog/ai/hello", REQUEST_ORIGIN)).toBe(
      "/blog/ai/hello",
    );
  });

  it("falls back to root when returnTo is missing", () => {
    expect(getSafeReturnTo(null, REQUEST_ORIGIN)).toBe("/");
    expect(getSafeReturnTo("", REQUEST_ORIGIN)).toBe("/");
  });

  it("rejects backslash protocol-relative open redirects", () => {
    expect(getSafeReturnTo("/\\evil.com", REQUEST_ORIGIN)).toBe("/");
  });

  it("rejects protocol-relative open redirects", () => {
    expect(getSafeReturnTo("//evil.com", REQUEST_ORIGIN)).toBe("/");
  });

  it("rejects tab-prefixed paths", () => {
    expect(getSafeReturnTo("\t/blog", REQUEST_ORIGIN)).toBe("/");
    expect(getSafeReturnTo("\t//evil.com", REQUEST_ORIGIN)).toBe("/");
  });

  it("rejects paths that contain @", () => {
    expect(getSafeReturnTo("/foo@bar", REQUEST_ORIGIN)).toBe("/");
  });

  it("stays on origin when the sanitized path is used as a redirect base", () => {
    const payloads = ["/\\evil.com", "//evil.com", "\t/blog", "/blog"];

    for (const payload of payloads) {
      const safePath = getSafeReturnTo(payload, REQUEST_ORIGIN);
      expect(new URL(safePath, REQUEST_ORIGIN).origin).toBe(REQUEST_ORIGIN);
    }
  });
});

describe("isValidStoryblokToken", () => {
  it("accepts a current, correctly hashed token", () => {
    const timestamp = currentTimestamp();

    expect(
      isValidStoryblokToken({
        spaceId: SPACE_ID,
        token: hashToken(timestamp),
        timestamp,
      }),
    ).toBe(true);
  });

  it("returns false for wrong-length tokens without throwing", () => {
    const timestamp = currentTimestamp();

    expect(() => {
      expect(
        isValidStoryblokToken({
          spaceId: SPACE_ID,
          token: "short",
          timestamp,
        }),
      ).toBe(false);
    }).not.toThrow();

    expect(() => {
      expect(
        isValidStoryblokToken({
          spaceId: SPACE_ID,
          token: `${hashToken(timestamp)}aa`,
          timestamp,
        }),
      ).toBe(false);
    }).not.toThrow();
  });
});
