import { describe, expect, it, vi } from "vitest";
import {
  classifyStoryblokError,
  getStoryblokErrorStatus,
  mapStoryblokFetchError,
  StoryblokUnavailableError,
} from "./storyblok-errors";

describe("getStoryblokErrorStatus", () => {
  it("reads status from the error object", () => {
    expect(getStoryblokErrorStatus({ status: 429 })).toBe(429);
  });

  it("reads nested response status from Storyblok client errors", () => {
    expect(getStoryblokErrorStatus({ response: { status: 401 } })).toBe(401);
  });

  it("ignores non-positive statuses used for network failures", () => {
    expect(getStoryblokErrorStatus({ status: 0 })).toBeUndefined();
  });
});

describe("classifyStoryblokError", () => {
  it("maps 404 to not-found", () => {
    expect(classifyStoryblokError({ status: 404 })).toBe("not-found");
  });

  it("maps 401, 429, and 5xx to unavailable", () => {
    expect(classifyStoryblokError({ status: 401 })).toBe("unavailable");
    expect(classifyStoryblokError({ status: 429 })).toBe("unavailable");
    expect(classifyStoryblokError({ status: 503 })).toBe("unavailable");
  });

  it("maps network errors without a status to unavailable", () => {
    expect(classifyStoryblokError(new Error("ECONNRESET"))).toBe("unavailable");
  });
});

describe("mapStoryblokFetchError", () => {
  it("returns null for true not-found errors", () => {
    expect(
      mapStoryblokFetchError(
        { status: 404 },
        { slug: "about", version: "published" },
      ),
    ).toBeNull();
  });

  it("throws StoryblokUnavailableError and logs slug, version, and status", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    expect(() => {
      mapStoryblokFetchError(
        { status: 429 },
        { slug: "blog/test-article", version: "draft" },
      );
    }).toThrow(StoryblokUnavailableError);

    expect(consoleError).toHaveBeenCalledWith("Storyblok request failed", {
      slug: "blog/test-article",
      version: "draft",
      status: 429,
    });

    consoleError.mockRestore();
  });
});
