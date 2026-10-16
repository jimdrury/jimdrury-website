import { cacheLife } from "next/cache";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isUnreleasedPublishedArticle,
  readCurrentUtcDay,
} from "./article-release";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

describe("readCurrentUtcDay", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the UTC day and expires at the next UTC midnight", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-12T12:00:00.000Z"));

    await expect(readCurrentUtcDay()).resolves.toBe("2026-10-12");
    expect(cacheLife).toHaveBeenCalledWith({
      stale: 60,
      revalidate: 43199,
      expire: 43200,
    });
  });
});

describe("isUnreleasedPublishedArticle", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("hides a future article and leaves pages alone without reading the clock", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-12T12:00:00.000Z"));

    await expect(
      isUnreleasedPublishedArticle({
        content: { component: "article" },
        first_published_at: "2099-01-01T00:00:00.000Z",
      }),
    ).resolves.toBe(true);
    await expect(
      isUnreleasedPublishedArticle({
        content: { component: "page" },
        first_published_at: "2099-01-01T00:00:00.000Z",
      }),
    ).resolves.toBe(false);
    await expect(isUnreleasedPublishedArticle(null)).resolves.toBe(false);
  });
});
