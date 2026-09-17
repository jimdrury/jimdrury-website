import { describe, expect, it } from "vitest";
import {
  buildPaginationHref,
  getPageFromPathname,
  parsePageParam,
} from "./blog-listings-utils";

describe("parsePageParam", () => {
  it("defaults to page 1", () => {
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
  });

  it("parses valid page numbers", () => {
    expect(parsePageParam("2")).toBe(2);
    expect(parsePageParam("12")).toBe(12);
  });
});

describe("getPageFromPathname", () => {
  it("returns page 1 when the path has no pagination segment", () => {
    expect(getPageFromPathname("/blog")).toBe(1);
    expect(getPageFromPathname("/about")).toBe(1);
  });

  it("reads the trailing /page/N segment", () => {
    expect(getPageFromPathname("/blog/page/2")).toBe(2);
    expect(getPageFromPathname("/blog/page/4")).toBe(4);
  });
});

describe("buildPaginationHref", () => {
  it("returns the base path for page 1", () => {
    expect(buildPaginationHref("/blog", 1)).toBe("/blog");
    expect(buildPaginationHref("/blog/page/3", 1)).toBe("/blog");
  });

  it("appends /page/N for later pages", () => {
    expect(buildPaginationHref("/blog", 2)).toBe("/blog/page/2");
    expect(buildPaginationHref("/blog/page/2", 3)).toBe("/blog/page/3");
  });
});
