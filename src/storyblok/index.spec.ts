import { beforeEach, describe, expect, it, vi } from "vitest";

const getMock = vi.fn();
const storyblokInitMock = vi.fn(() => ({ storyblokApi: { get: getMock } }));

vi.mock("@storyblok/js", () => ({
  apiPlugin: {},
  storyblokInit: storyblokInitMock,
}));

vi.mock("@/environment", () => ({
  environment: {
    STORYBLOK_ACCESS_TOKEN: "test-token",
    STORYBLOK_SPACE_ID: "12345",
    STORYBLOK_WEBHOOK_SECRET: "webhook-secret",
  },
}));

describe("getStoryblokApi", () => {
  it("stops the client attaching its own remembered cv", async () => {
    const { getStoryblokApi } = await import("./index");
    getStoryblokApi();

    expect(storyblokInitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        apiOptions: expect.objectContaining({
          cache: expect.objectContaining({ cv: "manual" }),
        }),
      }),
    );
  });
});

describe("getStoryblokCv", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it("returns the space version from spaces/me", async () => {
    getMock.mockResolvedValue({ data: { space: { version: 1_700_000_000 } } });

    const { getStoryblokCv } = await import("./index");

    await expect(getStoryblokCv()).resolves.toBe(1_700_000_000);
    expect(getMock).toHaveBeenCalledWith("cdn/spaces/me");
  });

  it("falls back to a cache-busting timestamp when spaces/me fails", async () => {
    getMock.mockRejectedValue(new Error("down"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.spyOn(Date, "now").mockReturnValue(42);

    const { getStoryblokCv } = await import("./index");

    await expect(getStoryblokCv()).resolves.toBe(42);
    expect(warn).toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});

describe("getStoryblokCvParams", () => {
  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue({ data: { space: { version: 7 } } });
  });

  it("includes cv for published content", async () => {
    const { getStoryblokCvParams } = await import("./index");
    await expect(getStoryblokCvParams("published")).resolves.toEqual({ cv: 7 });
  });

  it("omits cv for draft content", async () => {
    const { getStoryblokCvParams } = await import("./index");
    await expect(getStoryblokCvParams("draft")).resolves.toEqual({});
    expect(getMock).not.toHaveBeenCalled();
  });
});
