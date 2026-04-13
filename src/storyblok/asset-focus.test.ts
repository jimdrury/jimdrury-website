import { describe, expect, it } from "vitest";

import {
  sanitizeStoryblokFocusValue,
  storyblokFocusToObjectPositionPercent,
} from "./asset-focus";

describe("sanitizeStoryblokFocusValue", () => {
  it("accepts WxH:WxH", () => {
    expect(sanitizeStoryblokFocusValue("1964x892:1965x893")).toBe(
      "1964x892:1965x893",
    );
  });

  it("accepts WxH point", () => {
    expect(sanitizeStoryblokFocusValue("450x320")).toBe("450x320");
  });

  it("trims whitespace", () => {
    expect(sanitizeStoryblokFocusValue("  10x20  ")).toBe("10x20");
  });

  it("rejects invalid strings", () => {
    expect(sanitizeStoryblokFocusValue("50%x50%")).toBeUndefined();
    expect(sanitizeStoryblokFocusValue("")).toBeUndefined();
    expect(sanitizeStoryblokFocusValue(undefined)).toBeUndefined();
    expect(sanitizeStoryblokFocusValue("injection);drop//")).toBeUndefined();
  });
});

describe("storyblokFocusToObjectPositionPercent", () => {
  it("uses rectangle center", () => {
    expect(
      storyblokFocusToObjectPositionPercent("0x0:100x100", {
        width: 200,
        height: 200,
      }),
    ).toBe("25% 25%");
  });

  it("uses single point", () => {
    expect(
      storyblokFocusToObjectPositionPercent("100x50", {
        width: 200,
        height: 100,
      }),
    ).toBe("50% 50%");
  });
});
